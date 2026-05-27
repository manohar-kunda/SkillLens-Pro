# 🏗️ Modular Architecture & Code Design Standards - SkillLens Pro

This reference manual documents the code architecture, design patterns, file directory layouts, and performance optimization strategies implemented in SkillLens Pro.

---

## 📂 Modular Codebase Layout

```text
SkillLens-Pro/
├── ai-service/              # Python FastAPI AI microservice
│   ├── app/
│   │   ├── services/        # Parsers, LLM calls, static knowledge base
│   │   └── utils/           # Text extraction utilities
│   ├── main.py              # Microservice entry point & router
│   └── requirements.txt     # Python dependencies
├── backend/                 # Node.js Express REST API server
│   ├── src/
│   │   ├── config/          # MySQL database configuration & SQL init/seeds
│   │   ├── controllers/     # Express route handlers
│   │   ├── middlewares/     # JWT authentication & role-based validation
│   │   ├── routes/          # REST API endpoints routing definition
│   │   ├── utils/           # Helper scripts & fallback roadmaps
│   │   └── app.js           # Server middleware initialization
│   ├── package.json         # Node server package configurations
│   └── start-all.bat        # Automated full-stack system launcher
└── frontend/                # Vite React client SPA
    ├── src/
    │   ├── components/      # Reusable UI widgets
    │   ├── context/         # Auth & Theme state contexts
    │   ├── pages/           # Client views
    │   ├── services/        # HTTP API connection layers (Axios)
    │   ├── App.jsx          # Route mapping & app bootstrapper
    │   └── main.jsx         # DOM entry-point
```

---

## 🎨 Architectural Design Patterns

SkillLens Pro enforces clean separations of concerns across all three modules:

### 1. 🗄️ Backend MVC Pattern (Model-View-Controller)
The Express server follows a clean Model-Controller-Route abstraction, allowing developers to extend logic without cluttering entry files:
* **Routes Layer (`src/routes/`):** Exposes network routes (e.g. `quizRoutes.js`, `resumeRoutes.js`) and registers controllers and security guards.
* **Controllers Layer (`src/controllers/`):** Manages all business logic, database queries, and communications with external services.
* **Database Connection Layer (`src/config/db.js`):** Instantiates a reusable `mysql2/promise` connection pool.

### 2. ⚛️ Frontend Component-Service-Context Pattern
To ensure the React single-page application remains scalable and responsive, the frontend implements three distinct layers:
* **Components Layer (`src/components/`):** Renders UI elements (such as `ChatAssistant.jsx` and `Navbar.jsx`).
* **Services Layer (`src/services/`):** Encapsulates API requests using specialized **Axios** clients (e.g. `authService.js` and `apiServices.js`), keeping page code clean.
* **Contexts Layer (`src/context/`):** Shares global state across the component tree without prop-drilling:
  - `AuthContext.jsx` manages active JWT tokens, login states, and user details.
  - `ThemeContext.jsx` provides platform-wide dark/light mode configurations.

### 3. 🐍 Python Service-Centric Pattern
The FastAPI microservice decouples routing from business logic:
* **Routing Layer (`main.py`):** Translates incoming HTTP payloads and maps routes to services.
* **Services Layer (`app/services/`):** Encapsulates core logic, including PyPDF2 text extraction (`parser.py`) and Groq LLM prompt generation (`llm_engine.py`).

---

## ⚡ Performance Optimization Strategies

SkillLens Pro is tuned to ensure fast UI loads and reliable microservice communication:

### 1. 🧊 Intelligent In-Memory Caching
In `jobController.js`, queries for custom roadmaps or autocomplete suggestions are cached in memory using JavaScript `Map` structures:
* Cache checks occur before making Wikipedia queries or calling the FastAPI server.
* A Time-To-Live (TTL) of **1 hour** ensures that stored roadmaps are regularly refreshed, providing a fast user experience while keeping data up to date.

### 2. 📳 Render Cold-Start Mitigation
To prevent the typical 30–60 second latency that users encounter with free hosting platforms (like Render or Fly.io) due to cold-starts, `App.jsx` triggers concurrent, non-blocking health checks immediately upon loading:
```javascript
React.useEffect(() => {
  const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || '';
  api.get('/health').catch(() => {});
  if (AI_SERVICE_URL) {
    fetch(`${AI_SERVICE_URL}/health`).catch(() => {});
  }
}, []);
```
These pings wake up both the Express server and the Python microservice in the background while the user is still on the login page.

### 3. 🌀 Multi-Model Fallback Resiliency
The LLM engine in `llm_engine.py` implements a cascading fallback array:
```python
MODEL_FALLBACKS = [
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'mixtral-8x7b-32768'
]
```
If a model fails due to rate limits or outage, the engine seamlessly tries the next model in the list, ensuring high reliability.
