
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  Upload Numerology App to GitHub / GitLab Repository" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Git is not installed or not found in your PATH." -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "After installing, restart your terminal and run this script again.`n"
    Read-Host "Press Enter to exit"
    exit 1
}

$repoUrl = Read-Host "Enter your remote Git Repository URL (e.g. https://github.com/username/numerology-app.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "[ERROR] No repository URL entered. Aborting." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "`n[1/5] Initializing Git repository..." -ForegroundColor Green
git init

Write-Host "[2/5] Staging files..." -ForegroundColor Green
git add .

Write-Host "[3/5] Creating commit..." -ForegroundColor Green
git commit -m "feat: complete Numerology & Intuitive Life Path Guide app"

Write-Host "[4/5] Setting main branch..." -ForegroundColor Green
git branch -M main

Write-Host "[5/5] Connecting to remote and pushing to $repoUrl..." -ForegroundColor Green
git remote remove origin 2>$null
git remote add origin $repoUrl
git push -u origin main

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "  Success! Your code is now live on your repository!" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Cyan
Read-Host "Press Enter to exit"
