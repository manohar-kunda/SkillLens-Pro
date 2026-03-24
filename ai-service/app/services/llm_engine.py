import os
import json
import re
from google import genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini Client
api_key = os.getenv("GEMINI_API_KEY")
client = None
if api_key:
    client = genai.Client(api_key=api_key)

MODEL_FALLBACKS = [
    'gemini-flash-lite-latest',
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash',
    'gemini-flash-latest'
]

def safe_generate_content(prompt: str, response_mime_type: str = 'application/json'):
    last_error = ""
    for model_name in MODEL_FALLBACKS:
        try:
            print(f"[AI] Attempting generation with {model_name}...")
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config={'response_mime_type': response_mime_type}
            )
            return response.text
        except Exception as e:
            last_error = str(e)
            print(f"[AI] Model {model_name} failed: {last_error}")
            if "exhausted" in last_error.lower() or "quota" in last_error.lower() or "429" in last_error:
                continue # Try next model
            break # Non-quota error, don't retry
    
    raise Exception(f"All AI models failed. Last error: {last_error}")

def score_resume_vs_job(resume_text: str, job_description: str) -> dict:
    """
    Uses Gemini to compare a resume against a job description.
    """
    if not client:
        return {"score": 0, "error": "API key not configured", "matches": [], "missing": [], "suggestions": []}

    prompt = f"""
    You are an expert ATS (Applicant Tracking System). Analyze the resume against the job description.
    Resume: {resume_text}
    Job Description: {job_description}
    Return ONLY a JSON object with:
    {{
      "score": 0-100,
      "matches": ["skill1", "skill2"],
      "missing": ["skill3", "skill4"],
      "suggestions": ["improvement1", "improvement2"]
    }}
    """
    
    try:
        response_text = safe_generate_content(prompt)
        return json.loads(response_text)
    except Exception as e:
        print(f"[AI] Error in scoring: {str(e)}")
        from app.services.analyzer import calculate_fallback_score
        return calculate_fallback_score(resume_text, job_description)

def generate_skills_for_role(role_name: str) -> list:
    """
    Generates a list of 10 technical skills for a job role.
    """
    if not client:
        return []

    prompt = f"List the top 10 most relevant technical skills for a successful '{role_name}'. Return ONLY a JSON array of strings."
    
    try:
        response_text = safe_generate_content(prompt)
        skills = json.loads(response_text)
        return skills if isinstance(skills, list) else []
    except Exception as e:
        print(f"[AI] Error generating skills: {str(e)}")
        return []

def get_job_role_suggestions(partial_text: str) -> list:
    """
    Suggests 5 relevant job roles based on partial input.
    """
    if not client:
        return []

    prompt = f"Based on '{partial_text}', suggest exactly 5 popular IT job roles. Return ONLY a JSON array of strings."
    
    try:
        response_text = safe_generate_content(prompt)
        print(f"[AI] Raw Suggestions Response: {response_text}")
        suggestions = json.loads(response_text)
        return suggestions if isinstance(suggestions, list) else []
    except Exception as e:
        print(f"[AI] Error getting suggestions: {str(e)}")
        
        # Static Job Suggestions Fallback
        common_roles = [
            "Frontend Developer", "Backend Developer", "Full Stack Developer",
            "Data Scientist", "Python Developer", "DevOps Engineer",
            "Software Engineer", "MERN Stack Developer", "Java Developer",
            "UI/UX Designer", "Cybersecurity Analyst", "Cloud Architect"
        ]
        
        search = partial_text.lower()
        matches = [role for role in common_roles if search in role.lower()]
        return matches[:5] if matches else common_roles[:5]

def generate_hierarchical_roadmap(role_name: str) -> dict:
    """
    Generates a structured, professional Roadmap.sh-style guide for a job role.
    """
    if not client:
        return _static_roadmap_lookup(role_name)

    prompt = f"""
    Generate a professional, hierarchical learning roadmap for the role '{role_name}'.
    Group skills into 4-5 logical categories with specific technologies, tools, and concepts.
    Each category must have 4-6 real, specific skills (not generic phrases like "Core Concepts").
    Return ONLY JSON: {{"role": "{role_name}", "description": "short professional description", "roadmap": [{{"category": "Category Name", "skills": ["Specific Skill 1", "Specific Skill 2", "Specific Skill 3", "Specific Skill 4"]}}]}}
    """
    
    try:
        response_text = safe_generate_content(prompt)
        print(f"[AI] Raw Roadmap Response: {response_text}")
        roadmap_data = json.loads(response_text)
        if isinstance(roadmap_data, dict) and roadmap_data.get("roadmap"):
            return roadmap_data
        return _static_roadmap_lookup(role_name)
    except Exception as e:
        print(f"[AI] Error generating hierarchical roadmap: {str(e)}")
        return _static_roadmap_lookup(role_name)


def _static_roadmap_lookup(role_name: str) -> dict:
    """
    Smart multi-strategy lookup against the Static Knowledge Base.
    Tries: exact match → strip suffixes → partial match → dynamic generation.
    """
    from app.services.static_kb import STATIC_ROADMAPS

    role_lower = role_name.lower().strip()

    # 1. Exact match
    if role_lower in STATIC_ROADMAPS:
        print(f"[SKB] Exact match for '{role_lower}'")
        return STATIC_ROADMAPS[role_lower]

    # 2. Strip common suffixes and try again
    suffixes = [" developer", " engineer", " analyst", " specialist", " architect", " designer", " scientist"]
    stripped = role_lower
    for suffix in suffixes:
        if stripped.endswith(suffix):
            stripped = stripped[: -len(suffix)].strip()
            break
    if stripped != role_lower and stripped in STATIC_ROADMAPS:
        print(f"[SKB] Suffix-stripped match: '{stripped}'")
        return STATIC_ROADMAPS[stripped]

    # 3. Partial / keyword match
    for key, data in STATIC_ROADMAPS.items():
        if key in role_lower or role_lower in key:
            print(f"[SKB] Partial match: '{key}' for role '{role_lower}'")
            result = dict(data)
            result["role"] = role_name  # Use the actual requested role name
            return result

    # 4. Word-level match — any keyword in the role name matches a KB key
    role_words = set(role_lower.split())
    for key, data in STATIC_ROADMAPS.items():
        key_words = set(key.split())
        if role_words & key_words:  # Intersection: any common word
            print(f"[SKB] Word-level match: '{key}' for role '{role_lower}'")
            result = dict(data)
            result["role"] = role_name
            return result

    # 5. Smart dynamic fallback using role words as skill hints
    print(f"[SKB] No match found for '{role_lower}', generating dynamic fallback")
    skill_hints = [w.capitalize() for w in role_lower.split() if len(w) > 3 and w not in {"with", "and", "for", "the", "senior", "junior", "lead"}]
    if not skill_hints:
        skill_hints = [role_name]

    return {
        "role": role_name,
        "description": f"A structured learning path for mastering the {role_name} role with industry-standard technologies.",
        "roadmap": [
            {"category": "Programming & Languages", "skills": [f"{role_name} Core Language", "Version Control (Git)", "Command Line / Terminal", "Problem Solving & DSA"]},
            {"category": "Key Technologies & Frameworks", "skills": skill_hints + ["Relevant Frameworks", "Libraries & SDKs"]},
            {"category": "Databases & Storage", "skills": ["SQL (PostgreSQL / MySQL)", "NoSQL (MongoDB / Redis)", "Data Modeling", "Query Optimization"]},
            {"category": "Tools & DevOps", "skills": ["Docker & Containerization", "CI/CD Pipelines", "Cloud Platform (AWS / GCP / Azure)", "Monitoring & Logging"]},
            {"category": "Professional Skills", "skills": ["System Design & Architecture", "Code Review & Testing", "Agile & Scrum", "API Design & Integration"]}
        ]
    }
def chat_with_ai(message: str, history: list = None) -> str:
    """
    Handles general chat queries with model fallback resiliency.
    """
    if not client:
        return "I'm sorry, my AI brain isn't connected right now."

    # Format history for the prompt if provided
    history_context = ""
    if history:
        for entry in history:
            role = "User" if entry.get('role') == 'user' else "AI"
            history_context += f"{role}: {entry.get('parts', [{}])[0].get('text', '')}\n"

    system_instruction = "You are SkillLens AI, a professional technical mentor. Keep responses concise and use markdown."
    prompt = f"{system_instruction}\n\nExisting Conversation:\n{history_context}\nUser: {message}\nAI:"
    
    try:
        # Use text/plain for general chat to avoid JSON parsing errors
        return safe_generate_content(prompt, 'text/plain')
    except Exception as e:
        print(f"[AI] Chat Error: {str(e)}")
        
        # Static Replies Fallback
        search_msg = re.sub(r'[^a-zA-Z0-9\s]', '', message.lower()).strip()
        from app.services.static_kb import STATIC_REPLIES
        
        # 1. Try Keyword Matching
        matches = []
        print(f"[DEBUG] Chat Fallback | search_msg: '{search_msg}'")
        
        # Check if they are asking about a roadmap role
        from app.services.static_kb import STATIC_ROADMAPS
        for role_key, role_data in STATIC_ROADMAPS.items():
            if role_key in search_msg:
                role_name = role_data.get('role', role_key.title())
                matches.append((len(role_key) * 2, f"It looks like you're exploring the **{role_name}** path! 🚀\n\nTo get the most value, I recommend navigating to the **Career Discovery** section on your dashboard and searching for '{role_name}'. I will generate a comprehensive, 5-step interactive learning roadmap specifically tailored to that role!"))

        for key, reply in STATIC_REPLIES.items():
            # Match if key is in the message as a distinct word (case-insensitive) or partial (javaa -> java)
            if key.lower() in search_msg:
                print(f"[DEBUG] Match Found | key: '{key}'")
                matches.append((len(key), reply))
        
        if matches:
            matches.sort(key=lambda x: x[0], reverse=True)
            return f"**[Mentorship Mode]** {matches[0][1]}"
                
        # 2. Professional System Fallbacks
        fallbacks = [
            "SkillLens AI is currently experiencing high demand. While live chat generation is paused to prioritize resume analysis, I highly recommend exploring the **Career Discovery** tool horizontally across your dashboard to generate robust learning roadmaps.",
            "Live chat is temporarily operating in Offline Mode to preserve server resources. **Pro Tip:** Quality over quantity—focusing on building 2 highly polished GitHub projects often yields better interview conversion rates than 10 basic tutorials.",
            "Our servers are currently prioritizing roadmap generation and document processing. Feel free to use the main dashboard tools, or try asking me about fundamental topics like 'Java', 'React', 'Full Stack', or 'Machine Learning'.",
            "SkillLens AI is in High-Traffic Offline Mode. To maximize your chances in the tech industry, remember that consistent networking on LinkedIn and targeted resume tailoring are your best assets. Check out the **Mock Interview** section!"
        ]
        import random
        return f"**[Mentorship Mode]** {random.choice(fallbacks)}"

def generate_open_questions(role: str, difficulty: str = 'medium') -> list:
    """
    Generates 3 open-ended technical questions for a voice interview.
    """
    prompt = f"Generate 3 open-ended technical interview questions for a '{role}' at '{difficulty}' level. Return ONLY a JSON array of strings."
    
    try:
        response_text = safe_generate_content(prompt)
        questions = json.loads(response_text)
        return questions if isinstance(questions, list) else []
    except Exception as e:
        print(f"[AI] Error generating questions: {str(e)}")
        
        # Static Fallback
        from app.services.static_kb import STATIC_QUESTIONS
        role_key = role.lower().replace(" developer", "").replace(" engineer", "").strip()
        diff_key = difficulty.lower()
        
        if role_key in STATIC_QUESTIONS and diff_key in STATIC_QUESTIONS[role_key]:
            return STATIC_QUESTIONS[role_key][diff_key]
            
        return [
            f"Can you explain your experience with {role} development?",
            f"What is the most challenging technical problem you've solved in {role}?",
            f"How do you stay updated with the latest trends in {role}?"
        ]

def evaluate_voice_answer(question: str, user_answer_transcript: str) -> dict:
    """
    Evaluates a voice-to-text transcript against a technical question.
    """
    prompt = f"""
    Evaluate this technical interview answer. 
    Question: {question}
    User Answer: {user_answer_transcript}
    
    Return ONLY a JSON object with:
    {{
      "score": 0-10,
      "feedback": "constructive feedback",
      "is_accurate": true/false
    }}
    """
    
    try:
        response_text = safe_generate_content(prompt)
        return json.loads(response_text)
    except Exception as e:
        print(f"[AI] Error evaluating answer: {str(e)}")
        
        # Static Fallback Evaluation
        word_count = len(user_answer_transcript.split())
        if word_count < 10:
            return {"score": 3, "feedback": "Your answer was too brief. Try to explain the concepts in more detail.", "is_accurate": False}
        elif word_count < 30:
            return {"score": 6, "feedback": "Good start, but could use more technical specifics and examples.", "is_accurate": True}
        else:
            return {"score": 8, "feedback": "Comprehensive answer with good detail. Keep it up!", "is_accurate": True}
