# 🚀 SkillLens Pro Quick Start Guide

Welcome to **SkillLens Pro**! This document provides the fastest way to get the entire full-stack application running on your local machine.

---

## ⚡ 3-Step Setup

### Step 1: Database Setup
Before starting the application, configure your MySQL database:
1. Ensure your MySQL server is running (default port `3306`).
2. Run the automated database setup script from the `backend/` directory:
   ```bash
   cd backend
   npm install
   node src/config/setupDB.js
   ```
   *(Note: This automatically reads `init.sql` and `seed.sql` to initialize `skilllens_db` and seed pre-configured role/quiz templates).*

### Step 2: Environment Configuration
1. Open `backend/.env` and update the database password:
   ```env
   DB_PASSWORD=your_mysql_password_here
   ```
2. *(Optional)* Add your Groq API key in both `backend/.env` and `ai-service/.env` to enable live LLM intelligence:
   ```env
   GROQ_API_KEY=gsk_your_groq_api_key_here
   ```
   *(Note: If no API key is provided, the platform automatically switches to a robust Offline Mode, utilizing a comprehensive local knowledge base).*

### Step 3: Run the Application
SkillLens Pro comes with a pre-configured automation script to launch all three services simultaneously.

* **On Windows:**
  Simply double-click `start-all.bat` in the project root, or execute:
  ```cmd
  start-all.bat
  ```

* **On macOS / Linux:**
  Open three terminal sessions and start each service individually:
  ```bash
  # Terminal 1: FastAPI AI Service (8011)
  cd ai-service && source venv/bin/activate && pip install -r requirements.txt && uvicorn main:app --port 8011 --reload

  # Terminal 2: Express Backend (5000)
  cd backend && npm run dev

  # Terminal 3: Vite React Frontend (5173)
  cd frontend && npm run dev
  ```

Once launched, navigate to **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 🔑 Default Test Credentials

You can instantly log in or register a new user on the frontend. Newly registered users receive the standard `student` role by default.

### 👑 Admin Access Setup
To access the secure **Admin Panel** metrics and inject new job roles:
1. Register a new user on the portal.
2. Update the user role to `admin` in your MySQL database:
   ```sql
   USE skilllens_db;
   UPDATE users SET role = 'admin' WHERE email = 'your_registered_email@example.com';
   ```

---

## 🛠️ Next Steps
- For deep environment configurations, see [ENVIRONMENT_VARIABLES.md](file:///d:/SkillLens/ENVIRONMENT_VARIABLES.md).
- For custom OS installations and manual database setup, see [LOCAL_SETUP.md](file:///d:/SkillLens/LOCAL_SETUP.md).
- To read about security, see [SECURITY.md](file:///d:/SkillLens/SECURITY.md).
