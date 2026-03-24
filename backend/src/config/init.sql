-- SkillLens Pro Database Schema

CREATE DATABASE IF NOT EXISTS skilllens_db;
USE skilllens_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Resumes Table
CREATE TABLE IF NOT EXISTS resumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(255) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parsed_data JSON, -- Stores raw extracted text or NLP JSON output
    score INT DEFAULT 0, -- Overall AI computed score
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Job Roles Table
CREATE TABLE IF NOT EXISTS job_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- 4. Skills Table (Master List of Skills)
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 5. Job Role Skills (Many-to-Many mapping of required skills for a job)
CREATE TABLE IF NOT EXISTS job_role_skills (
    job_role_id INT NOT NULL,
    skill_id INT NOT NULL,
    importance_level ENUM('low', 'medium', 'high') DEFAULT 'medium',
    PRIMARY KEY (job_role_id, skill_id),
    FOREIGN KEY (job_role_id) REFERENCES job_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 6. User Skills (Skills extracted from user's resume)
CREATE TABLE IF NOT EXISTS user_skills (
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    source_resume_id INT,
    PRIMARY KEY (user_id, skill_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    FOREIGN KEY (source_resume_id) REFERENCES resumes(id) ON DELETE SET NULL
);

-- 7. Skill Gaps (Computed missing skills for a user targeting a specific job)
CREATE TABLE IF NOT EXISTS skill_gaps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    job_role_id INT NOT NULL,
    missing_skill_id INT NOT NULL,
    identified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_role_id) REFERENCES job_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (missing_skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 8. Learning Recommendations
CREATE TABLE IF NOT EXISTS learning_recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    skill_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    resource_url VARCHAR(255),
    type ENUM('course', 'article', 'video', 'practice') DEFAULT 'course',
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 9. Quizzes
CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    skill_id INT NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 10. Questions
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_option CHAR(1) NOT NULL, -- 'A', 'B', 'C', or 'D'
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- 11. User Results
CREATE TABLE IF NOT EXISTS user_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- 12. Resume Builder Info
CREATE TABLE IF NOT EXISTS resume_builder_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    phone VARCHAR(50),
    address VARCHAR(255),
    summary TEXT,
    experience JSON,
    education JSON,
    projects JSON,
    skills JSON,
    template_id VARCHAR(50) DEFAULT 'template1',
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    certifications JSON,
    languages JSON,
    achievements JSON,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
