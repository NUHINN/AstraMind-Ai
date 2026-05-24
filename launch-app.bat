@echo off
setlocal

cd /d "%~dp0"
set "PORT=5173"

where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found.
  echo Install Node.js from https://nodejs.org, then run this file again.
  pause
  exit /b 1
)

echo Starting AstraMind AI at http://localhost:%PORT%
start "" "http://localhost:%PORT%"
npm install
npm run dev
