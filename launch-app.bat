@echo off
setlocal

cd /d "%~dp0"
set "PORT=5173"
set "NODE_EXE=node"

where node >nul 2>nul
if errorlevel 1 (
  if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" (
    set "NODE_EXE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
  ) else (
    echo Node.js was not found.
    echo Install Node.js or run this folder with VS Code Live Server.
    pause
    exit /b 1
  )
)

echo Starting AstraMind AI at http://localhost:%PORT%
start "" "http://localhost:%PORT%"
"%NODE_EXE%" server.mjs

