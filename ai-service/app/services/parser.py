import spacy
from app.utils.text_extractor import extract_text
from app.services.analyzer import analyze_resume_quality

# Load the small English NLP model. 
# In production, a custom NER model trained on technical skills would be used here.
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading spacy model...")
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# A master list of rudimentary skills to match against text (acting as pseudo-NER)
KNOWN_SKILLS = {
    "python", "java", "javascript", "java script", "react", "node.js", "express", "express.js",
    "mysql", "postgresql", "nosql", "sql", "html", "css", "bootstrap", "machine learning", "data analysis",
    "git", "aws", "docker", "agile", "c++", "c#", "cyber security", "network security", 
    "linux", "ethical hacking", "pandas", "hibernate", "spring boot", "mern stack", "typescript",
    "cloud computing", "devops", "apis", "api", "serverless", "microservices", "ci/cd", 
    "artificial intelligence", "frontend", "backend", "full stack", "fullstack", "web development", "kubernetes", "azure", "gcp"
}

def parse_resume(file_content: bytes, filename: str) -> dict:
    """
    Parses the raw file content and extracts skills using spaCy.
    """
    # 1. Extract text
    raw_text = extract_text(file_content, filename)
    
    # 2. Process text with spaCy
    doc = nlp(raw_text)
    
    extracted_skills = set()
    
    # Basic keyword extraction matching our known dictionary
    # In a real AI system, we extract custom named entities defined as 'SKILL'
    for token in doc:
        word = token.text.lower()
        if word in KNOWN_SKILLS:
            extracted_skills.add(word)
            
    # Also check multi-word or special-character skills (like node.js)
    text_lower = raw_text.lower()
    for skill in KNOWN_SKILLS:
        if (" " in skill or "." in skill or "+" in skill or "#" in skill) and skill in text_lower:
            extracted_skills.add(skill)

    # Complex edge cases
    if "java script" in extracted_skills or "javascript" in extracted_skills:
        # Check if 'java' was extracted solely because of 'java script'
        import re
        standalone_java = len(re.findall(r'\bjava\b(?!\s*script)', text_lower))
        if standalone_java == 0 and "java" in extracted_skills:
            extracted_skills.remove("java")

    # Calculate basic metrics for scoring
    word_count = len(doc)
    
    # 3. Analyze resume quality
    analysis = analyze_resume_quality(raw_text, list(extracted_skills), word_count)
    
    return {
        "text_length": word_count,
        "skills_extracted": list(extracted_skills),
        "evaluation": analysis,
        "raw_text_preview": raw_text[:500] if raw_text else ""
    }

def extract_text_skills(raw_text: str) -> list:
    """
    Parses generic raw text (e.g., from Wikipedia) and extracts skills using spaCy.
    """
    doc = nlp(raw_text)
    extracted_skills = set()
    
    for token in doc:
        word = token.text.lower()
        if word in KNOWN_SKILLS:
            extracted_skills.add(word)
            
    text_lower = raw_text.lower()
    for skill in KNOWN_SKILLS:
        if (" " in skill or "." in skill or "+" in skill or "#" in skill) and skill in text_lower:
            extracted_skills.add(skill)

    if "java script" in extracted_skills or "javascript" in extracted_skills:
        import re
        standalone_java = len(re.findall(r'\bjava\b(?!\s*script)', text_lower))
        if standalone_java == 0 and "java" in extracted_skills:
            extracted_skills.remove("java")

    return list(extracted_skills)
