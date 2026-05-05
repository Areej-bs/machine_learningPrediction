# Guide de Démarrage Rapide - Nouveaux Modèles

## 🚀 Déploiement des Modèles de Segmentation et Recommandation

Vous avez déjà déployé le modèle de prédiction. Voici comment déployer les deux nouveaux modèles.

---

## Étape 1 : Vérifier l'installation

Assurez-vous que votre environnement est prêt :

```bash
# Vérifier que le backend fonctionne
cd backend
npm start

# Dans un autre terminal, vérifier le frontend
cd frontend
npm run dev
```

---

## Étape 2 : Entraîner le modèle de segmentation

### Via l'interface web

1. Ouvrez votre navigateur : `http://localhost:5173`
2. Cliquez sur **"Segmentation"** dans le menu
3. Cliquez sur **"Train Clustering Model"**
4. Attendez quelques secondes
5. Les segments d'employés s'afficheront automatiquement

### Via API (alternative)

```bash
curl -X POST http://localhost:5000/api/segment
```

### Résultat attendu

Vous verrez plusieurs segments d'employés, par exemple :
- **High Risk** - Employés à haut risque (taux d'attrition élevé)
- **New Employees** - Employés récemment embauchés
- **Veterans** - Employés de longue date
- **Low Satisfaction** - Employés avec faible satisfaction

---

## Étape 3 : Tester les recommandations

### Via l'interface web

1. Cliquez sur **"Recommendations"** dans le menu
2. Remplissez le formulaire avec les informations d'un employé
3. Cliquez sur **"Get Recommendations"**
4. Consultez :
   - Le niveau de risque d'attrition
   - Le segment de l'employé
   - Les recommandations RH personnalisées
   - Les insights détaillés

### Via API (alternative)

```bash
curl -X POST http://localhost:5000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "Age": 30,
    "MonthlyIncome": 5000,
    "YearsAtCompany": 5,
    "JobSatisfaction": 2,
    "EnvironmentSatisfaction": 3,
    "WorkLifeBalance": 2,
    "JobInvolvement": 3,
    "YearsInCurrentRole": 3,
    "YearsSinceLastPromotion": 3,
    "YearsWithCurrManager": 3,
    "NumCompaniesWorked": 2,
    "TotalWorkingYears": 10,
    "TrainingTimesLastYear": 1,
    "PercentSalaryHike": 15,
    "StockOptionLevel": 1,
    "DistanceFromHome": 10,
    "JobLevel": 2,
    "RelationshipSatisfaction": 3,
    "BusinessTravel": "Travel_Rarely",
    "Department": "Sales",
    "EducationField": "Life Sciences",
    "Gender": "Male",
    "JobRole": "Sales Executive",
    "MaritalStatus": "Single",
    "OverTime": "Yes"
  }'
```

---

## Étape 4 : Vérifier que tout fonctionne

### Checklist

- [ ] Le modèle de prédiction est entraîné (`/api/train`)
- [ ] Le modèle de segmentation est entraîné (`/api/segment`)
- [ ] Les segments s'affichent dans la page Segmentation
- [ ] Les recommandations fonctionnent dans la page Recommendations
- [ ] Tous les endpoints API répondent correctement

### Tester tous les endpoints

```bash
# 1. Health check
curl http://localhost:5000/api/health

# 2. Métriques du modèle de prédiction
curl http://localhost:5000/api/metrics

# 3. Profils des clusters
curl http://localhost:5000/api/clusters

# 4. Prédiction simple
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"Age": 30, "MonthlyIncome": 5000, ...}'

# 5. Prédiction de segment
curl -X POST http://localhost:5000/api/segment/predict \
  -H "Content-Type: application/json" \
  -d '{"Age": 30, "MonthlyIncome": 5000, ...}'

# 6. Recommandations
curl -X POST http://localhost:5000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"Age": 30, "MonthlyIncome": 5000, ...}'
```

---

## Cas d'usage pratiques

### Cas 1 : Employé à haut risque

**Profil** :
- Faible satisfaction au travail (1-2)
- Mauvais équilibre vie pro/perso (1-2)
- Pas de promotion depuis longtemps (>3 ans)
- Heures supplémentaires fréquentes

**Recommandations attendues** :
- Actions de rétention immédiates
- Amélioration de l'équilibre vie pro/perso
- Opportunités de développement de carrière

### Cas 2 : Nouvel employé

**Profil** :
- Moins de 2 ans dans l'entreprise
- Jeune âge (20-30 ans)
- Peu d'expérience totale

**Recommandations attendues** :
- Support d'onboarding
- Programme de mentorat
- Intégration dans l'équipe

### Cas 3 : Employé vétéran

**Profil** :
- Plus de 10 ans dans l'entreprise
- Âge élevé (45+)
- Satisfaction élevée

**Recommandations attendues** :
- Reconnaissance de l'ancienneté
- Opportunités de mentorat
- Maintien de l'engagement

---

## Structure des fichiers générés

Après l'entraînement, vous trouverez dans `backend/models/` :

### Modèle de Prédiction
```
backend/models/
├── best_model.pkl              # Meilleur modèle ML
├── scaler.pkl                  # Normalisation des données
├── label_encoders.pkl          # Encodage des variables catégorielles
├── feature_names.pkl           # Liste des features
├── model_metadata.pkl          # Métadonnées
├── metrics.json                # Performances du modèle
└── feature_importance.json     # Importance des variables
```

### Modèle de Segmentation
```
backend/models/
├── clustering_model.pkl        # Modèle K-Means
├── clustering_scaler.pkl       # Normalisation pour clustering
├── clustering_encoders.pkl     # Encodeurs pour clustering
├── clustering_features.pkl     # Features utilisées
└── cluster_profiles.json       # Profils détaillés des segments
```

---

## Dépannage

### Problème : "Model not found"

**Solution** : Entraînez d'abord les modèles
```bash
# Entraîner le modèle de prédiction
curl -X POST http://localhost:5000/api/train

# Entraîner le modèle de segmentation
curl -X POST http://localhost:5000/api/segment
```

### Problème : "Dataset not found"

**Solution** : Vérifiez que le fichier CSV est présent
```bash
ls backend/data/WA_Fn-UseC_-HR-Employee-Attrition.csv
```

### Problème : Erreur Python

**Solution** : Vérifiez les dépendances
```bash
cd backend
pip install -r ml/requirements.txt
```

### Problème : Port déjà utilisé

**Solution** : Changez le port dans le fichier `.env`
```bash
# backend/.env
PORT=5001

# frontend/.env
VITE_API_URL=http://localhost:5001/api
```

---

## Prochaines étapes

1. **Explorez les segments** : Analysez les différents groupes d'employés
2. **Testez différents profils** : Essayez diverses combinaisons de caractéristiques
3. **Analysez les recommandations** : Comprenez les actions suggérées
4. **Intégrez dans votre workflow RH** : Utilisez les API dans vos outils existants

---

## API Endpoints - Résumé

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/train` | POST | Entraîner le modèle de prédiction |
| `/api/predict` | POST | Prédire l'attrition d'un employé |
| `/api/metrics` | GET | Obtenir les métriques du modèle |
| `/api/feature-importance` | GET | Importance des features |
| `/api/segment` | POST | Entraîner le modèle de segmentation |
| `/api/segment/predict` | POST | Prédire le segment d'un employé |
| `/api/clusters` | GET | Obtenir tous les profils de clusters |
| `/api/recommend` | POST | Obtenir des recommandations RH |
| `/api/health` | GET | Vérifier l'état du serveur |

---

## Support

Pour plus d'informations, consultez :
- `ML_MODELS_DOCUMENTATION.md` - Documentation complète
- `API_DOCUMENTATION.md` - Documentation API détaillée
- `README.md` - Guide général du projet

---

**Bon déploiement ! 🎉**
