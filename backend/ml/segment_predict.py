"""
Employee Segmentation - Prediction Script

Assigns an employee to a cluster segment.
"""

import sys
import json
import warnings
import os
import pandas as pd
import joblib

warnings.filterwarnings('ignore')

def load_clustering_model():
    """Load clustering model and preprocessors"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(script_dir, '..', 'models')
    
    model = joblib.load(os.path.join(models_dir, 'clustering_model.pkl'))
    scaler = joblib.load(os.path.join(models_dir, 'clustering_scaler.pkl'))
    label_encoders = joblib.load(os.path.join(models_dir, 'clustering_encoders.pkl'))
    feature_names = joblib.load(os.path.join(models_dir, 'clustering_features.pkl'))
    
    # Load cluster profiles
    with open(os.path.join(models_dir, 'cluster_profiles.json'), 'r') as f:
        profiles_data = json.load(f)
    
    return model, scaler, label_encoders, feature_names, profiles_data['clusters']

def preprocess_input(employee_data, label_encoders, feature_names):
    """Preprocess input employee data"""
    df = pd.DataFrame([employee_data])
    
    # Encode categorical variables
    for col, encoder in label_encoders.items():
        if col in df.columns:
            try:
                df[col] = encoder.transform(df[col])
            except ValueError:
                df[col] = encoder.transform([encoder.classes_[0]])[0]
    
    # Ensure all features are present
    for feature in feature_names:
        if feature not in df.columns:
            df[feature] = 0
    
    X = df[feature_names]
    return X

def main():
    """Main prediction pipeline"""
    try:
        if len(sys.argv) < 2:
            raise ValueError("Employee data not provided")
        
        employee_data = json.loads(sys.argv[1])
        
        print("Loading clustering model...", file=sys.stderr)
        model, scaler, label_encoders, feature_names, cluster_profiles = load_clustering_model()
        
        print("Preprocessing input...", file=sys.stderr)
        X = preprocess_input(employee_data, label_encoders, feature_names)
        
        print("Predicting cluster...", file=sys.stderr)
        X_scaled = scaler.transform(X)
        cluster_id = int(model.predict(X_scaled)[0])
        
        # Get cluster profile
        cluster_profile = next((c for c in cluster_profiles if c['clusterId'] == cluster_id), None)
        
        output = {
            'clusterId': cluster_id,
            'clusterLabel': cluster_profile['label'] if cluster_profile else f'Cluster {cluster_id}',
            'clusterDescription': cluster_profile['description'] if cluster_profile else '',
            'clusterProfile': cluster_profile
        }
        
        print(json.dumps(output))
        
    except Exception as e:
        print(f"Error during segmentation: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
