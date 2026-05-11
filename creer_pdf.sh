#!/bin/bash

echo "========================================"
echo "Création du Rapport PDF"
echo "========================================"
echo ""

# Vérifier si Pandoc est installé
if ! command -v pandoc &> /dev/null; then
    echo "[ERREUR] Pandoc n'est pas installé !"
    echo ""
    echo "Installez Pandoc avec:"
    echo "  Mac: brew install pandoc"
    echo "  Linux: sudo apt-get install pandoc"
    echo ""
    echo "Ou téléchargez depuis: https://pandoc.org/installing.html"
    exit 1
fi

echo "[OK] Pandoc est installé"
echo ""

echo "Création du PDF en cours..."
echo ""

# Créer le PDF
pandoc RAPPORT_ML_PARTIE_1.md RAPPORT_ML_PARTIE_2.md RAPPORT_ML_PARTIE_3.md RAPPORT_ML_PARTIE_4.md RAPPORT_ML_PARTIE_5.md RAPPORT_ML_PARTIE_6.md \
    -o RAPPORT_MACHINE_LEARNING_COMPLET.pdf \
    --toc \
    --toc-depth=3 \
    --number-sections \
    --pdf-engine=xelatex \
    -V geometry:margin=1in \
    -V fontsize=11pt \
    -V documentclass=report \
    -V title="Système de Prédiction d'Attrition des Employés" \
    -V subtitle="Rapport Technique Complet" \
    -V author="Équipe de Développement ML" \
    -V date="11 Mai 2026"

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "[SUCCÈS] PDF créé avec succès !"
    echo "========================================"
    echo ""
    echo "Fichier: RAPPORT_MACHINE_LEARNING_COMPLET.pdf"
    echo ""
    
    # Ouvrir le PDF (selon l'OS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # Mac
        open RAPPORT_MACHINE_LEARNING_COMPLET.pdf
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        xdg-open RAPPORT_MACHINE_LEARNING_COMPLET.pdf
    fi
else
    echo ""
    echo "========================================"
    echo "[ERREUR] Échec de la création du PDF"
    echo "========================================"
    echo ""
    echo "Vérifiez que tous les fichiers RAPPORT_ML_PARTIE_*.md existent"
    exit 1
fi

echo ""
