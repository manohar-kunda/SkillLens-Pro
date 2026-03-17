# SkillLens Pro 🎯

SkillLens Pro is a comprehensive, full-stack AI platform designed to analyze resumes, detect skill gaps against specific job roles, provide tailored learning recommendations, and test knowledge through a mock interview simulator.

## ✨ Features

- **AI Resume Analysis**: Upload PDF or DOCX resumes to have skills and formatting automatically parsed and evaluated.
- **Skill Gap Detection**: Select a target job role and see exactly which required skills match your resume and which are missing (visualized with Chart.js).
- **Learning Recommendations**: Get actionable courses, articles, and video links to bridge your specific skill gaps.
- **Mock Interview Simulator**: Test your knowledge on matched skills with dynamically generated quizzes.
- **Admin Dashboard**: A secure portal for administrators to view platform metrics and inject new job roles into the system.

## 🛠 Technology Stack

- **Frontend**: React.js, Vite, React Router, Axios, Chart.js / react-chartjs-2
- **Backend**: Node.js, Express.js, JWT Authentication, Multer (File Uploads)
- **Database**: MySQL (using `mysql2/promise`)
- **AI Microservice**: Python, FastAPI, spaCy (NLP), PyPDF2, python-docx

---

## 🚀 Local Running Instructions

Follow these step-by-step instructions to get the application running on your local machine.

### Prerequisites

You must have the following installed on your machine:
1. **Node.js** (v18 or higher recommended)
2. **Python** (v3.8 or higher)
3. **MySQL Server** (Running locally on the default port `3306`)

### 1. Database Setup

1. Open your MySQL client or terminal and log in as root (`mysql -u root -p`).
2. Run the `init.sql` and `seed.sql` files located in `backend/src/config/` to create the database (`skilllens_db`) and populate it with initial data.
   *(Note: The system also includes a `setupDB.js` script in the backend root that you can run with `node setupDB.js` to automatically execute these SQL files if your MySQL user has no password).*

### 2. Python AI Service Setup

The AI service runs as a separate microservice using FastAPI.

1. Open a terminal and navigate to the AI service directory:
   ```bash
   cd ai-service
   ```
2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # On Windows
   ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server on port 8000:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### 3. Node.js Backend Setup

1. Open a **new** terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the Node.js dependencies:
   ```bash
   npm install
   ```
3. Ensure you have a `.env` file in the `backend/` directory with the following variables:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=skilllens_db
   JWT_SECRET=super_secret_key_123
   AI_SERVICE_URL=http://localhost:8000
   ```
4. Start the Express server:
   ```bash
   npm run dev
   ```

### 4. React Frontend Setup

1. Open a **third** terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the React dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

---

## 🧪 Default Test Accounts

You can register a new account on the frontend. By default, newly registered users are `student`s. 

To access the **Admin Panel**, register an account, then manually update your role in the database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
```
