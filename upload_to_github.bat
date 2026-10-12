@echo off
setlocal enabledelayedexpansion

echo =======================================================
echo   Uploading Numerology App to wickedwonderful/numerology-app
echo =======================================================
echo.

:: Detect git executable
set "GIT_CMD=git"
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    if exist "C:\Users\agent_gf5nokk\AppData\Local\GitHubDesktop\app-3.6.7\resources\app\git\cmd\git.exe" (
        set "GIT_CMD=C:\Users\agent_gf5nokk\AppData\Local\GitHubDesktop\app-3.6.7\resources\app\git\cmd\git.exe"
    ) else (
        for /d %%D in ("%LOCALAPPDATA%\GitHubDesktop\app-*") do (
            if exist "%%D\resources\app\git\cmd\git.exe" (
                set "GIT_CMD=%%D\resources\app\git\cmd\git.exe"
            )
        )
    )
)

set "REPO_URL=https://github.com/wickedwonderful/numerology-app.git"

echo Using Git: "!GIT_CMD!"
echo Target Repository: %REPO_URL%
echo.

echo [1/5] Initializing Git repository...
"!GIT_CMD!" init

echo [2/5] Staging files...
"!GIT_CMD!" add .

echo [3/5] Creating commit...
"!GIT_CMD!" commit -m "feat: complete Numerology & Intuitive Life Path Guide app"

echo [4/5] Setting main branch...
"!GIT_CMD!" branch -M main

echo [5/5] Connecting to remote and pushing to GitHub...
"!GIT_CMD!" remote remove origin >nul 2>nul
"!GIT_CMD!" remote add origin %REPO_URL%
"!GIT_CMD!" push -u origin main

echo.
echo =======================================================
echo   Done! Your repository has been uploaded to GitHub!
echo =======================================================
pause
