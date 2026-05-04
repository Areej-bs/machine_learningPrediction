@echo off
REM Employee Attrition Prediction - Setup Script for Windows
REM This script automates the installation process

echo ==========================================
echo Employee Attrition Prediction Setup
echo ==========================================
echo.

REM Check Node.js
echo Checking Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed. Please install Node.js v16 or higher.
    pause
    exit /b 1
)
node --version
echo √ Node.js found
echo.

REM Check Python
echo Checking Python installation...
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)
python --version
echo √ Python found
echo.

REM Install Node.js dependencies
echo Installing Node.js dependencies...
echo -----------------------------------
echo.

echo Installing root dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo X Failed to install root dependencies
    pause
    exit /b 1
)

echo Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo X Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

echo Installing frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo X Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo √ Node.js dependencies installed
echo.

REM Install Python dependencies
echo Installing Python dependencies...
echo -----------------------------------
python -m pip install pandas numpy scikit-learn xgboost joblib
if %ERRORLEVEL% NEQ 0 (
    echo X Failed to install Python dependencies
    pause
    exit /b 1
)
echo √ Python dependencies installed
echo.

REM Create necessary directories
echo Creating necessary directories...
if not exist "backend\models" mkdir backend\models
if not exist "backend\data" mkdir backend\data
echo √ Directories created
echo.

REM Check for dataset
echo Checking for dataset...
if exist "backend\data\WA_Fn-UseC_-HR-Employee-Attrition.csv" (
    echo √ Dataset found
) else (
    echo ! Dataset not found!
    echo Please place 'WA_Fn-UseC_-HR-Employee-Attrition.csv' in the 'backend\data\' directory
)
echo.

echo ==========================================
echo Setup Complete! 🎉
echo ==========================================
echo.
echo To start the application:
echo   npm run dev
echo.
echo Then open your browser to:
echo   http://localhost:5173
echo.
echo For more information, see SETUP.md
echo.
pause
