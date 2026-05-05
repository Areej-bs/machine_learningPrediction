# 🎯 Employee Attrition Prediction System

A production-ready full-stack web application for predicting employee attrition using machine learning with **3 advanced ML models**.

## 📊 Project Overview

This application implements **3 comprehensive machine learning systems**:

### 1. 🔮 Attrition Prediction Model
Implements **5 machine learning algorithms** to predict employee attrition:
1. **Logistic Regression**
2. **Decision Tree**
3. **Random Forest**
4. **Gradient Boosting**
5. **XGBoost**

The system automatically selects the **best performing model** based on F1-Score.

### 2. 👥 Employee Segmentation Model
Uses **K-Means Clustering** to segment employees into distinct groups:
- Automatic optimal cluster detection
- Detailed segment profiles
- Attrition rate by segment
- Actionable insights per group

### 3. 💡 Recommendation System
Generates **personalized HR recommendations** by combining:
- Attrition risk prediction
- Employee segment analysis
- Individual characteristics
- Feature importance analysis

## 🏗️ Architecture

```
Frontend (React + Vite)
    ↓ REST API
Backend (Node.js + Express)
    ↓ Child Process
Python ML Service (scikit-learn, XGBoost)
```

## 🚀 Features

### Attrition Prediction
- ✅ **5 ML Algorithms** - All implemented and compared
- ✅ **Automatic Best Model Selection** - Based on F1-Score
- ✅ **Real-time Predictions** - Instant employee attrition risk assessment
- ✅ **Performance Metrics** - Accuracy, Precision, Recall, F1-Score, ROC-AUC
- ✅ **Feature Importance** - Understand key attrition factors

### Employee Segmentation
- ✅ **K-Means Clustering** - Automatic employee grouping
- ✅ **Segment Profiles** - Detailed characteristics per cluster
- ✅ **Attrition Analysis** - Risk levels by segment
- ✅ **Visual Analytics** - Interactive segment visualization

### Recommendation System
- ✅ **Personalized Recommendations** - Tailored HR actions
- ✅ **Priority Levels** - High/Medium/Low urgency
- ✅ **Action Plans** - Specific steps for each employee
- ✅ **Insights Dashboard** - Key risk factors and comparisons

### User Interface
- ✅ **Interactive Dashboard** - Beautiful charts and visualizations
- ✅ **Model Comparison** - Side-by-side algorithm performance
- ✅ **5 Dedicated Pages** - Dashboard, Prediction, Segmentation, Recommendations, Model Info

## 📁 Project Structure

```
employee-attrition-prediction/
├── backend/                    # Node.js Express server
│   ├── server.js              # Main server file
│   ├── routes/                # API routes
│   ├── ml/                    # Python ML scripts
│   │   ├── train.py          # Model training
│   │   ├── predict.py        # Prediction service
│   │   └── preprocess.py     # Data preprocessing
│   ├── models/                # Saved ML models
│   └── data/                  # Dataset
├── frontend/                   # React application
│   ├── src/
│   │   ├── pages/            # React pages
│   │   ├── components/       # Reusable components
│   │   ├── services/         # API services
│   │   └── App.jsx           # Main app component
│   └── package.json
├── package.json               # Root package.json
└── README.md                  # This file
```

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd employee-attrition-prediction
```

2. **Install dependencies**
```bash
# Install all dependencies (backend + frontend)
npm install
```

3. **Install Python dependencies**
```bash
pip install pandas numpy scikit-learn xgboost joblib
```

4. **Prepare the dataset**
- Place `WA_Fn-UseC_-HR-Employee-Attrition.csv` in `backend/data/` directory

### Running the Application

#### Development Mode

```bash
# Start both backend and frontend concurrently
npm run dev
```

This will start:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

#### Production Mode

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 📡 API Endpoints

### Attrition Prediction
- **POST /api/train** - Train all ML models and select the best one
- **POST /api/predict** - Make prediction for a single employee
- **GET /api/metrics** - Get performance metrics for all models
- **GET /api/feature-importance** - Get feature importance from best model

### Employee Segmentation
- **POST /api/segment** - Train K-Means clustering model
- **POST /api/segment/predict** - Predict employee segment
- **GET /api/clusters** - Get all cluster profiles

### Recommendations
- **POST /api/recommend** - Get personalized HR recommendations

### System
- **GET /api/health** - Health check endpoint

For detailed API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## 🎨 Frontend Pages

### 1. Dashboard (`/`)
- Model performance overview
- Comparison charts
- Key metrics visualization
- Best model indicator

### 2. Prediction Page (`/predict`)
- Employee data input form
- Real-time prediction
- Risk level assessment
- Probability score

### 3. Segmentation Page (`/segmentation`)
- Train clustering model
- View all employee segments
- Segment characteristics
- Attrition rates by cluster

### 4. Recommendations Page (`/recommendations`)
- Employee profile input
- Personalized HR recommendations
- Priority-based action plans
- Risk insights and comparisons

### 5. Model Info Page (`/model-info`)
- Algorithm explanations
- Feature importance
- Model selection rationale
- Technical details

## 🧪 ML Pipeline

### 1. Data Preprocessing
- Handle missing values
- Encode categorical variables (LabelEncoder)
- Scale numerical features (StandardScaler)
- Train/test split (80/20)

### 2. Model Training
All 5 algorithms are trained with optimized hyperparameters:
- **Logistic Regression**: max_iter=1000
- **Decision Tree**: max_depth=10
- **Random Forest**: n_estimators=100, max_depth=10
- **Gradient Boosting**: n_estimators=100, max_depth=5
- **XGBoost**: n_estimators=300, learning_rate=0.05, with class balancing

### 3. Model Evaluation
Each model is evaluated on:
- Accuracy
- Precision
- Recall
- F1-Score
- ROC-AUC

### 4. Best Model Selection
The model with the **highest F1-Score** is automatically selected and saved.

## 📊 Features Used

**Numerical Features (18):**
- Age, MonthlyIncome, YearsAtCompany, JobSatisfaction
- EnvironmentSatisfaction, WorkLifeBalance, JobInvolvement
- YearsInCurrentRole, YearsSinceLastPromotion, YearsWithCurrManager
- NumCompaniesWorked, TotalWorkingYears, TrainingTimesLastYear
- PercentSalaryHike, StockOptionLevel, DistanceFromHome
- JobLevel, RelationshipSatisfaction

**Categorical Features (7):**
- BusinessTravel, Department, EducationField
- Gender, JobRole, MaritalStatus, OverTime

## 🔍 Model Performance (Expected)

Based on the notebook analysis:

| Model | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
|-------|----------|-----------|--------|----------|---------|
| Logistic Regression | ~0.79 | ~0.58 | ~0.31 | ~0.40 | ~0.75 |
| Decision Tree | ~0.78 | ~0.52 | ~0.46 | ~0.49 | ~0.70 |
| Random Forest | ~0.86 | ~0.68 | ~0.46 | ~0.55 | ~0.82 |
| Gradient Boosting | ~0.87 | ~0.71 | ~0.46 | ~0.56 | ~0.83 |
| **XGBoost** | **~0.87** | **~0.68** | **~0.46** | **~0.55** | **~0.82** |

**Best Model: XGBoost** (based on F1-Score)

## 🎯 Key Insights

**Top 3 Predictive Factors:**
1. **OverTime** - Employees working overtime have higher attrition risk
2. **MonthlyIncome** - Lower income correlates with higher attrition
3. **YearsAtCompany** - Newer employees are more likely to leave

## 🐳 Docker Support (Optional)

```dockerfile
# Dockerfile included for containerization
docker build -t attrition-app .
docker run -p 5000:5000 attrition-app
```

## 🔐 Security Considerations

- Input validation on all API endpoints
- CORS configuration for production
- Environment variables for sensitive data
- Rate limiting on prediction endpoints

## 📈 Future Enhancements

- [ ] User authentication and authorization
- [ ] Batch prediction support
- [ ] Model retraining scheduler
- [ ] A/B testing for models
- [ ] Deployment to cloud (AWS/Azure/GCP)
- [ ] Real-time monitoring dashboard
- [ ] Email alerts for high-risk employees
- [ ] Integration with HR management systems
- [ ] Advanced visualization dashboards
- [ ] Export recommendations to PDF

## 🤝 Contributing

This project was built for academic purposes to demonstrate:
- Full-stack development skills
- Machine learning implementation
- Production-ready code practices
- Clean architecture and documentation

## 📝 License

MIT License - Feel free to use for educational purposes

## 👨‍💻 Author

Built with ❤️ for academic requirements

---

## 📚 Additional Documentation

- **[ML_MODELS_DOCUMENTATION.md](ML_MODELS_DOCUMENTATION.md)** - Complete ML models documentation
- **[QUICK_START_NEW_MODELS.md](QUICK_START_NEW_MODELS.md)** - Quick start guide for new models
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Detailed API reference

---

**Note:** This application implements ALL algorithms from the ML2.ipynb notebook and includes 3 complete ML systems: Attrition Prediction, Employee Segmentation, and Recommendation System.
