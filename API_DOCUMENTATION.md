# 📡 API Documentation

Complete API reference for the Employee Attrition Prediction System.

## Base URL

```
http://localhost:5000/api
```

## Endpoints

### 1. Health Check

Check if the server is running.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-05-04T12:00:00.000Z"
}
```

---

### 2. Train Models

Train all 5 ML models and select the best one.

**Endpoint:** `POST /api/train`

**Request:** No body required

**Response:**
```json
{
  "success": true,
  "message": "Models trained successfully",
  "bestModel": "XGBoost",
  "metrics": {
    "accuracy": 0.8673,
    "precision": 0.6842,
    "recall": 0.4615,
    "f1": 0.5517,
    "roc_auc": 0.8234
  },
  "allModels": {
    "Logistic Regression": {
      "accuracy": 0.7891,
      "precision": 0.5789,
      "recall": 0.3077,
      "f1": 0.4000,
      "roc_auc": 0.7456
    },
    "Decision Tree": {
      "accuracy": 0.7823,
      "precision": 0.5200,
      "recall": 0.4615,
      "f1": 0.4889,
      "roc_auc": 0.7012
    },
    "Random Forest": {
      "accuracy": 0.8605,
      "precision": 0.6800,
      "recall": 0.4615,
      "f1": 0.5500,
      "roc_auc": 0.8189
    },
    "Gradient Boosting": {
      "accuracy": 0.8707,
      "precision": 0.7105,
      "recall": 0.4615,
      "f1": 0.5600,
      "roc_auc": 0.8301
    },
    "XGBoost": {
      "accuracy": 0.8673,
      "precision": 0.6842,
      "recall": 0.4615,
      "f1": 0.5517,
      "roc_auc": 0.8234
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Dataset not found. Please place WA_Fn-UseC_-HR-Employee-Attrition.csv in backend/data/ directory"
}
```

---

### 3. Make Prediction

Predict attrition risk for a single employee.

**Endpoint:** `POST /api/predict`

**Request Body:**
```json
{
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
}
```

**Response:**
```json
{
  "success": true,
  "prediction": 0,
  "probability": 0.2345,
  "riskLevel": "Low",
  "model": "XGBoost",
  "interpretation": {
    "willLeave": false,
    "confidence": 0.7655,
    "message": "Low risk of attrition"
  }
}
```

**Field Descriptions:**

| Field | Type | Description | Valid Values |
|-------|------|-------------|--------------|
| Age | number | Employee age | 18-65 |
| MonthlyIncome | number | Monthly salary in dollars | > 0 |
| YearsAtCompany | number | Years at current company | >= 0 |
| JobSatisfaction | number | Job satisfaction level | 1-4 |
| EnvironmentSatisfaction | number | Environment satisfaction | 1-4 |
| WorkLifeBalance | number | Work-life balance rating | 1-4 |
| JobInvolvement | number | Job involvement level | 1-4 |
| YearsInCurrentRole | number | Years in current role | >= 0 |
| YearsSinceLastPromotion | number | Years since last promotion | >= 0 |
| YearsWithCurrManager | number | Years with current manager | >= 0 |
| NumCompaniesWorked | number | Number of companies worked | >= 0 |
| TotalWorkingYears | number | Total working years | >= 0 |
| TrainingTimesLastYear | number | Training sessions last year | >= 0 |
| PercentSalaryHike | number | Salary hike percentage | 0-25 |
| StockOptionLevel | number | Stock option level | 0-3 |
| DistanceFromHome | number | Distance from home (km) | >= 0 |
| JobLevel | number | Job level | 1-5 |
| RelationshipSatisfaction | number | Relationship satisfaction | 1-4 |
| BusinessTravel | string | Travel frequency | "Travel_Rarely", "Travel_Frequently", "Non-Travel" |
| Department | string | Department name | "Research & Development", "Sales", "Human Resources" |
| EducationField | string | Education field | "Life Sciences", "Medical", "Marketing", "Technical Degree", "Other", "Human Resources" |
| Gender | string | Gender | "Male", "Female" |
| JobRole | string | Job role | "Research Scientist", "Sales Executive", "Laboratory Technician", "Manufacturing Director", "Healthcare Representative", "Manager", "Sales Representative", "Research Director", "Human Resources" |
| MaritalStatus | string | Marital status | "Single", "Married", "Divorced" |
| OverTime | string | Works overtime | "Yes", "No" |

**Error Response:**
```json
{
  "success": false,
  "error": "Model not found. Please train the models first using /api/train endpoint"
}
```

---

### 4. Get Metrics

Retrieve performance metrics for all trained models.

**Endpoint:** `GET /api/metrics`

**Response:**
```json
{
  "success": true,
  "bestModel": "XGBoost",
  "metrics": {
    "accuracy": 0.8673,
    "precision": 0.6842,
    "recall": 0.4615,
    "f1": 0.5517,
    "roc_auc": 0.8234
  },
  "comparison": [
    {
      "model": "Logistic Regression",
      "accuracy": 0.7891,
      "precision": 0.5789,
      "recall": 0.3077,
      "f1": 0.4000,
      "roc_auc": 0.7456
    },
    {
      "model": "Decision Tree",
      "accuracy": 0.7823,
      "precision": 0.5200,
      "recall": 0.4615,
      "f1": 0.4889,
      "roc_auc": 0.7012
    },
    {
      "model": "Random Forest",
      "accuracy": 0.8605,
      "precision": 0.6800,
      "recall": 0.4615,
      "f1": 0.5500,
      "roc_auc": 0.8189
    },
    {
      "model": "Gradient Boosting",
      "accuracy": 0.8707,
      "precision": 0.7105,
      "recall": 0.4615,
      "f1": 0.5600,
      "roc_auc": 0.8301
    },
    {
      "model": "XGBoost",
      "accuracy": 0.8673,
      "precision": 0.6842,
      "recall": 0.4615,
      "f1": 0.5517,
      "roc_auc": 0.8234
    }
  ]
}
```

---

### 5. Get Feature Importance

Get feature importance from the best model.

**Endpoint:** `GET /api/feature-importance`

**Response:**
```json
{
  "success": true,
  "features": [
    {
      "feature": "OverTime",
      "importance": 0.1523
    },
    {
      "feature": "MonthlyIncome",
      "importance": 0.1234
    },
    {
      "feature": "YearsAtCompany",
      "importance": 0.0987
    }
  ]
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input or missing data |
| 500 | Internal Server Error - Server or Python script error |

## Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider implementing rate limiting to prevent abuse.

## CORS

CORS is enabled for all origins in development. For production, configure specific allowed origins in `backend/server.js`.

## Example Usage

### Using cURL

**Train Models:**
```bash
curl -X POST http://localhost:5000/api/train
```

**Make Prediction:**
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d @employee_data.json
```

**Get Metrics:**
```bash
curl http://localhost:5000/api/metrics
```

### Using JavaScript (Axios)

```javascript
import axios from 'axios';

// Train models
const trainResponse = await axios.post('http://localhost:5000/api/train');
console.log(trainResponse.data);

// Make prediction
const predictionResponse = await axios.post('http://localhost:5000/api/predict', {
  Age: 35,
  MonthlyIncome: 5000,
  // ... other fields
});
console.log(predictionResponse.data);

// Get metrics
const metricsResponse = await axios.get('http://localhost:5000/api/metrics');
console.log(metricsResponse.data);
```

### Using Python (requests)

```python
import requests
import json

# Train models
response = requests.post('http://localhost:5000/api/train')
print(response.json())

# Make prediction
employee_data = {
    'Age': 35,
    'MonthlyIncome': 5000,
    # ... other fields
}
response = requests.post('http://localhost:5000/api/predict', json=employee_data)
print(response.json())

# Get metrics
response = requests.get('http://localhost:5000/api/metrics')
print(response.json())
```

---

## Notes

- All endpoints return JSON responses
- The `/api/train` endpoint may take 30-60 seconds to complete
- Models must be trained before making predictions
- Feature importance is only available for tree-based models
