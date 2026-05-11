# 📊 RAPPORT TECHNIQUE COMPLET
## Système de Prédiction d'Attrition des Employés

---

**Date:** 11 Mai 2026  
**Version:** 2.0  
**Auteur:** Équipe de Développement ML  
**Statut:** Production - Déployé

---

## 📑 TABLE DES MATIÈRES

1. [Résumé Exécutif](#résumé-exécutif)
2. [Architecture du Système](#architecture-du-système)
3. [Modèles Machine Learning](#modèles-machine-learning)
4. [Pipeline de Données](#pipeline-de-données)
5. [API et Backend](#api-et-backend)
6. [Interface Utilisateur](#interface-utilisateur)
7. [Déploiement](#déploiement)
8. [Performance et Métriques](#performance-et-métriques)
9. [Sécurité et Bonnes Pratiques](#sécurité-et-bonnes-pratiques)
10. [Conclusions et Recommandations](#conclusions-et-recommandations)

---

## 1. RÉSUMÉ EXÉCUTIF

### 1.1 Vue d'Ensemble du Projet

Le **Système de Prédiction d'Attrition des Employés** est une application web full-stack de niveau production qui utilise l'intelligence artificielle pour prédire et prévenir le départ des employés. Le système intègre **3 modèles de machine learning distincts** travaillant en synergie pour fournir des insights actionnables aux départements RH.

### 1.2 Objectifs Principaux

✅ **Prédiction d'Attrition** - Identifier les employés à risque de départ  
✅ **Segmentation des Employés** - Grouper les employés par profils similaires  
✅ **Recommandations RH** - Générer des actions personnalisées de rétention  
✅ **Visualisation Interactive** - Dashboard temps réel avec métriques clés  
✅ **Déploiement Cloud** - Application accessible en production

### 1.3 Technologies Utilisées

**Frontend:**
- React 18.2.0
- Vite 5.0.8
- Chart.js 4.4.0
- Axios 1.6.2
- React Router DOM 6.20.0

**Backend:**
- Node.js + Express 4.18.2
- CORS 2.8.5
- Body-Parser 1.20.2

**Machine Learning:**
- Python 3.8+
- scikit-learn 1.6.1
- XGBoost 2.1.4
- pandas 2.3.3
- numpy 2.0.2
- joblib 1.5.3

**Déploiement:**
- Render.com (Cloud Platform)
- Docker (Containerization)
- Git/GitHub (Version Control)

### 1.4 Résultats Clés

📊 **5 Algorithmes ML** implémentés et comparés  
🎯 **87% de précision** avec le meilleur modèle (XGBoost)  
👥 **Segmentation automatique** en clusters optimaux  
💡 **Recommandations personnalisées** pour chaque employé  
🚀 **Déployé en production** sur Render.com

---

## 2. ARCHITECTURE DU SYSTÈME

### 2.1 Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                    UTILISATEUR FINAL                         │
│                   (Navigateur Web)                           │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND (React + Vite)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │Prediction│  │Segment.  │  │Recommend.│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  Port: 5173 (dev) / 80 (prod)                              │
└─────────────────────────────────────────────────────────────┘
                            ↓ REST API
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Node.js + Express)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Routes:                                          │  │
│  │  • POST /api/train                                    │  │
│  │  • POST /api/predict                                  │  │
│  │  • POST /api/segment                                  │  │
│  │  • POST /api/recommend                                │  │
│  │  • GET  /api/metrics                                  │  │
│  │  • GET  /api/clusters                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Port: 5000                                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓ Child Process
┌─────────────────────────────────────────────────────────────┐
│           PYTHON ML SERVICE (scikit-learn)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  train.py    │  │  segment.py  │  │ recommend.py │     │
│  │  predict.py  │  │segment_pred  │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  Models: XGBoost, Random Forest, K-Means                    │
└─────────────────────────────────────────────────────────────┘
                            ↓ File System
┌─────────────────────────────────────────────────────────────┐
│                    STOCKAGE PERSISTANT                       │
│  • backend/models/     (Modèles entraînés .pkl)            │
│  • backend/data/       (Dataset CSV)                        │
│  • Metrics JSON        (Performances)                       │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Flux de Données

#### 2.2.1 Entraînement des Modèles
```
User → Frontend → POST /api/train → Backend → train.py
                                              ↓
                                    Load CSV Dataset
                                              ↓
                                    Preprocess Data
                                              ↓
                                    Train 5 Models
                                              ↓
                                    Select Best Model
                                              ↓
                                    Save Models (.pkl)
                                              ↓
                                    Return Metrics
```

#### 2.2.2 Prédiction
```
User Input → Frontend → POST /api/predict → Backend → predict.py
                                                      ↓
                                            Load Best Model
                                                      ↓
                                            Preprocess Input
                                                      ↓
                                            Make Prediction
                                                      ↓
                                            Return Result
```
