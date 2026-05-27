# ⚙️ SkillLens Pro Environment Variables Reference

This reference catalog documents all configuration keys required to customize, secure, and run SkillLens Pro across local development, staging, and production environments.

---

## 📂 Architecture Map
SkillLens Pro consists of three components that communicate over local network links. Each requires its own environment settings:
- **Express Backend (`backend/`)**: Handles relational storage, authentication, route control, and coordinate calls to LLM resources.
- **FastAPI AI Service (`ai-service/`)**: Powers spaCy-based resume parsing, interview question generation, and speech transcript evaluations.
- **Vite React Frontend (`frontend/`)**: Renders client-side interface metrics and captures uploads.

---

## 1. 🗄️ Node.js Express Backend Configurations (`backend/.env`)

Create a `.env` file under the `/backend` directory.

| Variable Name | Required | Default Value | Description |
| :--- | :---: | :--- | :--- |
| `PORT` | No | `5000` | The network port the Express application server binds to. |
| `DB_HOST` | Yes | `localhost` | Host address of the MySQL server database instance. |
| `DB_USER` | Yes | `root` | Database username with privileges to query the `skilllens_db`. |
| `DB_PASSWORD` | Yes | *None* | Secure password linked to the MySQL user account. |
| `DB_NAME` | No | `skilllens_db` | Name of the primary database table collection. |
| `JWT_SECRET` | Yes | `fallback_secret_key` | Cryptographic secret used to sign and verify JWT authentication tokens. |
| `AI_SERVICE_URL` | No | `http://localhost:8011` | Network route pointing to the local Python FastAPI microservice. |
| `GROQ_API_KEY` | No | *None* | Groq cloud platform token. Enables backend-direct high-speed llama-3.3-70b chat functionality. |

### 🔒 Sample Backend Production `.env`
```env
PORT=5000
DB_HOST=127.0.0.1
DB_USER=skilllens_admin
DB_PASSWORD=a_highly_secure_db_password_1029
DB_NAME=skilllens_db
JWT_SECRET=8e2b86a87c1264ba3a8fcf9a3e215cb876a38d729a9bf9cd29a009bc
AI_SERVICE_URL=http://localhost:8011
GROQ_API_KEY=gsk_3a8b417c8d9e2a1b5c3d4e5f
```

---

## 2. 🐍 FastAPI Python AI Service Configurations (`ai-service/.env`)

Create a `.env` file under the `/ai-service` directory.

| Variable Name | Required | Default Value | Description |
| :--- | :---: | :--- | :--- |
| `GROQ_API_KEY` | No | *None* | Groq API access token. If omitted, the service falls back to a massive offline spaCy keyword match and static knowledge bases. |

### 🔒 Sample AI Service `.env`
```env
GROQ_API_KEY=gsk_3a8b417c8d9e2a1b5c3d4e5f
```

---

## 3. ⚛️ React Frontend Configurations (`frontend/.env`)

Create a `.env` file under the `/frontend` directory. Vite requires frontend-bound keys to be prefixed with `VITE_` to protect against unintentional exposure of server credentials.

| Variable Name | Required | Default Value | Description |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | Yes | `http://localhost:5000/api` | REST API base route used by Axios services to query backend endpoints. |
| `VITE_AI_SERVICE_URL` | No | `http://localhost:8011` | FastAPI endpoint target. Used by the client to query FastAPI health endpoints directly. |

### 🔒 Sample Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_AI_SERVICE_URL=http://localhost:8011
```

---

## ⚠️ Security Guardrails
1. **Never Commit Secrets:** Add all `.env` files to your global or local `.gitignore`.
2. **Key Rotation:** Rotate JWT secrets and Groq API keys every 90 days in staging/production environments.
3. **Random Secret Generation:** To create a secure cryptographic JWT secret, run the following Node.js snippet:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
