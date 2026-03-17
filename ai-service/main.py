from fastapi import FastAPI, UploadFile, File, HTTPException
import uvicorn
from pydantic import BaseModel
from app.services.parser import parse_resume
from app.services.llm_engine import score_resume_vs_job, get_job_role_suggestions, generate_hierarchical_roadmap, chat_with_ai, generate_open_questions, evaluate_voice_answer

app = FastAPI(title="SkillLens AI Service", description="AI parsing engine for SkillLens")

@app.get("/health")
def health_check():
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
    if not payload.resume_text or not payload.job_description:
        raise HTTPException(status_code=400, detail="Resume text and job description are required")
    try:
        result = score_resume_vs_job(payload.resume_text, payload.job_description)
        return {"status": "success", **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/job-suggestions")
async def job_suggestions_endpoint(q: str = ""):
    if not q:
        return {"status": "success", "suggestions": []}
    try:
        suggestions = get_job_role_suggestions(q)
        return {"status": "success", "suggestions": suggestions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-skills")
async def generate_skills_endpoint(payload: TextPayload):
    if not payload.text:
        raise HTTPException(status_code=400, detail="Role name cannot be empty")
    try:
        roadmap_data = generate_hierarchical_roadmap(payload.text)
        return {"status": "success", "data": roadmap_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat_endpoint(payload: ChatPayload):
    if not payload.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    try:
        reply = chat_with_ai(payload.message, payload.history)
        return {"status": "success", "reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai-interview/questions")
async def get_interview_questions(payload: InterviewQuestionPayload):
    try:
        questions = generate_open_questions(payload.role, payload.difficulty)
        return {"status": "success", "questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai-interview/evaluate")
async def evaluate_interview_answer(payload: InterviewEvaluatePayload):
    try:
        evaluation = evaluate_voice_answer(payload.question, payload.answer)
        return {"status": "success", "evaluation": evaluation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8011, reload=True)
