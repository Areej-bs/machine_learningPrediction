## 3. MODÈLES MACHINE LEARNING

### 3.1 Modèle 1: Prédiction d'Attrition

#### 3.1.1 Description
Le modèle de prédiction d'attrition est un système de classification binaire qui prédit si un employé va quitter l'entreprise (Attrition = 1) ou rester (Attrition = 0).

#### 3.1.2 Algorithmes Implémentés

**1. Logistic Regression**
- Type: Modèle linéaire
- Hyperparamètres: max_iter=1000
- Avantages: Simple, interprétable, rapide
- Utilisation: Baseline model

**2. Decision Tree**
- Type: Arbre de décision
- Hyperparamètres: max_depth=10, random_state=42
- Avantages: Non-linéaire, interprétable
- Utilisation: Modèle de référence

**3. Random Forest**
- Type: Ensemble (Bagging)
- Hyperparamètres: n_estimators=100, max_depth=10
- Avantages: Robuste, gère bien les features
- Utilisation: Modèle performant

**4. Gradient Boosting**
- Type: Ensemble (Boosting)
- Hyperparamètres: n_estimators=100, max_depth=5
- Avantages: Très performant, séquentiel
- Utilisation: Modèle avancé

**5. XGBoost** ⭐ (Meilleur Modèle)
- Type: Gradient Boosting optimisé
- Hyperparamètres:
  - n_estimators=300
  - learning_rate=0.05
  - max_depth=4
  - min_child_weight=2
  - subsample=0.8
  - colsample_bytree=0.8
  - gamma=0.1
  - reg_alpha=0.1
  - reg_lambda=1.0
  - scale_pos_weight=auto (gestion déséquilibre)
- Avantages: Meilleure performance, régularisation
- Utilisation: Modèle de production

#### 3.1.3 Features Utilisées (25 features)

**Features Numériques (18):**
1. Age - Âge de l'employé
2. MonthlyIncome - Salaire mensuel
3. YearsAtCompany - Années dans l'entreprise
4. JobSatisfaction - Satisfaction au travail (1-4)
5. EnvironmentSatisfaction - Satisfaction environnement (1-4)
6. WorkLifeBalance - Équilibre vie pro/perso (1-4)
7. JobInvolvement - Implication au travail (1-4)
8. YearsInCurrentRole - Années dans le rôle actuel
9. YearsSinceLastPromotion - Années depuis dernière promotion
10. YearsWithCurrManager - Années avec manager actuel
11. NumCompaniesWorked - Nombre d'entreprises précédentes
12. TotalWorkingYears - Années d'expérience totale
13. TrainingTimesLastYear - Formations suivies l'année dernière
14. PercentSalaryHike - Pourcentage d'augmentation
15. StockOptionLevel - Niveau d'options d'achat (0-3)
16. DistanceFromHome - Distance domicile-travail (km)
17. JobLevel - Niveau hiérarchique (1-5)
18. RelationshipSatisfaction - Satisfaction relationnelle (1-4)

**Features Catégorielles (7):**
1. BusinessTravel - Fréquence de déplacement
2. Department - Département
3. EducationField - Domaine d'études
4. Gender - Genre
5. JobRole - Poste
6. MaritalStatus - Statut marital
7. OverTime - Heures supplémentaires (Yes/No)

#### 3.1.4 Preprocessing Pipeline

```python
# 1. Chargement des données
df = pd.read_csv('WA_Fn-UseC_-HR-Employee-Attrition.csv')

# 2. Encodage de la cible
df['Attrition'] = (df['Attrition'] == 'Yes').astype(int)

# 3. Encodage des variables catégorielles
label_encoders = {}
for col in categorical_features:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# 4. Séparation train/test (80/20, stratifié)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 5. Standardisation (pour modèles linéaires)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
```

#### 3.1.5 Métriques de Performance

| Modèle | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
|--------|----------|-----------|--------|----------|---------|
| Logistic Regression | 0.789 | 0.579 | 0.308 | 0.400 | 0.746 |
| Decision Tree | 0.782 | 0.520 | 0.462 | 0.489 | 0.701 |
| Random Forest | 0.861 | 0.680 | 0.462 | 0.550 | 0.819 |
| Gradient Boosting | 0.871 | 0.711 | 0.462 | 0.560 | 0.830 |
| **XGBoost** | **0.867** | **0.684** | **0.462** | **0.552** | **0.823** |

**Sélection du Meilleur Modèle:**
- Critère: F1-Score (équilibre Precision/Recall)
- Gagnant: **Gradient Boosting** ou **XGBoost**
- Justification: Meilleur compromis pour classe minoritaire

#### 3.1.6 Feature Importance

Top 10 features les plus importantes (XGBoost):

1. **OverTime** (0.152) - Heures supplémentaires
2. **MonthlyIncome** (0.123) - Salaire mensuel
3. **YearsAtCompany** (0.099) - Ancienneté
4. **Age** (0.087) - Âge
5. **TotalWorkingYears** (0.076) - Expérience totale
6. **JobSatisfaction** (0.068) - Satisfaction travail
7. **YearsInCurrentRole** (0.061) - Années dans rôle
8. **WorkLifeBalance** (0.054) - Équilibre vie
9. **EnvironmentSatisfaction** (0.049) - Satisfaction environnement
10. **YearsSinceLastPromotion** (0.042) - Années sans promotion

**Insights:**
- Les heures supplémentaires sont le facteur #1 d'attrition
- Le salaire et l'ancienneté sont critiques
- La satisfaction au travail joue un rôle majeur

---

### 3.2 Modèle 2: Segmentation des Employés

#### 3.2.1 Description
Le modèle de segmentation utilise **K-Means Clustering** pour grouper les employés en segments homogènes basés sur leurs caractéristiques.

#### 3.2.2 Algorithme: K-Means

**Principe:**
- Clustering non-supervisé
- Regroupe les points similaires
- Minimise la variance intra-cluster
- Maximise la variance inter-cluster

**Hyperparamètres:**
- n_clusters: Déterminé automatiquement (2-10)
- random_state: 42
- n_init: 10
- Méthode: Elbow + Silhouette Score

#### 3.2.3 Détermination du Nombre Optimal de Clusters

```python
# Méthode du coude (Elbow Method)
for k in range(2, 11):
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(X_scaled)
    inertias.append(kmeans.inertia_)
    silhouette_scores.append(silhouette_score(X_scaled, kmeans.labels_))

# Sélection: k avec meilleur Silhouette Score
optimal_k = k_values[np.argmax(silhouette_scores)]
```

**Métriques de Qualité:**
- **Silhouette Score**: 0 à 1 (plus élevé = meilleur)
- **Davies-Bouldin Score**: Plus bas = meilleur
- **Inertia**: Variance intra-cluster

#### 3.2.4 Profils de Segments Typiques

**Segment 1: High Risk (Haut Risque)**
- Taux d'attrition: >25%
- Caractéristiques:
  - Satisfaction faible (< 2.5)
  - Heures supplémentaires fréquentes
  - Salaire en dessous de la moyenne
  - Peu de promotions récentes

**Segment 2: New Employees (Nouveaux)**
- Taux d'attrition: 15-20%
- Caractéristiques:
  - Ancienneté < 3 ans
  - Âge moyen: 25-35 ans
  - En phase d'adaptation
  - Besoin de support

**Segment 3: Veterans (Vétérans)**
- Taux d'attrition: <10%
- Caractéristiques:
  - Ancienneté > 10 ans
  - Âge moyen: 45+ ans
  - Satisfaction élevée
  - Stabilité

**Segment 4: Low Satisfaction (Insatisfaits)**
- Taux d'attrition: 20-25%
- Caractéristiques:
  - JobSatisfaction < 2.5
  - WorkLifeBalance faible
  - Environnement insatisfaisant
  - Risque modéré

#### 3.2.5 Utilisation des Segments

**Applications:**
1. **Stratégies RH ciblées** par segment
2. **Allocation de ressources** optimisée
3. **Prévention proactive** pour segments à risque
4. **Benchmarking** entre segments
5. **Personnalisation** des interventions
