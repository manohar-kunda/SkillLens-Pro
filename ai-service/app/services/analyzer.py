"""
-------------------------------------------------------
File: analyzer.py
Purpose: Evaluates formatting quality of uploaded resumes and computes
relational skill-overlap matches for fallback scenarios.

Responsibilities:
- Runs checks on structural presence (Education, Projects, Experience sections)
- Scores length/communication quality of resume text
- Conducts local fallback scoring arithmetic when LLMs are disconnected
- Extracts stop-words and evaluates token overlaps

Dependencies:
- re
- app.services.static_kb (STATIC_ROADMAPS)

Author: Manohar Kunda
-------------------------------------------------------
"""

import re

def analyze_resume_quality(text: str, extracted_skills: list, word_count: int) -> dict:
    """
    Evaluates basic resume formatting structure and communication density to score it out of 100.

    Checks:
    - 30pts structural presence (Education, Projects, Experience)
    - 20pts word count volume
    - 50pts technical skill diversity

    :param text: Raw text block of the resume
    :param extracted_skills: List of extracted skill strings
    :param word_count: Number of words in the resume
    :return: A dict outlining quality score (0-100), feedback list, and category breakdown
    """
    text_lower = text.lower()
    score = 100
    feedback = []

    # 1. Section Checks (Structure Score - 30 points)
    sections = {
        "education": ["education", "academic", "university", "college"],
        "experience": ["experience", "employment", "work history"],
        "projects": ["projects", "personal projects", "portfolio"]
    }
    
    structure_score = 30
    for section, keywords in sections.items():
        found = any(keyword in text_lower for keyword in keywords)
        if not found:
            structure_score -= 10
            feedback.append(f"Missing '{section.capitalize()}' section.")
            
    # 2. Length Check (Communication Score - 20 points)
    length_score = 20
    if word_count < 150:
        length_score -= 10
        feedback.append("Resume is too short, consider adding more details about your experience.")
    elif word_count > 1000:
        length_score -= 5
        feedback.append("Resume is quite long, consider condensing it to highlight key achievements.")

    # 3. Skills Check (Technical Score - 50 points)
    skills_score = 50
    if len(extracted_skills) == 0:
        skills_score -= 40
        feedback.append("No technical skills were detected. Add a 'Skills' section.")
    elif len(extracted_skills) < 3:
        skills_score -= 20
        feedback.append("Very few technical skills detected. List specific technologies you know.")

    # Calculate final score
    total_score = structure_score + length_score + skills_score

    if not feedback:
        feedback.append("Great resume structure and content!")

    return {
        "score": total_score,
        "breakdown": {
            "structure": structure_score,
            "length_communication": length_score,
            "technical_skills": skills_score
        },
        "feedback": feedback
    }

def calculate_fallback_score(resume_text: str, job_description: str) -> dict:
    """
    Calculates overlap scores when LLM connectors are offline, comparing resume text against
    known static job catalog roles or tokenized job requirement terms.

    :param resume_text: User resume text
    :param job_description: Target job requirements text
    :return: A dict outlining score (0-100), matches array, and missing skills checklist
    """
    from app.services.static_kb import STATIC_ROADMAPS

    resume_lower = resume_text.lower()
    job_lower = job_description.lower()
    matched_role_skills = []

    # Try to match to a known role in the KB
    for role_key, role_data in STATIC_ROADMAPS.items():
        if role_key.lower() in job_lower or job_lower.split(':')[-1].strip().lower() in role_key.lower():
            for category in role_data.get('roadmap', []):
                # Each category has 'category' name and 'skills' list of plain strings
                matched_role_skills.extend(category.get('skills', []))
            break

    # If no KB role matched, extract meaningful words from the job description
    if not matched_role_skills:
        stop_words = {
            'and', 'the', 'is', 'for', 'with', 'a', 'an', 'of', 'in', 'to',
            'experience', 'knowledge', 'skills', 'role', 'developer', 'engineer',
            'technologies', 'required', 'job', 'this', 'that', 'by', 'from', 'it',
            'be', 'as', 'on', 'at', 'core', 'industry', 'standards', 'title', 'based'
        }
        words = re.findall(r'[a-z][a-z0-9+#.]*', job_lower)
        matched_role_skills = list(set(w for w in words if len(w) > 2 and w not in stop_words))

    if not matched_role_skills:
        return {"score": 15, "matches": [], "missing": [], "suggestions": ["Could not determine required skills for this role."]}

    def skill_in_resume(skill: str, resume_text: str) -> bool:
        """Check if any meaningful token from the skill name appears in the resume."""
        # Extract meaningful words/tokens from a skill like "React.js / Next.js"
        tokens = re.findall(r'[a-z][a-z0-9+#]*', skill.lower())
        # Filter very short or generic tokens
        skip = {'and', 'or', 'api', 'the', 'js', 'css', 'db', 'ml'}
        core_tokens = [t for t in tokens if len(t) > 2 and t not in skip]
        if not core_tokens:
            return False
        # Match if ANY core token appears in the resume
        return any(re.search(r'\b' + re.escape(t) + r'\b', resume_text) for t in core_tokens)

    matches = []
    missing = []
    for skill in matched_role_skills:
        if skill_in_resume(skill, resume_lower):
            matches.append(skill)
        else:
            missing.append(skill)

    match_count = len(matches)
    total_count = len(matched_role_skills)
    score = int((match_count / total_count) * 100) if total_count else 10
    score = min(max(score, 10), 95)

    suggestions = []
    top_missing = missing[:5]
    if top_missing:
        suggestions.append(f"Consider adding these skills to your resume: {', '.join(top_missing)}")
    if score < 40:
        suggestions.append("Your resume may need significant additions to meet this role's requirements.")
    elif score < 70:
        suggestions.append("A decent match — consider strengthening a few key skill areas.")
    else:
        suggestions.append("Great alignment with this role's core requirements!")

    return {
        "score": score,
        "matches": matches[:15],
        "missing": missing[:10],
        "suggestions": suggestions
    }

