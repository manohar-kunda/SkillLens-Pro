# 🤝 Contributing to SkillLens Pro

We love open-source contributions! Whether you are building mock quiz extensions, improving the voice parsing NLP model, or patching layout styling, this guide outlines the standards and workflows we use to build SkillLens Pro.

---

## 🚦 Quick Code of Conduct
- Maintain respect, patience, and professional communication.
- Focus on performance, security, and developer experience.
- Keep documentation up to date alongside your code changes.

---

## 🌿 Git Branching Conventions

When creating branches, always prefix the branch name with the type of change you are making:

* `feature/` : Adding a new capability (e.g., `feature/voice-interview-enhancements`)
* `bugfix/` : Patching an issue or repairing a defect (e.g., `bugfix/jwt-auth-expiration`)
* `docs/` : Standardizing or editing markdown guides (e.g., `docs/add-api-details`)
* `refactor/` : Code reorganizations without adding features or repairing bugs (e.g., `refactor/promise-all-queries`)
* `hotfix/` : Urgent patches destined directly for production (e.g., `hotfix/cors-origin-bypass`)

### Example:
```bash
git checkout -b feature/interactive-admin-visualizer
```

---

## 📝 Commit Conventions

We strictly follow the **Conventional Commits** specification. This allows automated changelog generation and maintains a clean commit history.

Commit messages must match this regular expression format:
```text
<type>(<scope>): <short description>
```

### Supported Types:
* `feat`: A new user-facing feature.
* `fix`: A developer or user-facing bug fix.
* `docs`: Documentation alterations.
* `style`: Styling changes, formatting, or missing semi-colons (no production logic altered).
* `refactor`: Structural code updates (e.g., cleaning up duplicate endpoints).
* `test`: Adding missing unit tests or validating scripts.
* `chore`: Package updates, build tool configuration changes, or configuration tweaks.

### Examples:
* `feat(auth): add role guards to prevent non-admin router access`
* `fix(parser): repair spaCy multi-word matching logic for C++ skills`
* `docs(readme): update badges and quick start paths`
* `refactor(db): replace duplicate seeding files with consolidated setup scripts`

---

## 🐛 Issue Reporting & Bug Tracking

If you find a bug, encounter a crash, or want to suggest an architectural improvement, please submit a ticket on our GitHub Issues board.

### How to Open a Professional Ticket:
1. **Search First:** Check the open and closed issues lists to make sure the topic has not already been covered.
2. **Use the Bug Template:** Specify:
   - **Clear Title:** Concise summary of the error (e.g., "FastAPI `/api/analyze` throws 500 on multi-page PDF").
   - **Environment Info:** Operating system, Node.js version, and whether you are running Groq live or in Offline Fallback mode.
   - **Steps to Reproduce:** Numbered actions leading to the failure.
   - **Expected Behavior:** What should have occurred.
   - **Actual Behavior:** Logs, terminal outputs, or screenshot captures of the failure.

### Issue Triaging Labels:
* `bug`: Platform bugs or layout failures.
* `enhancement`: Feature suggestions or curriculum enhancements.
* `documentation`: Standardizing markdown guides.
* `security`: Safety patches (flagged privately first if high vulnerability).

---

## 🎨 Coding Style Standards

### ⚛️ Frontend & Backend JavaScript (Node.js/React)
- **Indentation:** 2 spaces.
- **Variables & Functions:** `camelCase` (e.g., `getProfile`, `axiosWithRetry`).
- **React Components:** `PascalCase` (e.g., `ChatAssistant.jsx`, `AdminDashboard.jsx`).
- **Formatting:** ESLint and Prettier are integrated. Make sure to run them before committing.
- **Rules:** Avoid using `var`; always prefer `const` or `let`. Always handle Promise rejections (use `try/catch` or `.catch()`).

### 🐍 Python AI Microservice
- **Standards:** Strictly adhere to **PEP 8** style guidelines.
- **Indentation:** 4 spaces.
- **Variables & Functions:** `snake_case` (e.g., `parse_resume`, `score_resume_vs_job`).
- **Classes:** `PascalCase` (e.g., `TextPayload`, `InterviewEvaluatePayload`).
- **Formatting:** Keep imports grouped (Standard library, Third-party, Local service imports).

---

## 🚀 Pull Request Workflow

1. **Fork & Clone:** Fork the SkillLens Pro repository and clone your fork locally.
2. **Create Branch:** Create a local branch using our branch naming rules.
3. **Write Code:** Implement your enhancements, maintaining the coding styles.
4. **Format & Lint:** Run syntax linters to check for code smells.
5. **Commit:** Save your modifications using Conventional Commits.
6. **Push & PR:** Push the branch to your fork and submit a Pull Request to our main branch.
7. **Description Checklist:** Ensure your PR description includes:
   - What was modified or added.
   - Link to any associated issue.
   - Screen captures/GIFs if any UI change was made.
   - How you verified your logic.

---

## 🧪 Testing Guidelines
- All new controller routes must be accompanied by relevant test scripts.
- Python logic should be dry-run using the internal `check_routes.py` tool.
- Ensure your changes do not break existing features by running the local startup script `start-all.bat`.
