# 🚀 Setup Guide - Employee Attrition Prediction System

This guide will help you set up and run the application step by step.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** (optional) - For cloning the repository

### Verify Installation

```bash
node --version    # Should show v16.x.x or higher
python --version  # Should show Python 3.8.x or higher
npm --version     # Should show 8.x.x or higher
```

## 📦 Installation Steps

### Step 1: Clone or Download the Project

```bash
# If using Git
git clone <repository-url>
cd employee-attrition-prediction

# Or download and extract the ZIP file
```

### Step 2: Install Node.js Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 3: Install Python Dependencies

```bash
# Install Python packages
pip install pandas numpy scikit-learn xgboost joblib

# Or use the requirements file
pip install -r backend/ml/requirements.txt
```

**Note for Windows users:** If you encounter issues with Python packages, try:
```bash
python -m pip install pandas numpy scikit-learn xgboost joblib
```

### Step 4: Prepare the Dataset

1. Download the dataset: `WA_Fn-UseC_-HR-Employee-Attrition.csv`
2. Place it in the `backend/data/` directory

**Dataset Structure:**
```
backend/
  └── data/
      └── WA_Fn-UseC_-HR-Employee-Attrition.csv
```

**Important:** The application will not work without this dataset file!

### Step 5: Create Required Directories

```bash
# Create models directory (if not exists)
mkdir -p backend/models
```

## 🎯 Running the Application

### Option 1: Development Mode (Recommended for Testing)

This runs both backend and frontend with hot-reload:

```bash
# From the root directory
npm run dev
```

This will start:
- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:5173

### Option 2: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 3: Production Mode

```bash
# Build frontend
cd frontend
npm run build
cd ..

# Start backend (serves built frontend)
cd backend
node server.js
```

Access the app at: http://localhost:5000

## 🐳 Docker Deployment (Optional)

### Using Docker Compose

```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d

# Stop
docker-compose down
```

### Using Docker Only

```bash
# Build image
docker build -t attrition-app .

# Run container
docker run -p 5000:5000 -v $(pwd)/backend/data:/app/backend/data attrition-app
```

## 🧪 Testing the Application

### 1. Check Backend Health

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-05-04T..."
}
```

### 2. Train Models

Open your browser and go to:
- http://localhost:5173 (development)
- Click "Train Models" button on the Dashboard

Or use curl:
```bash
curl -X POST http://localhost:5000/api/train
```

### 3. Make a Prediction

Go to the Prediction page and fill in the form, or use curl:

```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Age": 35,
    "MonthlyIncome": 5000,
    "YearsAtCompany": 5,
    "JobSatisfaction": 3,
    "EnvironmentSatisfaction": 3,
    "WorkLifeBalance": 3,
    "JobInvolvement": 3,
    "YearsInCurrentRole": 2,
    "YearsSinceLastPromotion": 1,
    "YearsWithCurrManager": 2,
    "NumCompaniesWorked": 2,
    "TotalWorkingYears": 10,
    "TrainingTimesLastYear": 2,
    "PercentSalaryHike": 15,
    "StockOptionLevel": 1,
    "DistanceFromHome": 10,
    "JobLevel": 2,
    "RelationshipSatisfaction": 3,
    "BusinessTravel": "Travel_Rarely",
    "Department": "Research & Development",
    "EducationField": "Life Sciences",
    "Gender": "Male",
    "JobRole": "Research Scientist",
    "MaritalStatus": "Single",
    "OverTime": "No"
  }'
```

## 🔧 Troubleshooting

### Issue: "Dataset not found"

**Solution:**
- Ensure `WA_Fn-UseC_-HR-Employee-Attrition.csv` is in `backend/data/` directory
- Check file name spelling (case-sensitive)

### Issue: "Python script failed"

**Solution:**
- Verify Python is installed: `python --version`
- Install missing packages: `pip install -r backend/ml/requirements.txt`
- Try using `python3` instead of `python`

### Issue: "Port already in use"

**Solution:**
- Change port in `backend/server.js` (line: `const PORT = 5000`)
- Or kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:5000 | xargs kill -9
  ```

### Issue: "Module not found" errors

**Solution:**
- Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules backend/node_modules frontend/node_modules
  npm install
  cd backend && npm install && cd ..
  cd frontend && npm install && cd ..
  ```

### Issue: Frontend can't connect to backend

**Solution:**
- Ensure backend is running on port 5000
- Check CORS settings in `backend/server.js`
- Verify proxy settings in `frontend/vite.config.js`

## 📱 Application Usage

### 1. Dashboard Page
- View model performance metrics
- Compare all 5 algorithms
- See which model was selected as best
- Train new models

### 2. Prediction Page
- Enter employee information
- Get attrition risk prediction
- View probability and risk level
- See recommended actions for high-risk employees

### 3. Model Info Page
- Learn about each algorithm
- View feature importance
- Understand model selection criteria
- See technical implementation details

## 🎓 For Academic Submission

### What to Include:

1. **Source Code** - All files in this directory
2. **README.md** - Project overview and documentation
3. **Screenshots** - Dashboard, Prediction, Model Info pages
4. **Dataset** - Include or provide download link
5. **Demo Video** (optional) - Screen recording of the app in action

### Key Points to Highlight:

✅ **All 5 algorithms implemented:**
- Logistic Regression
- Decision Tree
- Random Forest
- Gradient Boosting
- XGBoost

✅ **Best model selection** based on F1-Score

✅ **Production-ready architecture:**
- RESTful API
- Modern React frontend
- Python ML backend
- Clean code with comments

✅ **Complete evaluation metrics:**
- Accuracy, Precision, Recall, F1-Score, ROC-AUC

## 📞 Support

If you encounter any issues:

1. Check this SETUP.md file
2. Review error messages carefully
3. Ensure all prerequisites are installed
4. Verify dataset is in correct location
5. Check console logs for detailed errors

## 🎉 Success Indicators

You'll know everything is working when:

✅ Backend starts without errors
✅ Frontend loads in browser
✅ "Train Models" completes successfully
✅ Predictions return results
✅ All pages display correctly

---

**Good luck with your project! 🚀**
