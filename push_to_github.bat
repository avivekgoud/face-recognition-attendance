@echo off
setlocal enabledelayedexpansion

echo ======================================================================
echo           FaceSync - GitHub Repository Setup & Push Utility
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/4] Checking Git repository initialization...
if not exist ".git" (
    git init
    git branch -M main
    echo [+] Initialized empty Git repository on branch 'main'.
) else (
    echo [+] Git repository already initialized.
)

echo.
echo [2/4] Staging project files...
git add .

echo.
echo [3/4] Creating initial commit...
git commit -m "feat: initial release of FaceSync Face Recognition Attendance System"

echo.
echo [4/4] Remote Repository Link
echo ----------------------------------------------------------------------
echo Please enter your GitHub Repository URL (HTTPS or SSH):
echo Example: https://github.com/your-username/face-recognition-attendance.git
echo.
set /p REPO_URL="Enter GitHub Repo URL (or press Enter to skip): "

if not "%REPO_URL%"=="" (
    git remote remove origin 2>nul
    git remote add origin %REPO_URL%
    echo.
    echo [*] Pushing to GitHub (main branch)...
    git push -u origin main
    echo.
    echo [+] Successfully pushed to GitHub!
) else (
    echo.
    echo [*] Skipped remote push. You can push manually at any time using:
    echo     git remote add origin ^<your-repo-url^>
    echo     git push -u origin main
)

echo.
echo ======================================================================
pause
