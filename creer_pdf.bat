@echo off
echo ========================================
echo Creation du Rapport PDF
echo ========================================
echo.

REM Verifier si Pandoc est installe
where pandoc >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERREUR] Pandoc n'est pas installe !
    echo.
    echo Installez Pandoc avec:
    echo   choco install pandoc
    echo.
    echo Ou telechargez depuis: https://pandoc.org/installing.html
    pause
    exit /b 1
)

echo [OK] Pandoc est installe
echo.

echo Creation du PDF en cours...
echo.

REM Creer le PDF
pandoc RAPPORT_ML_PARTIE_1.md RAPPORT_ML_PARTIE_2.md RAPPORT_ML_PARTIE_3.md RAPPORT_ML_PARTIE_4.md RAPPORT_ML_PARTIE_5.md RAPPORT_ML_PARTIE_6.md -o RAPPORT_MACHINE_LEARNING_COMPLET.pdf --toc --toc-depth=3 --number-sections --pdf-engine=xelatex -V geometry:margin=1in -V fontsize=11pt -V documentclass=report -V title="Systeme de Prediction d'Attrition des Employes" -V subtitle="Rapport Technique Complet" -V author="Equipe de Developpement ML" -V date="11 Mai 2026"

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo [SUCCES] PDF cree avec succes !
    echo ========================================
    echo.
    echo Fichier: RAPPORT_MACHINE_LEARNING_COMPLET.pdf
    echo.
    echo Ouverture du PDF...
    start RAPPORT_MACHINE_LEARNING_COMPLET.pdf
) else (
    echo.
    echo ========================================
    echo [ERREUR] Echec de la creation du PDF
    echo ========================================
    echo.
    echo Verifiez que tous les fichiers RAPPORT_ML_PARTIE_*.md existent
)

echo.
pause
