@echo off
REM Script de test pour les nouveaux modèles ML (Windows)

echo ==========================================
echo Test des Nouveaux Modeles ML
echo ==========================================
echo.

set API_URL=http://localhost:5000/api

echo Test 1: Health Check
curl -s %API_URL%/health
echo.
echo.

echo Test 2: Training Clustering Model
echo This may take a few minutes...
curl -s -X POST %API_URL%/segment
echo.
echo.

echo Test 3: Get Cluster Profiles
curl -s %API_URL%/clusters
echo.
echo.

echo Test 4: Predict Employee Segment
curl -s -X POST %API_URL%/segment/predict -H "Content-Type: application/json" -d "{\"Age\":30,\"MonthlyIncome\":5000,\"YearsAtCompany\":5,\"JobSatisfaction\":3,\"EnvironmentSatisfaction\":3,\"WorkLifeBalance\":3,\"JobInvolvement\":3,\"YearsInCurrentRole\":3,\"YearsSinceLastPromotion\":1,\"YearsWithCurrManager\":3,\"NumCompaniesWorked\":2,\"TotalWorkingYears\":10,\"TrainingTimesLastYear\":2,\"PercentSalaryHike\":15,\"StockOptionLevel\":1,\"DistanceFromHome\":10,\"JobLevel\":2,\"RelationshipSatisfaction\":3,\"BusinessTravel\":\"Travel_Rarely\",\"Department\":\"Sales\",\"EducationField\":\"Life Sciences\",\"Gender\":\"Male\",\"JobRole\":\"Sales Executive\",\"MaritalStatus\":\"Single\",\"OverTime\":\"No\"}"
echo.
echo.

echo Test 5: Get Recommendations
curl -s -X POST %API_URL%/recommend -H "Content-Type: application/json" -d "{\"Age\":30,\"MonthlyIncome\":5000,\"YearsAtCompany\":5,\"JobSatisfaction\":3,\"EnvironmentSatisfaction\":3,\"WorkLifeBalance\":3,\"JobInvolvement\":3,\"YearsInCurrentRole\":3,\"YearsSinceLastPromotion\":1,\"YearsWithCurrManager\":3,\"NumCompaniesWorked\":2,\"TotalWorkingYears\":10,\"TrainingTimesLastYear\":2,\"PercentSalaryHike\":15,\"StockOptionLevel\":1,\"DistanceFromHome\":10,\"JobLevel\":2,\"RelationshipSatisfaction\":3,\"BusinessTravel\":\"Travel_Rarely\",\"Department\":\"Sales\",\"EducationField\":\"Life Sciences\",\"Gender\":\"Male\",\"JobRole\":\"Sales Executive\",\"MaritalStatus\":\"Single\",\"OverTime\":\"No\"}"
echo.
echo.

echo ==========================================
echo Tests Completed!
echo ==========================================
echo.
echo Next steps:
echo 1. Open http://localhost:5173 in your browser
echo 2. Navigate to 'Segmentation' page
echo 3. Navigate to 'Recommendations' page
echo 4. Test with different employee profiles
echo.

pause
