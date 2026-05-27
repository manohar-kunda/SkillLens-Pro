"""
-------------------------------------------------------
File: main.py
Purpose: Main entry point for the FastAPI AI microservice.

Responsibilities:
- Exposes REST endpoints for resume parsing, skills extraction, ATS scoring, and interview quiz generation.
- Validates payload schemas using Pydantic models.
- Orchestrates NLP tasks (via spaCy) and LLM tasks (via Groq llama fallbacks).

Dependencies:
- fastapi
- uvicorn
- pydantic
- app.services (parser, llm_engine)

Author: Manohar Kunda
-------------------------------------------------------
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
import uvicorn
from pydantic import BaseModel
from app.services.parser import parse_resume
from app.services.llm_engine import score_resume_vs_job, get_job_role_suggestions, generate_hierarchical_roadmap, chat_with_ai, generate_open_questions, evaluate_voice_answer

app = FastAPI(title="SkillLens AI Service", description="AI parsing engine for SkillLens")

@app.get("/health")
def health_check():
    """
    System health status probe.
    """
    return {"status": "success", "message": "AI Service is running"}

class TextPayload(BaseModel):
    text: str

class ScorePayload(BaseModel):
    resume_text: str
    job_description: str

class ChatPayload(BaseModel):
    message: str
    history: list = None

class InterviewQuestionPayload(BaseModel):
    role: str
    difficulty: str = 'medium'

class InterviewEvaluatePayload(BaseModel):
    question: str
    answer: str

@app.post("/api/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    """
    Accepts binary PDF/DOCX file uploads, extracts raw text, and analyzes skill matches.
    """
    if not file.filename.endswith(('.pdf', '.docx', '.doc')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    try:
        content = await file.read()
        parsed_data = parse_resume(content, file.filename)
        return {"status": "success", "data": parsed_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/extract-text")
async def extract_skills_from_text(payload: TextPayload):
    """
    Extracts skill keyword tokens from plain text blocks using spaCy tokenizer rules.
    """
    from app.services.parser import extract_text_skills
    if not payload.text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    try:
        skills = extract_text_skills(payload.text)
        return {"status": "success", "skills": skills}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/score-resume")
async def score_resume_endpoint(payload: ScorePayload):
    """
    Scores a resume against a target job role description using Groq/llama or overlap arithmetic fallbacks.
    """
    if not payload.resume_text or not payload.job_description:
        raise HTTPException(status_code=400, detail="Resume text and job description are required")
    try:
        result = score_resume_vs_job(payload.resume_text, payload.job_description)
        return {"status": "success", **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/job-suggestions")
async def job_suggestions_endpoint(q: str = ""):
    """
    Suggests 5 popular matching IT job roles based on partial characters search string.
    """
    if not q:
        return {"status": "success", "suggestions": []}
    try:
        suggestions = get_job_role_suggestions(q)
        return {"status": "success", "suggestions": suggestions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-skills")
async def generate_skills_endpoint(payload: TextPayload):
    """
    Generates a structured, hierarchical learning roadmap guide for a job role name.
    """
    if not payload.text:
        raise HTTPException(status_code=400, detail="Role name cannot be empty")
    try:
        roadmap_data = generate_hierarchical_roadmap(payload.text)
        return {"status": "success", "data": roadmap_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat_endpoint(payload: ChatPayload):
    """
    Initiates chat assistant prompt iterations, fallback to offline KB answers if offline.
    """
    if not payload.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    try:
        reply = chat_with_ai(payload.message, payload.history)
        return {"status": "success", "reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai-interview/questions")
async def get_interview_questions(payload: InterviewQuestionPayload):
    """
    Generates 3 open-ended technical questions for a voice interview session.
    """
    try:
        questions = generate_open_questions(payload.role, payload.difficulty)
        return {"status": "success", "questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai-interview/evaluate")
async def evaluate_interview_answer(payload: InterviewEvaluatePayload):
    """
    Evaluates speech-to-text transcripts against technical questions, returning grades out of 10.
    """
    try:
        evaluation = evaluate_voice_answer(payload.question, payload.answer)
        return {"status": "success", "evaluation": evaluation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8011, reload=True)
