@echo off
echo Verification avant deploiement sur Render...
echo.

set ERRORS=0
set WARNINGS=0

echo === Fichiers Backend ===
if exist "backend\server.js" (echo [OK] backend\server.js existe) else (echo [ERREUR] backend\server.js manquant & set /a ERRORS+=1)
if exist "backend\package.json" (echo [OK] backend\package.json existe) else (echo [ERREUR] backend\package.json manquant & set /a ERRORS+=1)
if exist "backend\data\WA_Fn-UseC_-HR-Employee-Attrition.csv" (echo [OK] Dataset existe) else (echo [ERREUR] Dataset manquant & set /a ERRORS+=1)

echo.
echo === Scripts ML ===
if exist "backend\ml\train.py" (echo [OK] train.py existe) else (echo [ERREUR] train.py manquant & set /a ERRORS+=1)
if exist "backend\ml\predict.py" (echo [OK] predict.py existe) else (echo [ERREUR] predict.py manquant & set /a ERRORS+=1)
if exist "backend\ml\segment.py" (echo [OK] segment.py existe) else (echo [ERREUR] segment.py manquant & set /a ERRORS+=1)
if exist "backend\ml\segment_predict.py" (echo [OK] segment_predict.py existe) else (echo [ERREUR] segment_predict.py manquant & set /a ERRORS+=1)
if exist "backend\ml\recommend.py" (echo [OK] recommend.py existe) else (echo [ERREUR] recommend.py manquant & set /a ERRORS+=1)
if exist "backend\ml\requirements.txt" (echo [OK] requirements.txt existe) else (echo [ERREUR] requirements.txt manquant & set /a ERRORS+=1)

echo.
echo === Fichiers Frontend ===
if exist "frontend\package.json" (echo [OK] frontend\package.json existe) else (echo [ERREUR] frontend\package.json manquant & set /a ERRORS+=1)
if exist "frontend\.env.production" (echo [OK] .env.production existe) else (echo [ERREUR] .env.production manquant & set /a ERRORS+=1)
if exist "frontend\src\pages\Segmentation.jsx" (echo [OK] Segmentation.jsx existe) else (echo [ERREUR] Segmentation.jsx manquant & set /a ERRORS+=1)
if exist "frontend\src\pages\Recommendations.jsx" (echo [OK] Recommendations.jsx existe) else (echo [ERREUR] Recommendations.jsx manquant & set /a ERRORS+=1)

echo.
echo === Configuration Deploiement ===
if exist "render.yaml" (echo [OK] render.yaml existe) else (echo [ERREUR] render.yaml manquant & set /a ERRORS+=1)
if exist "package.json" (echo [OK] package.json existe) else (echo [ERREUR] package.json manquant & set /a ERRORS+=1)

echo.
echo === Verification URL Production ===
findstr /C:"machine-learningprediction-2.onrender.com" frontend\.env.production >nul
if %errorlevel%==0 (
    echo [OK] URL production correcte
) else (
    echo [ERREUR] URL production incorrecte
    set /a ERRORS+=1
)

echo.
echo === Verification Git ===
if exist ".git" (
    echo [OK] Depot Git initialise
    git status --short >nul 2>&1
    if %errorlevel%==0 (
        echo [ATTENTION] Verifiez les fichiers non commites avec: git status
        set /a WARNINGS+=1
    )
) else (
    echo [ERREUR] Depot Git non initialise
    set /a ERRORS+=1
)

echo.
echo === Resume ===
if %ERRORS%==0 (
    if %WARNINGS%==0 (
        echo [OK] Tout est pret pour le deploiement !
        echo.
        echo Prochaines etapes :
        echo 1. git add .
        echo 2. git commit -m "Update for Render deployment"
        echo 3. git push origin main
        echo 4. Render va automatiquement redeployer
    ) else (
        echo [ATTENTION] %WARNINGS% avertissement(s) detecte(s)
        echo Vous pouvez deployer, mais verifiez les avertissements ci-dessus
    )
) else (
    echo [ERREUR] %ERRORS% erreur(s) detectee(s)
    echo Corrigez les erreurs avant de deployer
    exit /b 1
)

pause
