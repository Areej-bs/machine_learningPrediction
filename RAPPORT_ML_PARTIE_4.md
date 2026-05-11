### 5.2 Endpoints API Détaillés

#### 5.2.1 POST /api/train
**Description:** Entraîne les 5 modèles ML et sélectionne le meilleur

**Request:**
```http
POST /api/train
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Models trained successfully",
  "bestModel": "XGBoost",
  "metrics": {
    "accuracy": 0.867,
    "precision": 0.684,
    "recall": 0.462,
    "f1": 0.552,
    "roc_auc": 0.823
  },
  "allModels": {
    "Logistic Regression": {...},
    "Decision Tree": {...},
    "Random Forest": {...},
    "Gradient Boosting": {...},
    "XGBoost": {...}
  }
}
```

**Durée:** 30-60 secondes

#### 5.2.2 POST /api/predict
**Description:** Prédit l'attrition pour un employé

**Request:**
```http
POST /api/predict
Content-Type: application/json

{
  "Age": 35,
  "MonthlyIncome": 5000,
  "YearsAtCompany": 5,
  "JobSatisfaction": 3,
  "OverTime": "No",
  ...
}
```

**Response:**
```json
{
  "success": true,
  "prediction": 0,
  "probability": 0.234,
  "riskLevel": "Low",
  "model": "XGBoost",
  "interpretation": {
    "willLeave": false,
    "confidence": 0.766,
    "message": "Low risk of attrition"
  }
}
```

**Durée:** < 1 seconde

#### 5.2.3 POST /api/segment
**Description:** Entraîne le modèle de clustering

**Request:**
```http
POST /api/segment
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "n_clusters": 4,
  "metrics": {
    "silhouette_score": 0.342,
    "davies_bouldin_score": 1.234
  },
  "clusters": [
    {
      "clusterId": 0,
      "label": "High Risk",
      "size": 245,
      "percentage": 16.7,
      "characteristics": {
        "avgAge": 32.1,
        "avgIncome": 4200,
        "attritionRate": 28.5
      }
    },
    ...
  ]
}
```

**Durée:** 10-20 secondes

#### 5.2.4 GET /api/clusters
**Description:** Récupère les profils de clusters

**Request:**
```http
GET /api/clusters
```

**Response:**
```json
{
  "success": true,
  "clusters": [...],
  "metrics": {...}
}
```

#### 5.2.5 POST /api/recommend
**Description:** Génère des recommandations RH

**Request:**
```http
POST /api/recommend
Content-Type: application/json

{
  "Age": 30,
  "MonthlyIncome": 4000,
  "JobSatisfaction": 2,
  ...
}
```

**Response:**
```json
{
  "success": true,
  "attritionRisk": {
    "probability": 0.65,
    "level": "High"
  },
  "segment": {
    "clusterId": 0,
    "label": "High Risk"
  },
  "recommendations": [
    {
      "category": "Retention",
      "priority": "High",
      "title": "Immediate Retention Action Required",
      "actions": [...]
    }
  ],
  "insights": [...]
}
```

**Durée:** 1-2 secondes

#### 5.2.6 GET /api/metrics
**Description:** Récupère les métriques des modèles

**Request:**
```http
GET /api/metrics
```

**Response:**
```json
{
  "success": true,
  "bestModel": "XGBoost",
  "metrics": {...},
  "comparison": [...]
}
```

#### 5.2.7 GET /api/feature-importance
**Description:** Récupère l'importance des features

**Request:**
```http
GET /api/feature-importance
```

**Response:**
```json
{
  "success": true,
  "features": [
    {
      "feature": "OverTime",
      "importance": 0.152
    },
    ...
  ]
}
```

#### 5.2.8 GET /api/health
**Description:** Health check du serveur

**Request:**
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-05-11T10:30:00.000Z",
  "version": "2.2.0"
}
```

### 5.3 Middleware et Sécurité

#### 5.3.1 CORS Configuration
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://machine-learningprediction-2.onrender.com',
    /\.onrender\.com$/
  ],
  credentials: true
}));
```

#### 5.3.2 Body Parser
```javascript
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
```

#### 5.3.3 Logging
```javascript
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});
```

#### 5.3.4 Error Handling
```javascript
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});
```

### 5.4 Intégration Python-Node.js

**Méthode:** Child Process avec spawn()

```javascript
function runPythonScript(scriptName, args = []) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'ml', scriptName);
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    const python = spawn(pythonCmd, [scriptPath, ...args]);
    
    let dataString = '';
    let errorString = '';

    python.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorString += data.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(errorString));
      } else {
        resolve(JSON.parse(dataString));
      }
    });
  });
}
```

**Avantages:**
- Communication asynchrone
- Gestion des erreurs robuste
- Parsing JSON automatique
- Logs stderr séparés

---

## 6. INTERFACE UTILISATEUR

### 6.1 Architecture Frontend

**Framework:** React 18.2.0  
**Build Tool:** Vite 5.0.8  
**Routing:** React Router DOM 6.20.0  
**Charts:** Chart.js 4.4.0 + react-chartjs-2  
**HTTP Client:** Axios 1.6.2

**Structure:**
```
frontend/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Prediction.jsx
│   │   ├── Segmentation.jsx
│   │   ├── Recommendations.jsx
│   │   └── ModelInfo.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

### 6.2 Pages de l'Application

#### 6.2.1 Dashboard (/)
**Fonctionnalités:**
- Affichage des 5 modèles ML
- Métriques de performance (Accuracy, Precision, Recall, F1, ROC-AUC)
- Graphiques de comparaison
- Bouton "Train Models"
- Indicateur du meilleur modèle

**Composants:**
- ModelCard (x5)
- PerformanceChart
- TrainButton
- BestModelBadge

#### 6.2.2 Prediction (/predict)
**Fonctionnalités:**
- Formulaire de saisie employé (25 champs)
- Validation des inputs
- Bouton "Predict Attrition"
- Affichage résultat:
  - Prédiction (Will Leave / Will Stay)
  - Probabilité (0-100%)
  - Risk Level (Low/Medium/High)
  - Confidence score

**Composants:**
- EmployeeForm
- PredictionResult
- RiskLevelIndicator
- ProbabilityGauge

#### 6.2.3 Segmentation (/segmentation)
**Fonctionnalités:**
- Bouton "Train Clustering Model"
- Affichage des segments:
  - Nombre de clusters
  - Taille de chaque segment
  - Taux d'attrition par segment
  - Caractéristiques moyennes
- Métriques de clustering (Silhouette, Davies-Bouldin)

**Composants:**
- ClusterCard (x N clusters)
- ClusteringMetrics
- SegmentChart
- TrainClusteringButton

#### 6.2.4 Recommendations (/recommendations)
**Fonctionnalités:**
- Formulaire employé (même que Prediction)
- Bouton "Get Recommendations"
- Affichage résultats:
  - Risque d'attrition
  - Segment d'appartenance
  - Liste de recommandations (priorité, catégorie, actions)
  - Insights et comparaisons

**Composants:**
- EmployeeForm
- RecommendationCard (x N recommandations)
- InsightPanel
- SegmentInfo
- RiskSummary

#### 6.2.5 Model Info (/model-info)
**Fonctionnalités:**
- Explications des 5 algorithmes
- Feature importance
- Rationale de sélection du modèle
- Détails techniques
- Hyperparamètres

**Composants:**
- AlgorithmCard (x5)
- FeatureImportanceChart
- TechnicalDetails

### 6.3 Service API (api.js)

```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const trainModels = async () => {
  const response = await api.post('/train');
  return response.data;
};

export const makePrediction = async (employeeData) => {
  const response = await api.post('/predict', employeeData);
  return response.data;
};

export const trainClustering = async () => {
  const response = await api.post('/segment');
  return response.data;
};

export const getRecommendations = async (employeeData) => {
  const response = await api.post('/recommend', employeeData);
  return response.data;
};

export const getMetrics = async () => {
  const response = await api.get('/metrics');
  return response.data;
};

export const getClusters = async () => {
  const response = await api.get('/clusters');
  return response.data;
};
```

### 6.4 Responsive Design

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Techniques:**
- CSS Flexbox
- CSS Grid
- Media queries
- Mobile-first approach
