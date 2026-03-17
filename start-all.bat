@echo off
title SkillLens Launcher
echo =======================================
echo   Starting SkillLens Platform...
echo =======================================
echo.

echo [1/3] Starting AI Service on Port 8011...
start "AI Service (8011)" cmd /k "cd /d d:\SkillLens\ai-service && python -m uvicorn main:app --host 0.0.0.0 --port 8011"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Backend on Port 5000...
start "Backend (5000)" cmd /k "cd /d d:\SkillLens\backend && npm run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Starting Frontend on Port 5173...
start "Frontend (5173)" cmd /k "cd /d d:\SkillLens\frontend && npm run dev"

echo.
echo =======================================
echo   All services started!
echo   Open: http://localhost:5173
echo =======================================
echo   Keep this window and the 3 other
echo   terminal windows OPEN.
echo =======================================
pause
