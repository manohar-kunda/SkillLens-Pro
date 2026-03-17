USE skilllens_db;

-- Clear existing data for clean seed
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE job_roles;
TRUNCATE TABLE skills;
TRUNCATE TABLE job_role_skills;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Job Roles
INSERT INTO job_roles (id, title, description) VALUES
(1, 'Java Developer', 'Backend developer specializing in Java and Spring Boot.'),
(2, 'Web Developer', 'Full stack developer for modern web applications.'),
(3, 'Data Analyst', 'Data professional analyzing big datasets.'),
(4, 'Cyber Security Analyst', 'Security professional protecting networks and systems.');

-- 2. Insert Base Skills
INSERT INTO skills (name) VALUES
('java'), ('spring boot'), ('hibernate'), ('sql'), ('mysql'), 
('javascript'), ('react'), ('node.js'), ('html'), ('css'), ('express'),
('python'), ('data analysis'), ('machine learning'), ('pandas'),
('cyber security'), ('network security'), ('linux'), ('ethical hacking');

-- 3. Map Skills to Job Roles
-- Java Developer (id: 1)
INSERT INTO job_role_skills (job_role_id, skill_id, importance_level)
SELECT 1, id, 'high' FROM skills WHERE name IN ('java', 'spring boot', 'sql', 'mysql', 'hibernate');

-- Web Developer (id: 2)
INSERT INTO job_role_skills (job_role_id, skill_id, importance_level)
SELECT 2, id, 'high' FROM skills WHERE name IN ('javascript', 'react', 'node.js', 'html', 'css', 'express');

-- Data Analyst (id: 3)
INSERT INTO job_role_skills (job_role_id, skill_id, importance_level)
SELECT 3, id, 'high' FROM skills WHERE name IN ('python', 'data analysis', 'sql', 'pandas', 'machine learning');

-- Cyber Security Analyst (id: 4)
INSERT INTO job_role_skills (job_role_id, skill_id, importance_level)
SELECT 4, id, 'high' FROM skills WHERE name IN ('cyber security', 'network security', 'linux', 'ethical hacking', 'python');

-- 4. Learning Recommendations for skills
INSERT INTO learning_recommendations (skill_id, title, resource_url, type)
SELECT id, 'Complete Node.js Developer Course', 'https://www.udemy.com/course/the-complete-nodejs-developer-course-2/', 'course' FROM skills WHERE name = 'node.js';

INSERT INTO learning_recommendations (skill_id, title, resource_url, type)
SELECT id, 'React - The Complete Guide', 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', 'course' FROM skills WHERE name = 'react';

INSERT INTO learning_recommendations (skill_id, title, resource_url, type)
SELECT id, 'Java Programming Masterclass', 'https://www.udemy.com/course/java-the-complete-java-developer-course/', 'course' FROM skills WHERE name = 'java';

INSERT INTO learning_recommendations (skill_id, title, resource_url, type)
SELECT id, '100 Days of Code: The Complete Python Pro Bootcamp', 'https://www.udemy.com/course/100-days-of-code/', 'course' FROM skills WHERE name = 'python';
