# 💻 SkillLens Pro Local Development Setup Guide

This guide provides deep, OS-specific instructions to install prerequisites, import schemas, configure virtual environments, and run each component of the SkillLens Pro platform.

---

## 🏗️ System Prerequisites

Ensure the following tools are installed globally on your machine:
* **Node.js** (v18.0.0 or higher) & **npm** (v9.0.0 or higher)
* **Python** (v3.9 or higher, up to v3.12)
* **MySQL Server** (v8.0 or higher) running on local port `3306`

---

## 1. 🗄️ Database Installation & Schema Import

SkillLens Pro relies on MySQL for persistent storage (users, resume uploads, quizzes, and score results).

### A. Windows Installation
1. Download the **MySQL Installer** from the [MySQL Official Portal](https://dev.mysql.com/downloads/installer/).
2. Select **Developer Default** or install **MySQL Server** & **MySQL Shell**.
3. Configure the password for the default `root` user during installation.
4. Ensure the MySQL service is running.

### B. macOS Installation
Install MySQL using [Homebrew](https://brew.sh):
```bash
brew install mysql
brew services start mysql
```

### C. Linux (Ubuntu/Debian) Installation
```bash
sudo apt update
sudo apt install mysql-server -y
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 📥 Database Schema Seeding
Once MySQL is running, configure and populate the tables:

#### Option 1: Automated Script (Recommended)
Navigate to the `/backend` directory and run the helper tool:
```bash
cd backend
npm install
node src/config/setupDB.js
```
*Note: This script automatically reads `backend/src/config/init.sql` and `backend/src/config/seed.sql` to build tables and load mock mock questions.*

#### Option 2: Manual Terminal Import
Log in to your MySQL terminal and run the SQL commands manually:
```bash
# Connect to MySQL CLI
mysql -u root -p

# Within the MySQL terminal:
mysql> source backend/src/config/init.sql;
mysql> source backend/src/config/seed.sql;
```

---

## 2. 🐍 Python AI Microservice Setup

The AI service operates as a FastAPI server on port `8011` to parse resumes via NLP and evaluate voice submissions.

1. **Navigate to the service directory:**
   ```bash
   cd ai-service
   ```

2. **Create and Activate a Virtual Environment:**
   * **Windows (Command Prompt):**
     ```cmd
     python -m venv venv
     venv\Scripts\activate.bat
     ```
   * **Windows (PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   * **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
   *Note: On first run, the system automatically checks and downloads the required spaCy NLP model (`en_core_web_sm`). If you wish to download it manually, execute:*
   ```bash
   python -m spacy download en_core_web_sm
   ```

4. **Setup Environment Keys:**
   Create an `ai-service/.env` file and append:
   ```env
   GROQ_API_KEY=your_key_here
   ```

5. **Run the Server:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8011 --reload
   ```

---

## 3. 🟢 Node.js Express Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install Node modules:**
   ```bash
   npm install
   ```

3. **Create the environment file:**
   Create `backend/.env` (see [ENVIRONMENT_VARIABLES.md](file:///d:/SkillLens/ENVIRONMENT_VARIABLES.md) for full descriptions):
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=skilllens_db
   JWT_SECRET=super_cryptographic_secret_key_123
   AI_SERVICE_URL=http://localhost:8011
   ```

4. **Launch the Backend Server:**
   * **Development (Morgan logging + live reload):**
     ```bash
     npm run dev
     ```
   * **Production:**
     ```bash
     npm start
     ```

---

## 4. ⚛️ Vite React Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node modules:**
   ```bash
   npm install
   ```

3. **Create environment variables:**
   Create a `frontend/.env` file and append:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_AI_SERVICE_URL=http://localhost:8011
   ```

4. **Launch the Dev Server:**
   ```bash
   npm run dev
   ```
   *Note: Open `http://localhost:5173` in your browser.*

---

## 🚀 Troubleshooting Common Setup Hurdles

### ⚠️ Issue 1: MySQL Connection Denied or ER_NOT_SUPPORTED_AUTH_MODE
If you get database connection failures, update your MySQL user plugin to support the Node.js connector:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

### ⚠️ Issue 2: SpaCy failing to download model
If spaCy encounters an SSL or permission error downloading `en_core_web_sm`, run your terminal as Administrator (or root via `sudo`) and run:
```bash
python -m spacy download en_core_web_sm
```

### ⚠️ Issue 3: Express Backend fails to start because port 5000 is occupied
On macOS Monterey or higher, AirPlay Receiver listens on port 5000. You can disable AirPlay Receiver in system settings or change `PORT=5001` in your `backend/.env` (remembering to update `VITE_API_URL` to `http://localhost:5001/api` in frontend configurations).
