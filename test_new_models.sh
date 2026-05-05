#!/bin/bash

# Script de test pour les nouveaux modèles ML
# Ce script teste tous les endpoints des modèles de segmentation et recommandation

echo "=========================================="
echo "Test des Nouveaux Modèles ML"
echo "=========================================="
echo ""

API_URL="http://localhost:5000/api"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
    fi
}

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/health)
if [ $response -eq 200 ]; then
    print_result 0 "Server is running"
else
    print_result 1 "Server is not responding"
    exit 1
fi
echo ""

# Test 2: Entraîner le modèle de segmentation
echo -e "${YELLOW}Test 2: Training Clustering Model${NC}"
echo "This may take a few minutes..."
response=$(curl -s -X POST $API_URL/segment)
if echo "$response" | grep -q "success"; then
    print_result 0 "Clustering model trained successfully"
    echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
else
    print_result 1 "Failed to train clustering model"
    echo "$response"
fi
echo ""

# Test 3: Obtenir les profils de clusters
echo -e "${YELLOW}Test 3: Get Cluster Profiles${NC}"
response=$(curl -s $API_URL/clusters)
if echo "$response" | grep -q "clusters"; then
    print_result 0 "Cluster profiles retrieved"
    echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
else
    print_result 1 "Failed to get cluster profiles"
    echo "$response"
fi
echo ""

# Test 4: Prédire le segment d'un employé
echo -e "${YELLOW}Test 4: Predict Employee Segment${NC}"
employee_data='{
  "Age": 30,
  "MonthlyIncome": 5000,
  "YearsAtCompany": 5,
  "JobSatisfaction": 3,
  "EnvironmentSatisfaction": 3,
  "WorkLifeBalance": 3,
  "JobInvolvement": 3,
  "YearsInCurrentRole": 3,
  "YearsSinceLastPromotion": 1,
  "YearsWithCurrManager": 3,
  "NumCompaniesWorked": 2,
  "TotalWorkingYears": 10,
  "TrainingTimesLastYear": 2,
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
  "OverTime": "No"
}'

response=$(curl -s -X POST $API_URL/segment/predict \
  -H "Content-Type: application/json" \
  -d "$employee_data")

if echo "$response" | grep -q "clusterId"; then
    print_result 0 "Employee segment predicted"
    echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
else
    print_result 1 "Failed to predict segment"
    echo "$response"
fi
echo ""

# Test 5: Obtenir des recommandations
echo -e "${YELLOW}Test 5: Get Recommendations${NC}"
response=$(curl -s -X POST $API_URL/recommend \
  -H "Content-Type: application/json" \
  -d "$employee_data")

if echo "$response" | grep -q "recommendations"; then
    print_result 0 "Recommendations generated"
    echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
else
    print_result 1 "Failed to generate recommendations"
    echo "$response"
fi
echo ""

# Test 6: Test avec un employé à haut risque
echo -e "${YELLOW}Test 6: High Risk Employee Test${NC}"
high_risk_employee='{
  "Age": 28,
  "MonthlyIncome": 3000,
  "YearsAtCompany": 2,
  "JobSatisfaction": 1,
  "EnvironmentSatisfaction": 2,
  "WorkLifeBalance": 1,
  "JobInvolvement": 2,
  "YearsInCurrentRole": 1,
  "YearsSinceLastPromotion": 2,
  "YearsWithCurrManager": 1,
  "NumCompaniesWorked": 4,
  "TotalWorkingYears": 6,
  "TrainingTimesLastYear": 0,
  "PercentSalaryHike": 11,
  "StockOptionLevel": 0,
  "DistanceFromHome": 25,
  "JobLevel": 1,
  "RelationshipSatisfaction": 2,
  "BusinessTravel": "Travel_Frequently",
  "Department": "Sales",
  "EducationField": "Life Sciences",
  "Gender": "Male",
  "JobRole": "Sales Representative",
  "MaritalStatus": "Single",
  "OverTime": "Yes"
}'

response=$(curl -s -X POST $API_URL/recommend \
  -H "Content-Type: application/json" \
  -d "$high_risk_employee")

if echo "$response" | grep -q "High"; then
    print_result 0 "High risk employee detected correctly"
    echo "Risk Level: $(echo "$response" | grep -o '"level":"[^"]*"' | cut -d'"' -f4)"
else
    print_result 1 "Failed to detect high risk"
fi
echo ""

# Résumé
echo "=========================================="
echo -e "${GREEN}Tests Completed!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Open http://localhost:5173 in your browser"
echo "2. Navigate to 'Segmentation' page"
echo "3. Navigate to 'Recommendations' page"
echo "4. Test with different employee profiles"
echo ""
