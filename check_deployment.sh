#!/bin/bash

echo "🔍 Vérification avant déploiement sur Render..."
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteur
ERRORS=0
WARNINGS=0

# Fonction de vérification
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 existe"
    else
        echo -e "${RED}✗${NC} $1 manquant"
        ((ERRORS++))
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} Dossier $1 existe"
    else
        echo -e "${RED}✗${NC} Dossier $1 manquant"
        ((ERRORS++))
    fi
}

echo "=== Fichiers Backend ==="
check_file "backend/server.js"
check_file "backend/package.json"
check_file "backend/data/WA_Fn-UseC_-HR-Employee-Attrition.csv"

echo ""
echo "=== Scripts ML ==="
check_file "backend/ml/train.py"
check_file "backend/ml/predict.py"
check_file "backend/ml/segment.py"
check_file "backend/ml/segment_predict.py"
check_file "backend/ml/recommend.py"
check_file "backend/ml/requirements.txt"

echo ""
echo "=== Fichiers Frontend ==="
check_file "frontend/package.json"
check_file "frontend/vite.config.js"
check_file "frontend/.env.production"
check_file "frontend/src/App.jsx"
check_file "frontend/src/pages/Dashboard.jsx"
check_file "frontend/src/pages/Prediction.jsx"
check_file "frontend/src/pages/Segmentation.jsx"
check_file "frontend/src/pages/Recommendations.jsx"
check_file "frontend/src/services/api.js"

echo ""
echo "=== Configuration Déploiement ==="
check_file "render.yaml"
check_file "package.json"

echo ""
echo "=== Vérification URL Production ==="
if grep -q "machine-learningprediction-2.onrender.com" frontend/.env.production; then
    echo -e "${GREEN}✓${NC} URL production correcte (machine-learningprediction-2)"
else
    echo -e "${RED}✗${NC} URL production incorrecte dans frontend/.env.production"
    ((ERRORS++))
fi

echo ""
echo "=== Vérification Git ==="
if [ -d ".git" ]; then
    echo -e "${GREEN}✓${NC} Dépôt Git initialisé"
    
    # Vérifier les fichiers non commités
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}⚠${NC} Fichiers non commités détectés:"
        git status --short
        ((WARNINGS++))
    else
        echo -e "${GREEN}✓${NC} Tous les fichiers sont commités"
    fi
else
    echo -e "${RED}✗${NC} Dépôt Git non initialisé"
    ((ERRORS++))
fi

echo ""
echo "=== Résumé ==="
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ Tout est prêt pour le déploiement !${NC}"
    echo ""
    echo "Prochaines étapes :"
    echo "1. git add ."
    echo "2. git commit -m 'Update for Render deployment'"
    echo "3. git push origin main"
    echo "4. Render va automatiquement redéployer"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS avertissement(s) détecté(s)${NC}"
    echo "Vous pouvez déployer, mais vérifiez les avertissements ci-dessus"
else
    echo -e "${RED}✗ $ERRORS erreur(s) détectée(s)${NC}"
    echo "Corrigez les erreurs avant de déployer"
    exit 1
fi
