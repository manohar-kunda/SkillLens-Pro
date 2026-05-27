"""
-------------------------------------------------------
File: llm_engine.py
Purpose: Powers all Large Language Model integrations using the Groq API
and implements robust fallback matching when APIs are unavailable.

Responsibilities:
- Coordinates API connections with Groq SDK
- Provides automated model retry sequencing (llama-3.3 -> llama-3.1 -> mixtral)
- Formats prompts for resume comparison matching, roadmaps, and quiz questions
- Serves offline roadmap architectures and voice question banks on network failure

Dependencies:
- groq
- dotenv
- app.services.static_kb (STATIC_ROADMAPS, STATIC_QUESTIONS, STATIC_REPLIES)
- app.services.analyzer (calculate_fallback_score)

Author: Manohar Kunda
-------------------------------------------------------
"""

import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Configure Groq Client
api_key = os.getenv("GROQ_API_KEY")
client = None
if api_key:
    client = Groq(api_key=api_key)

MODEL_FALLBACKS = [
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'mixtral-8x7b-32768'
]

def safe_generate_content(prompt: str, response_mime_type: str = 'application/json'):
    """
    Safely generates content from the LLM, managing automatic model failover sequences
    and JSON formatting constraints.

    :param prompt: String prompt query
    :param response_mime_type: Target return format (e.g. 'application/json')
    :return: LLM text content response
    :raises: Exception if all fallback models fail
    """
    last_error = ""
    want_json = (response_mime_type == 'application/json')
    system_prompt = (
        "You are a strict JSON generator. Return ONLY valid JSON. No markdown, no code fences, no extra text."
        if want_json else
        "You are SkillLens AI, a helpful career development mentor. Be concise and professional."
    )

    for model_name in MODEL_FALLBACKS:
        try:
            print(f"[AI] Attempting generation with Groq {model_name}...")

            # Build kwargs conditionally — never pass response_format=None to Groq
            create_kwargs = {
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                "model": model_name,
                "temperature": 0.6,
                "max_tokens": 2048
            }
            if want_json:
                create_kwargs["response_format"] = {"type": "json_object"}

            chat_completion = client.chat.completions.create(**create_kwargs)
            return chat_completion.choices[0].message.content
        except Exception as e:
            last_error = str(e)
            print(f"[AI] Groq {model_name} failed: {last_error}")
            continue  # Always try next model

    raise Exception(f"All Groq AI models failed. Last error: {last_error}")

def score_resume_vs_job(resume_text: str, job_description: str) -> dict:
    """
    Performs ATS overlap evaluations comparing a candidate resume against a target job role.

    :param resume_text: Extracted plain text of user's resume
    :param job_description: Target job description parameters
    :return: A dict containing score (0-100), matches array, and missing skills checklist
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
    Lists the top 10 most relevant technical skills for a specific job title.

    :param role_name: Name of target job profile
    :return: A list of 10 skill keywords
    """
    if not client:
        return []

    prompt = f"List the top 10 most relevant technical skills for a successful '{role_name}'. Return ONLY a JSON object like: {{\\\"data\\\": [\\\"skill1\\\", \\\"skill2\\\"]}}"
    
    try:
        response_text = safe_generate_content(prompt)
        parsed = json.loads(response_text)
        skills = parsed.get("data", []) if isinstance(parsed, dict) else []
        return skills if isinstance(skills, list) else []
    except Exception as e:
        print(f"[AI] Error generating skills: {str(e)}")
        return []

def get_job_role_suggestions(partial_text: str) -> list:
    """
    Suggests 5 popular, relevant IT job roles matching a search substring.

    :param partial_text: Substring query
    :return: A list of 5 job role name suggestions
    """
    if not client:
        return []

    prompt = f"Based on '{partial_text}', suggest exactly 5 popular IT job roles. Return ONLY a JSON object like: {{\\\"data\\\": [\\\"role1\\\", \\\"role2\\\"]}}"
    
    try:
        response_text = safe_generate_content(prompt)
        print(f"[AI] Raw Suggestions Response: {response_text}")
        parsed = json.loads(response_text)
        suggestions = parsed.get("data", []) if isinstance(parsed, dict) else []
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
    Generates a structured, professional hierarchical learning roadmap for a role.

    :param role_name: Name of target job profile
    :return: A dict outlining categories, descriptions, and skill checklists
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
    Manages interactive chat conversations, defaulting to high-quality in-memory fallbacks.

    :param message: The user-supplied input query
    :param history: List of historical chat logs
    :return: AI mentor's text reply (in markdown)
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

    :param role: The target job title
    :param difficulty: The difficulty level ('easy', 'medium', 'hard')
    :return: A list of 3 questions
    """
    prompt = f"Generate 3 open-ended technical interview questions for a '{role}' at '{difficulty}' level. Return ONLY a JSON object like: {{\\\"questions\\\": [\\\"q1\\\", \\\"q2\\\", \\\"q3\\\"]}}"
    
    try:
        response_text = safe_generate_content(prompt)
        parsed = json.loads(response_text)
        questions = parsed.get("questions", []) if isinstance(parsed, dict) else []
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
    Grades a speech-to-text response transcript against a technical question.

    :param question: The question being answered
    :param user_answer_transcript: User's transcribed answer transcript
    :return: A dict containing score (1-10), feedback text, and accuracy flag
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
            return {"score": 8, "feedback": "Comprehensive answer with good detail. Keep it up!", "is_accurate": True}ccurate": True}
