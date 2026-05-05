# Documentation des Modèles ML

## Vue d'ensemble

Ce système comprend maintenant **3 modèles de Machine Learning** :

1. **Modèle de Prédiction d'Attrition** - Prédit si un employé va quitter l'entreprise
2. **Modèle de Segmentation** - Segmente les employés en groupes homogènes
3. **Système de Recommandation** - Génère des recommandations RH personnalisées

---

## 1. Modèle de Prédiction d'Attrition

### Description
Prédit la probabilité qu'un employé quitte l'entreprise en utilisant 5 algorithmes différents et sélectionne automatiquement le meilleur.

### Algorithmes utilisés
- Logistic Regression
- Decision Tree
- Random Forest
- Gradient Boosting
- XGBoost

### Endpoints API

#### Entraîner le modèle
```bash
POST /api/train
```

#### Faire une prédiction
```bash
POST /api/predict
Content-Type: application/json

{
  "Age": 30,
  "MonthlyIncome": 5000,
  "YearsAtCompany": 5,
  "JobSatisfaction": 3,
  ...
}
```

#### Obtenir les métriques
```bash
GET /api/metrics
```

#### Obtenir l'importance des features
```bash
GET /api/feature-importance
```

### Résultat
```json
{
  "prediction": 0,
  "probability": 0.23,
  "riskLevel": "Low",
  "model": "XGBoost"
}
```

---

## 2. Modèle de Segmentation (K-Means Clustering)

### Description
Utilise l'algorithme K-Means pour segmenter les employés en groupes basés sur leurs caractéristiques et comportements.

### Fonctionnalités
- Détection automatique du nombre optimal de clusters (Silhouette Score)
- Profils détaillés pour chaque segment
- Analyse des caractéristiques moyennes par cluster
- Taux d'attrition par segment

### Endpoints API

#### Entraîner le modèle de clustering
```bash
POST /api/segment
```

#### Prédire le segment d'un employé
```bash
POST /api/segment/predict
Content-Type: application/json

{
  "Age": 30,
  "MonthlyIncome": 5000,
  ...
}
```

#### Obtenir tous les profils de clusters
```bash
GET /api/clusters
```

### Résultat
```json
{
  "clusterId": 2,
  "clusterLabel": "High Risk",
  "clusterDescription": "Employees with high attrition risk",
  "clusterProfile": {
    "size": 245,
    "percentage": 16.5,
    "characteristics": {
      "avgAge": 32.5,
      "avgIncome": 4500,
      "avgYearsAtCompany": 3.2,
      "attritionRate": 28.5
    }
  }
}
```

### Types de segments identifiés
- **High Risk** - Employés à haut risque d'attrition
- **Low Satisfaction** - Employés avec faible satisfaction
- **New Employees** - Employés récemment embauchés
- **Veterans** - Employés de longue date
- **Segment Standard** - Autres segments

---

## 3. Système de Recommandation

### Description
Génère des recommandations RH personnalisées en combinant :
- Le risque d'attrition prédit
- Le segment de l'employé
- Les caractéristiques individuelles
- L'importance des features

### Endpoints API

#### Obtenir des recommandations
```bash
POST /api/recommend
Content-Type: application/json

{
  "Age": 30,
  "MonthlyIncome": 5000,
  "JobSatisfaction": 2,
  "WorkLifeBalance": 2,
  ...
}
```

### Résultat
```json
{
  "attritionRisk": {
    "prediction": 1,
    "probability": 0.75,
    "level": "High"
  },
  "segment": {
    "clusterId": 2,
    "label": "High Risk",
    "profile": {...}
  },
  "recommendations": [
    {
      "category": "Retention",
      "priority": "High",
      "title": "Immediate Retention Action Required",
      "description": "This employee has a very high risk of leaving...",
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
      "content": ["JobSatisfaction: 2", "WorkLifeBalance: 2"]
    }
  ]
}
```

### Catégories de recommandations
- **Retention** - Actions pour retenir l'employé
- **Engagement** - Améliorer l'engagement
- **Well-being** - Équilibre vie pro/perso
- **Development** - Développement de carrière
- **Onboarding** - Support pour nouveaux employés
- **Segment** - Stratégies spécifiques au segment

### Niveaux de priorité
- **High** - Action immédiate requise
- **Medium** - Action préventive recommandée
- **Low** - Amélioration continue

---

## Workflow complet

### 1. Entraînement initial
```bash
# 1. Entraîner le modèle de prédiction
POST /api/train

# 2. Entraîner le modèle de segmentation
POST /api/segment
```

### 2. Utilisation
```bash
# Option A : Prédiction simple
POST /api/predict

# Option B : Segmentation
POST /api/segment/predict

# Option C : Recommandations complètes (utilise les 2 modèles)
POST /api/recommend
```

---

## Interface utilisateur

### Pages disponibles

1. **Dashboard** (`/`) - Vue d'ensemble et métriques
2. **Prediction** (`/predict`) - Prédiction d'attrition
3. **Segmentation** (`/segmentation`) - Analyse des segments
4. **Recommendations** (`/recommendations`) - Recommandations RH
5. **Model Info** (`/model-info`) - Informations sur les modèles

---

## Fichiers générés

### Modèle de Prédiction
- `backend/models/best_model.pkl` - Meilleur modèle sélectionné
- `backend/models/scaler.pkl` - Scaler pour normalisation
- `backend/models/label_encoders.pkl` - Encodeurs pour variables catégorielles
- `backend/models/feature_names.pkl` - Noms des features
- `backend/models/model_metadata.pkl` - Métadonnées du modèle
- `backend/models/metrics.json` - Métriques de performance
- `backend/models/feature_importance.json` - Importance des features

### Modèle de Segmentation
- `backend/models/clustering_model.pkl` - Modèle K-Means
- `backend/models/clustering_scaler.pkl` - Scaler pour clustering
- `backend/models/clustering_encoders.pkl` - Encodeurs pour clustering
- `backend/models/clustering_features.pkl` - Features utilisées
- `backend/models/cluster_profiles.json` - Profils des clusters

---

## Métriques de performance

### Modèle de Prédiction
- **Accuracy** - Précision globale
- **Precision** - Précision des prédictions positives
- **Recall** - Taux de détection des cas positifs
- **F1-Score** - Moyenne harmonique de Precision et Recall
- **ROC-AUC** - Aire sous la courbe ROC

### Modèle de Segmentation
- **Silhouette Score** - Qualité de la séparation des clusters (0-1, plus élevé = meilleur)
- **Davies-Bouldin Score** - Compacité des clusters (plus bas = meilleur)
- **Inertia** - Somme des distances intra-cluster

---

## Dépendances Python

```txt
pandas==2.1.4
numpy==1.26.2
scikit-learn==1.3.2
xgboost==2.0.3
joblib==1.3.2
```

---

## Installation et démarrage

### Backend
```bash
cd backend
npm install
pip install -r ml/requirements.txt
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Exemples d'utilisation

### Exemple 1 : Analyse complète d'un employé
```javascript
// 1. Obtenir les recommandations
const response = await fetch('http://localhost:5000/api/recommend', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    Age: 35,
    MonthlyIncome: 6000,
    YearsAtCompany: 8,
    JobSatisfaction: 2,
    WorkLifeBalance: 2,
    YearsSinceLastPromotion: 4,
    OverTime: 'Yes',
    Department: 'Sales',
    JobRole: 'Sales Executive'
  })
});

const data = await response.json();
console.log('Risque:', data.attritionRisk.level);
console.log('Segment:', data.segment.label);
console.log('Recommandations:', data.recommendations);
```

### Exemple 2 : Analyse de tous les segments
```javascript
const response = await fetch('http://localhost:5000/api/clusters');
const data = await response.json();

data.clusters.forEach(cluster => {
  console.log(`${cluster.label}: ${cluster.percentage}% des employés`);
  console.log(`Taux d'attrition: ${cluster.characteristics.attritionRate}%`);
});
```

---

## Notes importantes

1. **Ordre d'entraînement** : Entraînez d'abord le modèle de prédiction, puis le modèle de segmentation
2. **Données requises** : Le fichier CSV doit être présent dans `backend/data/`
3. **Modèles pré-requis** : Le système de recommandation nécessite les deux modèles entraînés
4. **Performance** : L'entraînement peut prendre quelques minutes selon la taille des données

---

## Support et maintenance

Pour toute question ou problème :
1. Vérifiez que tous les modèles sont entraînés
2. Consultez les logs du serveur backend
3. Vérifiez que les dépendances Python sont installées
4. Assurez-vous que le dataset est présent

---

**Version** : 2.0.0  
**Dernière mise à jour** : 2026
