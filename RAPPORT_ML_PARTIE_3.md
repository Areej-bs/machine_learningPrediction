### 3.3 Modèle 3: Système de Recommandations

#### 3.3.1 Description
Le système de recommandations combine les résultats des deux modèles précédents pour générer des **recommandations RH personnalisées** et actionnables.

#### 3.3.2 Architecture Hybride

```
┌─────────────────────────────────────────────────────────┐
│              SYSTÈME DE RECOMMANDATIONS                  │
└─────────────────────────────────────────────────────────┘
                        ↓
        ┌───────────────┴───────────────┐
        ↓                               ↓
┌──────────────────┐          ┌──────────────────┐
│ Modèle Attrition │          │ Modèle Segment   │
│  (Supervisé)     │          │ (Non-supervisé)  │
└──────────────────┘          └──────────────────┘
        ↓                               ↓
   Probabilité                    Profil Cluster
   Risque Level                   Caractéristiques
        ↓                               ↓
        └───────────────┬───────────────┘
                        ↓
            ┌───────────────────────┐
            │  Moteur de Règles     │
            │  + Feature Analysis   │
            └───────────────────────┘
                        ↓
            ┌───────────────────────┐
            │  Recommandations      │
            │  Personnalisées       │
            │  + Priorités          │
            └───────────────────────┘
```

#### 3.3.3 Catégories de Recommandations

**1. Retention (Rétention)**
- Priorité: High
- Déclencheur: Probabilité attrition > 0.7
- Actions:
  - Réunion urgente avec manager
  - Discussion opportunités carrière
  - Révision compensation
  - Identification et résolution des préoccupations

**2. Engagement**
- Priorité: High/Medium
- Déclencheur: JobSatisfaction ≤ 2
- Actions:
  - Enquête de satisfaction
  - Révision responsabilités
  - Reconnaissance et feedback
  - Ajustements de rôle

**3. Well-being (Bien-être)**
- Priorité: Medium
- Déclencheur: WorkLifeBalance ≤ 2
- Actions:
  - Révision heures et overtime
  - Arrangements flexibles
  - Programmes wellness
  - Encouragement congés

**4. Development (Développement)**
- Priorité: Medium
- Déclencheur: YearsSinceLastPromotion > 3
- Actions:
  - Discussion objectifs carrière
  - Plan de développement
  - Opportunités promotion
  - Formation compétences

**5. Training (Formation)**
- Priorité: Low
- Déclencheur: TrainingTimesLastYear < 2
- Actions:
  - Programmes de formation
  - Ressources e-learning
  - Conférences industrie
  - Formation croisée

**6. Segment-Specific (Spécifique au Segment)**
- Priorité: Variable
- Déclencheur: Appartenance à segment à risque
- Actions:
  - Stratégies segment-spécifiques
  - Monitoring rapproché
  - Benchmarking pairs
  - Interventions ciblées

#### 3.3.4 Système de Priorités

```python
def calculate_priority(attrition_prob, job_satisfaction, segment_risk):
    if attrition_prob > 0.7 or job_satisfaction <= 1:
        return 'High'
    elif attrition_prob > 0.5 or job_satisfaction <= 2:
        return 'Medium'
    else:
        return 'Low'
```

**Niveaux de Priorité:**
- **High**: Action immédiate requise (< 1 semaine)
- **Medium**: Action à court terme (1-4 semaines)
- **Low**: Action à moyen terme (1-3 mois)

#### 3.3.5 Génération d'Insights

Le système génère 3 types d'insights:

**1. Risk Factors (Facteurs de Risque)**
- Identifie les features problématiques
- Compare aux seuils critiques
- Liste les facteurs contributifs

**2. Segment Analysis (Analyse de Segment)**
- Profil du segment d'appartenance
- Taux d'attrition du segment
- Caractéristiques moyennes

**3. Comparative Analysis (Analyse Comparative)**
- Comparaison employé vs moyenne segment
- Écarts significatifs
- Benchmarking

#### 3.3.6 Exemple de Sortie

```json
{
  "attritionRisk": {
    "prediction": 1,
    "probability": 0.78,
    "level": "High"
  },
  "segment": {
    "clusterId": 0,
    "label": "High Risk",
    "profile": {
      "attritionRate": 28.5,
      "avgAge": 32.1,
      "avgIncome": 4200
    }
  },
  "recommendations": [
    {
      "category": "Retention",
      "priority": "High",
      "title": "Immediate Retention Action Required",
      "actions": [
        "Schedule immediate meeting with manager",
        "Discuss career development opportunities",
        "Review compensation and benefits"
      ]
    }
  ],
  "insights": [
    {
      "type": "risk_factors",
      "title": "Key Risk Factors",
      "content": [
        "OverTime: Yes",
        "JobSatisfaction: 1",
        "MonthlyIncome: 3500"
      ]
    }
  ]
}
```

---

## 4. PIPELINE DE DONNÉES

### 4.1 Dataset Source

**Nom:** IBM HR Analytics Employee Attrition Dataset  
**Source:** Kaggle / IBM Watson Analytics  
**Fichier:** WA_Fn-UseC_-HR-Employee-Attrition.csv

**Statistiques:**
- Nombre d'employés: 1,470
- Nombre de features: 35
- Classe cible: Attrition (Yes/No)
- Déséquilibre: ~16% attrition, 84% rétention
- Pas de valeurs manquantes

### 4.2 Exploration des Données

**Distribution de la Cible:**
- Attrition = Yes: 237 (16.1%)
- Attrition = No: 1,233 (83.9%)
- Ratio: 1:5.2 (déséquilibré)

**Features Numériques:**
- Age: 18-60 ans (moyenne: 37)
- MonthlyIncome: 1,009-19,999 $ (moyenne: 6,503 $)
- YearsAtCompany: 0-40 ans (moyenne: 7)

**Features Catégorielles:**
- BusinessTravel: 3 catégories
- Department: 3 catégories
- JobRole: 9 catégories
- OverTime: 2 catégories (Yes/No)

### 4.3 Preprocessing Steps

#### 4.3.1 Nettoyage
```python
# Vérification valeurs manquantes
df.isnull().sum()  # Aucune valeur manquante

# Suppression features constantes
df = df.drop(['EmployeeCount', 'Over18', 'StandardHours'], axis=1)
```

#### 4.3.2 Encodage
```python
# Target encoding
df['Attrition'] = (df['Attrition'] == 'Yes').astype(int)

# Label encoding pour catégorielles
for col in categorical_features:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le
```

#### 4.3.3 Scaling
```python
# Standardisation (mean=0, std=1)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
```

#### 4.3.4 Train/Test Split
```python
# Split stratifié 80/20
X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=0.2, 
    random_state=42, 
    stratify=y
)
```

### 4.4 Gestion du Déséquilibre

**Techniques Utilisées:**

1. **Stratified Split**
   - Maintient la proportion de classes
   - Train: 16% attrition
   - Test: 16% attrition

2. **Class Weighting (XGBoost)**
   ```python
   scale_pos_weight = (y_train == 0).sum() / (y_train == 1).sum()
   # scale_pos_weight ≈ 5.2
   ```

3. **Métrique Appropriée**
   - F1-Score au lieu d'Accuracy
   - Équilibre Precision/Recall
   - ROC-AUC pour évaluation globale

### 4.5 Validation

**Stratégie:**
- Hold-out validation (80/20)
- Pas de cross-validation (dataset petit)
- Évaluation sur test set uniquement

**Métriques:**
- Accuracy: Performance globale
- Precision: Faux positifs
- Recall: Faux négatifs
- F1-Score: Équilibre (critère principal)
- ROC-AUC: Discrimination

---

## 5. API ET BACKEND

### 5.1 Architecture Backend

**Framework:** Express.js 4.18.2  
**Langage:** JavaScript (Node.js)  
**Port:** 5000 (dev) / 10000 (prod)

**Structure:**
```
backend/
├── server.js           # Serveur principal
├── ml/                 # Scripts Python
│   ├── train.py
│   ├── predict.py
│   ├── segment.py
│   ├── segment_predict.py
│   └── recommend.py
├── models/             # Modèles sauvegardés
│   ├── best_model.pkl
│   ├── scaler.pkl
│   ├── label_encoders.pkl
│   ├── clustering_model.pkl
│   └── metrics.json
├── data/               # Dataset
│   └── WA_Fn-UseC_-HR-Employee-Attrition.csv
└── package.json
```
