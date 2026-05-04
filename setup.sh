#!/bin/bash

# Employee Attrition Prediction - Setup Script
# This script automates the installation process

echo "=========================================="
echo "Employee Attrition Prediction Setup"
echo "=========================================="
echo ""

# Check Node.js
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi
echo "✅ Node.js $(node --version) found"

# Check Python
echo "Checking Python installation..."
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8 or higher."
    exit 1
fi
if command -v python3 &> /dev/null; then
    PYTHON_CMD=python3
else
    PYTHON_CMD=python
fi
echo "✅ Python $($PYTHON_CMD --version) found"

# Install Node.js dependencies
echo ""
echo "Installing Node.js dependencies..."
echo "-----------------------------------"

echo "Installing root dependencies..."
npm install

echo "Installing backend dependencies..."
cd backend && npm install && cd ..

echo "Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "✅ Node.js dependencies installed"

# Install Python dependencies
echo ""
echo "Installing Python dependencies..."
echo "-----------------------------------"
$PYTHON_CMD -m pip install pandas numpy scikit-learn xgboost joblib
echo "✅ Python dependencies installed"

# Create necessary directories
echo ""
echo "Creating necessary directories..."
mkdir -p backend/models
mkdir -p backend/data
echo "✅ Directories created"

# Check for dataset
echo ""
echo "Checking for dataset..."
if [ -f "backend/data/WA_Fn-UseC_-HR-Employee-Attrition.csv" ]; then
    echo "✅ Dataset found"
else
    echo "⚠️  Dataset not found!"
    echo "Please place 'WA_Fn-UseC_-HR-Employee-Attrition.csv' in the 'backend/data/' directory"
fi

echo ""
echo "=========================================="
echo "Setup Complete! 🎉"
echo "=========================================="
echo ""
echo "To start the application:"
echo "  npm run dev"
echo ""
echo "Then open your browser to:"
echo "  http://localhost:5173"
echo ""
echo "For more information, see SETUP.md"
echo ""
