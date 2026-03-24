/**
 * staticRoles.js
 * A comprehensive static role knowledge base for Node.js backend.
 * Used as a reliable fallback when the Python AI service is unavailable.
 */

const STATIC_ROLES = {
    'mern stack developer': {
        description: 'A MERN Stack Developer builds full-stack web applications using MongoDB, Express.js, React, and Node.js.',
        roadmap: [
            { category: 'Frontend Foundations', skills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Responsive Design', 'Bootstrap'] },
            { category: 'React & State Management', skills: ['React.js', 'React Hooks', 'Redux', 'Context API', 'React Router'] },
            { category: 'Backend with Node.js', skills: ['Node.js', 'Express.js', 'REST APIs', 'Middleware', 'Authentication'] },
            { category: 'Database & Storage', skills: ['MongoDB', 'Mongoose', 'SQL Basics', 'Redis'] },
            { category: 'DevOps & Deployment', skills: ['Git', 'Docker', 'CI/CD', 'AWS / Heroku', 'Nginx'] },
        ]
    },
    'frontend developer': {
        description: 'A Frontend Developer creates the visual and interactive elements of a website or web application.',
        roadmap: [
            { category: 'Core Web Technologies', skills: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'] },
            { category: 'Modern Frameworks', skills: ['React.js', 'Vue.js', 'Angular', 'TypeScript'] },
            { category: 'Styling & Design', skills: ['CSS Grid', 'Flexbox', 'Tailwind CSS', 'Bootstrap', 'Figma'] },
            { category: 'Performance & Testing', skills: ['Webpack', 'Vite', 'Jest', 'Cypress', 'Lighthouse'] },
            { category: 'Version Control & Tools', skills: ['Git', 'GitHub', 'npm', 'Browser DevTools'] },
        ]
    },
    'backend developer': {
        description: 'A Backend Developer builds and maintains the server-side logic, databases, and APIs of web applications.',
        roadmap: [
            { category: 'Programming Languages', skills: ['Node.js', 'Python', 'Java', 'Go'] },
            { category: 'Frameworks & APIs', skills: ['Express.js', 'Django', 'Spring Boot', 'REST API', 'GraphQL'] },
            { category: 'Databases', skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch'] },
            { category: 'Security & Auth', skills: ['JWT', 'OAuth2', 'SSL/TLS', 'API Security', 'Input Validation'] },
            { category: 'DevOps & Cloud', skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'] },
        ]
    },
    'full stack developer': {
        description: 'A Full Stack Developer can build both the frontend and backend of a web application end-to-end.',
        roadmap: [
            { category: 'Frontend', skills: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'TypeScript'] },
            { category: 'Backend', skills: ['Node.js', 'Express.js', 'Python / Django', 'REST APIs', 'Authentication'] },
            { category: 'Databases', skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis'] },
            { category: 'Cloud & DevOps', skills: ['AWS', 'Docker', 'Git', 'CI/CD', 'Nginx'] },
            { category: 'Soft Skills', skills: ['System Design', 'Agile/Scrum', 'Problem Solving', 'Code Review'] },
        ]
    },
    'data scientist': {
        description: 'A Data Scientist uses statistical methods and machine learning to extract insights from complex data.',
        roadmap: [
            { category: 'Programming', skills: ['Python', 'R', 'SQL', 'Jupyter Notebooks'] },
            { category: 'Data Manipulation', skills: ['Pandas', 'NumPy', 'Data Cleaning', 'Feature Engineering'] },
            { category: 'Machine Learning', skills: ['Scikit-learn', 'TensorFlow', 'PyTorch', 'Deep Learning'] },
            { category: 'Visualization', skills: ['Matplotlib', 'Seaborn', 'Tableau', 'Power BI'] },
            { category: 'Big Data & Cloud', skills: ['Spark', 'Hadoop', 'AWS SageMaker', 'Google BigQuery'] },
        ]
    },
    'devops engineer': {
        description: 'A DevOps Engineer bridges development and operations by automating and streamlining software delivery.',
        roadmap: [
            { category: 'Linux & Scripting', skills: ['Linux', 'Bash Scripting', 'Python', 'Shell Tools'] },
            { category: 'Containerization', skills: ['Docker', 'Kubernetes', 'Helm', 'Docker Compose'] },
            { category: 'CI/CD', skills: ['Jenkins', 'GitHub Actions', 'GitLab CI', 'CircleCI'] },
            { category: 'Cloud Platforms', skills: ['AWS', 'Azure', 'GCP', 'Terraform', 'Ansible'] },
            { category: 'Monitoring', skills: ['Prometheus', 'Grafana', 'ELK Stack', 'Datadog'] },
        ]
    },
    'android developer': {
        description: 'An Android Developer builds mobile applications for Android devices using Kotlin or Java.',
        roadmap: [
            { category: 'Core Languages', skills: ['Kotlin', 'Java', 'XML Layouts'] },
            { category: 'Android SDK', skills: ['Activities', 'Fragments', 'RecyclerView', 'ViewModel', 'LiveData'] },
            { category: 'Architecture', skills: ['MVVM', 'Clean Architecture', 'Jetpack Compose', 'Room Database'] },
            { category: 'Networking & APIs', skills: ['Retrofit', 'OkHttp', 'REST APIs', 'JSON Parsing'] },
            { category: 'Tools & Publishing', skills: ['Android Studio', 'Git', 'Firebase', 'Google Play Store'] },
        ]
    },
    'ios developer': {
        description: 'An iOS Developer builds mobile applications for Apple devices using Swift and Xcode.',
        roadmap: [
            { category: 'Core Language', skills: ['Swift', 'Objective-C Basics', 'SwiftUI', 'UIKit'] },
            { category: 'Apple Frameworks', skills: ['Foundation', 'AVFoundation', 'CoreData', 'MapKit'] },
            { category: 'Architecture Patterns', skills: ['MVC', 'MVVM', 'Combine', 'Async/Await'] },
            { category: 'Networking', skills: ['URLSession', 'Alamofire', 'REST APIs', 'JSON Decoding'] },
            { category: 'Tools & Publishing', skills: ['Xcode', 'Git', 'TestFlight', 'App Store Connect'] },
        ]
    },
    'cybersecurity analyst': {
        description: 'A Cybersecurity Analyst protects organizations from digital attacks and security threats.',
        roadmap: [
            { category: 'Networking Fundamentals', skills: ['TCP/IP', 'DNS', 'HTTP/S', 'Firewalls', 'VPN'] },
            { category: 'Security Tools', skills: ['Wireshark', 'Metasploit', 'Nmap', 'Burp Suite', 'Kali Linux'] },
            { category: 'Security Concepts', skills: ['Penetration Testing', 'OWASP Top 10', 'Incident Response', 'SIEM'] },
            { category: 'Cloud Security', skills: ['AWS Security', 'IAM', 'Zero Trust', 'SASE'] },
            { category: 'Certifications', skills: ['CompTIA Security+', 'CEH', 'CISSP', 'OSCP'] },
        ]
    },
    'machine learning engineer': {
        description: 'An ML Engineer designs and deploys machine learning models into production at scale.',
        roadmap: [
            { category: 'Foundations', skills: ['Python', 'Mathematics', 'Linear Algebra', 'Statistics', 'Calculus'] },
            { category: 'ML Algorithms', skills: ['Scikit-learn', 'Supervised Learning', 'Unsupervised Learning', 'Neural Networks'] },
            { category: 'Deep Learning', skills: ['TensorFlow', 'PyTorch', 'CNNs', 'RNNs', 'Transformers'] },
            { category: 'MLOps', skills: ['MLflow', 'Kubeflow', 'Docker', 'FastAPI', 'Model Monitoring'] },
            { category: 'Cloud & Data', skills: ['AWS SageMaker', 'Google Vertex AI', 'Spark', 'Feature Stores'] },
        ]
    },
};

// Role name aliases for fuzzy matching
const ROLE_ALIASES = {
    'mern': 'mern stack developer',
    'mern stack': 'mern stack developer',
    'react developer': 'frontend developer',
    'vue developer': 'frontend developer',
    'angular developer': 'frontend developer',
    'node developer': 'backend developer',
    'django developer': 'backend developer',
    'flask developer': 'backend developer',
    'fullstack developer': 'full stack developer',
    'full-stack developer': 'full stack developer',
    'ds': 'data scientist',
    'ml engineer': 'machine learning engineer',
    'ai engineer': 'machine learning engineer',
    'security analyst': 'cybersecurity analyst',
    'cyber security analyst': 'cybersecurity analyst',
};

// All available roles for autocomplete suggestions
const ALL_ROLES = [
    'MERN Stack Developer', 'Frontend Developer', 'Backend Developer',
    'Full Stack Developer', 'Data Scientist', 'DevOps Engineer',
    'Android Developer', 'iOS Developer', 'Cybersecurity Analyst',
    'Machine Learning Engineer', 'Cloud Engineer', 'UI/UX Designer',
    'React Developer', 'Node.js Developer', 'Python Developer',
    'Java Developer', 'Mobile App Developer', 'Database Administrator',
    'Software Engineer', 'Site Reliability Engineer',
];

/**
 * Find a static roadmap for a role name using fuzzy matching.
 * Returns null if no match found.
 */
function findStaticRoadmap(roleName) {
    const lower = roleName.toLowerCase().trim();
    
    // Direct match
    if (STATIC_ROLES[lower]) return STATIC_ROLES[lower];
    
    // Alias match
    if (ROLE_ALIASES[lower]) return STATIC_ROLES[ROLE_ALIASES[lower]];
    
    // Partial match — check if any known role is contained in or contains the input
    for (const [key, value] of Object.entries(STATIC_ROLES)) {
        if (lower.includes(key) || key.includes(lower)) return value;
    }
    
    return null;
}

/**
 * Get job role suggestions matching a query string.
 */
function getStaticSuggestions(query) {
    const lower = query.toLowerCase();
    return ALL_ROLES.filter(r => r.toLowerCase().includes(lower)).slice(0, 8);
}

module.exports = { findStaticRoadmap, getStaticSuggestions, STATIC_ROLES };
