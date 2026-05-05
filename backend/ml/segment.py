"""
Employee Segmentation - Clustering Script

This script implements K-Means clustering to segment employees into groups
based on their characteristics and behaviors.
"""

import sys
import json
import warnings
import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, davies_bouldin_score
import joblib

warnings.filterwarnings('ignore')

def load_and_preprocess_data():
    """Load and preprocess data for clustering"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(script_dir, '..', 'data', 'WA_Fn-UseC_-HR-Employee-Attrition.csv')
    df = pd.read_csv(data_path)
    
    # Features for clustering
    numeric_features = [
        'Age', 'MonthlyIncome', 'YearsAtCompany', 'JobSatisfaction',
        'EnvironmentSatisfaction', 'WorkLifeBalance', 'JobInvolvement',
        'YearsInCurrentRole', 'YearsSinceLastPromotion', 'YearsWithCurrManager',
        'NumCompaniesWorked', 'TotalWorkingYears', 'TrainingTimesLastYear',
        'PercentSalaryHike', 'StockOptionLevel', 'DistanceFromHome',
        'JobLevel', 'RelationshipSatisfaction'
    ]
    
    categorical_features = [
        'BusinessTravel', 'Department', 'EducationField', 'Gender',
        'JobRole', 'MaritalStatus', 'OverTime'
    ]
    
    # Verify features exist
    numeric_features = [f for f in numeric_features if f in df.columns]
    categorical_features = [f for f in categorical_features if f in df.columns]
    
    # Encode categorical variables
    df_encoded = df.copy()
    label_encoders = {}
    
    for col in categorical_features:
        le = LabelEncoder()
        df_encoded[col] = le.fit_transform(df_encoded[col])
        label_encoders[col] = le
    
    # Prepare features
    all_features = numeric_features + categorical_features
    X = df_encoded[all_features]
    
    # Standardize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    return X, X_scaled, df, scaler, label_encoders, all_features

def find_optimal_clusters(X_scaled, max_clusters=10):
    """Find optimal number of clusters using elbow method and silhouette score"""
    inertias = []
    silhouette_scores = []
    K_range = range(2, max_clusters + 1)
    
    for k in K_range:
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        kmeans.fit(X_scaled)
        inertias.append(kmeans.inertia_)
        silhouette_scores.append(silhouette_score(X_scaled, kmeans.labels_))
    
    # Find optimal k (highest silhouette score)
    optimal_k = K_range[np.argmax(silhouette_scores)]
    
    return optimal_k, list(K_range), inertias, silhouette_scores

def train_clustering_model(X_scaled, n_clusters):
    """Train K-Means clustering model"""
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    labels = kmeans.fit_predict(X_scaled)
    
    # Calculate metrics
    silhouette = silhouette_score(X_scaled, labels)
    davies_bouldin = davies_bouldin_score(X_scaled, labels)
    
    return kmeans, labels, silhouette, davies_bouldin

def analyze_clusters(df, labels, feature_names):
    """Analyze cluster characteristics"""
    df_analysis = df.copy()
    df_analysis['Cluster'] = labels
    
    cluster_profiles = []
    
    for cluster_id in range(len(np.unique(labels))):
        cluster_data = df_analysis[df_analysis['Cluster'] == cluster_id]
        
        profile = {
            'clusterId': int(cluster_id),
            'size': int(len(cluster_data)),
            'percentage': float(len(cluster_data) / len(df) * 100),
            'characteristics': {
                'avgAge': float(cluster_data['Age'].mean()) if 'Age' in cluster_data else 0,
                'avgIncome': float(cluster_data['MonthlyIncome'].mean()) if 'MonthlyIncome' in cluster_data else 0,
                'avgYearsAtCompany': float(cluster_data['YearsAtCompany'].mean()) if 'YearsAtCompany' in cluster_data else 0,
                'avgJobSatisfaction': float(cluster_data['JobSatisfaction'].mean()) if 'JobSatisfaction' in cluster_data else 0,
                'avgWorkLifeBalance': float(cluster_data['WorkLifeBalance'].mean()) if 'WorkLifeBalance' in cluster_data else 0,
                'attritionRate': float((cluster_data['Attrition'] == 'Yes').sum() / len(cluster_data) * 100) if 'Attrition' in cluster_data else 0
            }
        }
        
        # Determine cluster label based on characteristics
        if profile['characteristics']['attritionRate'] > 25:
            profile['label'] = 'High Risk'
            profile['description'] = 'Employees with high attrition risk'
        elif profile['characteristics']['avgJobSatisfaction'] < 2.5:
            profile['label'] = 'Low Satisfaction'
            profile['description'] = 'Employees with low job satisfaction'
        elif profile['characteristics']['avgYearsAtCompany'] < 3:
            profile['label'] = 'New Employees'
            profile['description'] = 'Recently hired employees'
        elif profile['characteristics']['avgYearsAtCompany'] > 10:
            profile['label'] = 'Veterans'
            profile['description'] = 'Long-tenured employees'
        else:
            profile['label'] = f'Segment {cluster_id + 1}'
            profile['description'] = 'Standard employee segment'
        
        cluster_profiles.append(profile)
    
    return cluster_profiles

def save_clustering_model(kmeans, scaler, label_encoders, feature_names, cluster_profiles, metrics):
    """Save clustering model and metadata"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(script_dir, '..', 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    # Save model
    model_path = os.path.join(models_dir, 'clustering_model.pkl')
    joblib.dump(kmeans, model_path)
    
    # Save scaler
    scaler_path = os.path.join(models_dir, 'clustering_scaler.pkl')
    joblib.dump(scaler, scaler_path)
    
    # Save encoders
    encoders_path = os.path.join(models_dir, 'clustering_encoders.pkl')
    joblib.dump(label_encoders, encoders_path)
    
    # Save feature names
    features_path = os.path.join(models_dir, 'clustering_features.pkl')
    joblib.dump(feature_names, features_path)
    
    # Save cluster profiles
    profiles_path = os.path.join(models_dir, 'cluster_profiles.json')
    with open(profiles_path, 'w') as f:
        json.dump({
            'clusters': cluster_profiles,
            'metrics': metrics
        }, f, indent=2)

def main():
    """Main clustering pipeline"""
    try:
        print("Loading and preprocessing data...", file=sys.stderr)
        X, X_scaled, df, scaler, label_encoders, feature_names = load_and_preprocess_data()
        
        print("Finding optimal number of clusters...", file=sys.stderr)
        optimal_k, k_range, inertias, silhouette_scores = find_optimal_clusters(X_scaled)
        
        print(f"Optimal number of clusters: {optimal_k}", file=sys.stderr)
        
        print("Training clustering model...", file=sys.stderr)
        kmeans, labels, silhouette, davies_bouldin = train_clustering_model(X_scaled, optimal_k)
        
        print("Analyzing clusters...", file=sys.stderr)
        cluster_profiles = analyze_clusters(df, labels, feature_names)
        
        metrics = {
            'n_clusters': int(optimal_k),
            'silhouette_score': float(silhouette),
            'davies_bouldin_score': float(davies_bouldin),
            'elbow_data': {
                'k_values': k_range,
                'inertias': inertias,
                'silhouette_scores': silhouette_scores
            }
        }
        
        print("Saving model and results...", file=sys.stderr)
        save_clustering_model(kmeans, scaler, label_encoders, feature_names, cluster_profiles, metrics)
        
        output = {
            'success': True,
            'n_clusters': optimal_k,
            'metrics': metrics,
            'clusters': cluster_profiles
        }
        
        print(json.dumps(output))
        
    except Exception as e:
        print(f"Error during clustering: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
