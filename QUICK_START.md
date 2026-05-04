# ⚡ Quick Start Guide

Get up and running in 5 minutes!

## 🎯 Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- Dataset: `WA_Fn-UseC_-HR-Employee-Attrition.csv`

## 🚀 Installation (Choose One)

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

```bash
# Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Install Python packages
pip install pandas numpy scikit-learn xgboost joblib

# Create directories
mkdir -p backend/models backend/data

# Add dataset to backend/data/
```

## ▶️ Run Application

```bash
npm run dev
```

Opens:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📝 First Steps

1. **Open browser** → http://localhost:5173
2. **Click "Train Models"** on Dashboard
3. **Wait 30-60 seconds** for training
4. **Go to Prediction page**
5. **Fill form and predict!**

## 🐳 Docker (Alternative)

```bash
# Place dataset in backend/data/ first
docker-compose up --build
```

Access at: http://localhost:5000

## ❓ Troubleshooting

**"Dataset not found"**
→ Place CSV in `backend/data/` folder

**"Python script failed"**
→ Run: `pip install -r backend/ml/requirements.txt`

**"Port already in use"**
→ Change port in `backend/server.js`

## 📚 More Info

- Full setup: `SETUP.md`
- API docs: `API_DOCUMENTATION.md`
- Project info: `README.md`

## ✅ Success Checklist

- [ ] Dependencies installed
- [ ] Dataset in `backend/data/`
- [ ] Server starts without errors
- [ ] Frontend loads in browser
- [ ] Models train successfully
- [ ] Predictions work

---

**Need help?** Check `SETUP.md` for detailed instructions.
