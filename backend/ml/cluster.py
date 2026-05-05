"""
Employee Clustering Script
Performs K-Means clustering to segment employees into groups
"""

import pandas as pd
import numpy as np
import json
import sys
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import silhouette_score, davies_bouldin_score
import joblib
import os

# Get the directory of this script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(SCRIPT_DIR, '..', 'data', 'WA_Fn-UseC_-HR-Employee-Attrition.csv')
MODELS_DIR = os.path.join(SCRIPT_DIR, '..', 'models')

def load_and_preprocess_data():
    """Load and preprocess the dataset"""
    df = pd.read_csv(DATA_PATH)
    
    # Select relevant features for clustering
    features_for_clustering = [
        'Age', 'MonthlyIncome', 'YearsAtCompany', 'JobSatisfaction',
        'EnvironmentSatisfaction', 'WorkLifeBalance', 'JobInvolvement',
        'YearsInCurrentRole', 'YearsSinceLastPromotion', 'YearsWithCurrManager',
        'NumCompaniesWorked', 'TotalWorkingYears', 'TrainingTimesLastYear',
        'PercentSalaryHike', 'StockOptionLevel', 'DistanceFromHome',
        'JobLevel', 'RelationshipSatisfaction'
    ]
    
    # Categorical features to encode
    categorical_features = ['BusinessTravel', 'Department', 'EducationField', 
                           'Gender', 'JobRole', 'MaritalStatus', 'OverTime']
    
    # Create a copy for clustering
    df_cluster = df.copy()
    
    # Encode categorical variables
    label_encoders = {}
    for col in categorical_features:
        if col in df_cluster.columns:
            le = LabelEncoder()
            df_cluster[col + '_encoded'] = le.fit_transform(df_cluster[col])
            label_encoders[col] = le
            features_for_clustering.append(col + '_encoded')
    
    # Select features
    X = df_cluster[features_for_clustering]
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    return df, X_scaled, scaler, label_encoders, features_for_clustering

def find_optimal_clusters(X_scaled, max_k=10):
    """Find optimal number of clusters using elbow method and silhouette score"""
    silhouette_scores = []
    
    for k in range(2, min(max_k + 1, len(X_scaled))):
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        labels = kmeans.fit_predict(X_scaled)
        score = silhouette_score(X_scaled, labels)
        silhouette_scores.append(score)
    
    # Choose k with highest silhouette score
    optimal_k = silhouette_scores.index(max(silhouette_scores)) + 2
    return optimal_k

def train_clustering_model():
    """Train K-Means clustering model"""
    try:
        # Load and preprocess data
        df, X_scaled, scaler, label_encoders, feature_names = load_and_preprocess_data()
        
        # Find optimal number of clusters
        optimal_k = find_optimal_clusters(X_scaled)
        
        # Train final model
        kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
        cluster_labels = kmeans.fit_predict(X_scaled)
        
        # Add cluster labels to dataframe
        df['Cluster'] = cluster_labels
        
        # Calculate metrics
        silhouette = silhouette_score(X_scaled, cluster_labels)
        davies_bouldin = davies_bouldin_score(X_scaled, cluster_labels)
        
        # Analyze clusters
        clusters_info = []
        for cluster_id in range(optimal_k):
            cluster_data = df[df['Cluster'] == cluster_id]
            
            # Calculate characteristics
            size = len(cluster_data)
            percentage = (size / len(df)) * 100
            
            # Attrition rate
            attrition_rate = (cluster_data['Attrition'].value_counts().get('Yes', 0) / size) * 100
            
            # Average characteristics
            avg_age = cluster_data['Age'].mean()
            avg_income = cluster_data['MonthlyIncome'].mean()
            avg_years = cluster_data['YearsAtCompany'].mean()
            avg_satisfaction = cluster_data['JobSatisfaction'].mean()
            avg_work_life = cluster_data['WorkLifeBalance'].mean()
            
            # Determine cluster label based on characteristics
            if attrition_rate > 25:
                label = "High Risk Group"
                description = "Employees with high attrition risk requiring immediate attention"
            elif attrition_rate > 15:
                label = "Medium Risk Group"
                description = "Employees showing moderate attrition indicators"
            else:
                label = "Stable Group"
                description = "Employees with low attrition risk and high satisfaction"
            
            # Refine labels based on other characteristics
            if avg_income < df['MonthlyIncome'].quantile(0.33):
                label = f"{label} - Lower Income"
            elif avg_income > df['MonthlyIncome'].quantile(0.67):
                label = f"{label} - Higher Income"
            
            clusters_info.append({
                'clusterId': int(cluster_id),
                'label': label,
                'description': description,
                'size': int(size),
                'percentage': float(percentage),
                'characteristics': {
                    'attritionRate': float(attrition_rate),
                    'avgAge': float(avg_age),
                    'avgIncome': float(avg_income),
                    'avgYearsAtCompany': float(avg_years),
                    'avgJobSatisfaction': float(avg_satisfaction),
                    'avgWorkLifeBalance': float(avg_work_life)
                }
            })
        
        # Save model and metadata
        os.makedirs(MODELS_DIR, exist_ok=True)
        joblib.dump(kmeans, os.path.join(MODELS_DIR, 'clustering_model.pkl'))
        joblib.dump(scaler, os.path.join(MODELS_DIR, 'clustering_scaler.pkl'))
        joblib.dump(label_encoders, os.path.join(MODELS_DIR, 'clustering_encoders.pkl'))
        joblib.dump(feature_names, os.path.join(MODELS_DIR, 'clustering_features.pkl'))
        
        # Save cluster profiles
        with open(os.path.join(MODELS_DIR, 'cluster_profiles.json'), 'w') as f:
            json.dump(clusters_info, f, indent=2)
        
        # Return results
        result = {
            'success': True,
            'message': 'Clustering model trained successfully',
            'metrics': {
                'n_clusters': int(optimal_k),
                'silhouette_score': float(silhouette),
                'davies_bouldin_score': float(davies_bouldin)
            },
            'clusters': clusters_info
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {
            'success': False,
            'error': str(e)
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == '__main__':
    train_clustering_model()
