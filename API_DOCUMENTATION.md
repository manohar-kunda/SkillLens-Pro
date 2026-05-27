# 🔌 SkillLens Pro REST API Specification

This documentation catalogs all endpoints, parameters, authorization checks, and payload schemas for the Express backend gateway and FastAPI AI microservice.

---

## 🔑 Global Headers & Authentication

All private routes require a signed JWT bearer token in the HTTP header:
```text
Authorization: Bearer <your_jwt_token_here>
```

### 🏷️ Authorization Levels:
* **Public:** Accessible without headers.
* **Protect:** Requires valid JWT authentication token.
* **Admin:** Requires valid JWT token and `role = 'admin'` database verification.

---

## 1. 🔑 User Authentication Routes (`/api/auth`)

### 🔏 POST `/api/auth/register`
Creates a new student account.
* **Auth Level:** Public
* **Request Body:**
  ```json
  {
    "name": "Manohar Kunda",
    "email": "manohar@example.com",
    "password": "Password123"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": 12,
      "name": "Manohar Kunda",
      "email": "manohar@example.com",
      "role": "student"
    }
  }
  ```

### 🔏 POST `/api/auth/login`
Authenticates user and returns JWT token.
* **Auth Level:** Public
* **Request Body:**
  ```json
  {
    "email": "manohar@example.com",
    "password": "Password123"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": 12,
      "name": "Manohar Kunda",
      "email": "manohar@example.com",
      "role": "student"
    }
  }
  ```

---

## 2. 👥 User Profile Routes (`/api/users`)

### 🔏 GET `/api/users/profile`
Fetches current user profile metadata.
* **Auth Level:** Protect
* **Success Response (200 OK):**
  ```json
  {
    "id": 12,
    "name": "Manohar Kunda",
    "email": "manohar@example.com",
    "role": "student",
    "profile_pic": "/uploads/profiles/user-12-17168019283.png"
  }
  ```

### 🔏 PUT `/api/users/profile`
Updates text profile details.
* **Auth Level:** Protect
* **Request Body:**
  ```json
  {
    "name": "Manohar Kunda Pro"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "message": "Profile updated successfully"
  }
  ```

### 🔏 PATCH `/api/users/profile-pic`
Uploads a new avatar image.
* **Auth Level:** Protect
* **Request Payload:** `multipart/form-data` with key `profilePic` containing a `.png` or `.jpg` image file.
* **Success Response (200 OK):**
  ```json
  {
    "message": "Profile picture updated",
    "filePath": "/uploads/profiles/user-12-17168019283.png"
  }
  ```

---

## 3. 📄 Resume Upload & Parsing Routes (`/api/resumes`)

### 🔏 POST `/api/resumes/upload`
Uploads and parses a PDF/DOCX resume file.
* **Auth Level:** Protect
* **Request Payload:** `multipart/form-data` with key `resume` containing a `.pdf` or `.docx` file.
* **Success Response (200 OK):**
  ```json
  {
    "message": "Resume uploaded and parsed successfully",
    "resumeId": 45,
    "score": 85,
    "skillsExtracted": ["python", "javascript", "react", "mysql"]
  }
  ```

### 🔏 GET `/api/resumes/latest`
Fetches the latest parsed resume and skill analysis.
* **Auth Level:** Protect
* **Success Response (200 OK):**
  ```json
  {
    "id": 45,
    "score": 85,
    "file_path": "/uploads/resumes/resume-12.pdf",
    "parsed_data": {
      "text_length": 450,
      "skills_extracted": ["python", "javascript", "react", "mysql"],
      "evaluation": {
        "score": 85,
        "breakdown": {
          "structure": 30,
          "length_communication": 15,
          "technical_skills": 40
        },
        "feedback": ["Great structure!", "Consider explaining projects deeper."]
      }
    }
  }
  ```

---

## 4. 💼 Career Discovery & Gap Routes (`/api/jobs`)

### 🔏 GET `/api/jobs`
Fetches all curated job roles from the database.
* **Auth Level:** Public
* **Success Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "title": "Frontend Developer",
      "description": "Build responsive user interfaces..."
    }
  ]
  ```

### 🔏 POST `/api/jobs/:id/analyze-gap`
Analyzes resume skills against a target job role.
* **Auth Level:** Protect
* **Success Response (200 OK):**
  ```json
  {
    "message": "Skill gap analysis complete",
    "jobRoleId": "1",
    "matchPercentage": 75,
    "matchingSkills": [{"id": 3, "name": "React"}],
    "missingSkills": [{"id": 5, "name": "TypeScript"}]
  }
  ```

### 🔏 POST `/api/jobs/custom-roadmap`
Generates a dynamic learning roadmap and gap analysis for a searched role name.
* **Auth Level:** Protect
* **Request Body:**
  ```json
  {
    "roleName": "DevOps Engineer"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "jobTitle": "DevOps Engineer",
    "description": "A structured learning path for DevOps...",
    "matchingSkills": [{"id": "dyn-skill-1", "name": "Docker"}],
    "missingSkills": [{"id": "dyn-skill-2", "name": "Kubernetes"}],
    "matchPercentage": 50,
    "hierarchicalRoadmap": [
      {
        "category": "Containers & Serverless",
        "skills": [
          {"name": "Docker", "matched": true},
          {"name": "Kubernetes", "matched": false}
        ]
      }
    ]
  }
  ```

---

## 5. 🤖 AI Chat Assistant Routes (`/api/ai`)

### 🔏 POST `/api/ai/chat`
Starts a conversation with the AI Career Mentor.
* **Auth Level:** Protect
* **Request Body:**
  ```json
  {
    "message": "How do I start learning AWS?",
    "history": [
      { "role": "user", "content": "Hello!" },
      { "role": "assistant", "content": "How can I help you?" }
    ]
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "reply": "To start learning AWS: 1) Create a Free Tier account, 2) Focus on core services (EC2, S3, IAM), 3) Follow standard roadmaps..."
  }
  ```

---

## 💻 Sample cURL Integrations

### 1. Authenticated User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "manohar@example.com", "password": "Password123"}'
```

### 2. Generate Custom Role Learning Path
```bash
curl -X POST http://localhost:5000/api/jobs/custom-roadmap \
     -H "Authorization: Bearer <your_jwt_token>" \
     -H "Content-Type: application/json" \
     -d '{"roleName": "Full Stack Developer"}'
```
