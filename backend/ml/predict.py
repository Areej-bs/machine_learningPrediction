"""
Employee Attrition Prediction - Prediction Script

This script loads the trained best model and makes predictions for new employee data.
"""

import sys
import json
import warnings
import os
import pandas as pd
import numpy as np
import joblib

warnings.filterwarnings('ignore')

def load_model_and_preprocessors():
    """
    Load the saved model, scaler, encoders, and feature names
    """
    script_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(script_dir, '..', 'models')
    
    model = joblib.load(os.path.join(models_dir, 'best_model.pkl'))
    scaler = joblib.load(os.path.join(models_dir, 'scaler.pkl'))
    label_encoders = joblib.load(os.path.join(models_dir, 'label_encoders.pkl'))
    feature_names = joblib.load(os.path.join(models_dir, 'feature_names.pkl'))
    metadata = joblib.load(os.path.join(models_dir, 'model_metadata.pkl'))
    
    return model, scaler, label_encoders, feature_names, metadata

def preprocess_input(employee_data, label_encoders, feature_names):
    """
    Preprocess input employee data
    """
    # Create DataFrame from input
    df = pd.DataFrame([employee_data])
    
    # Encode categorical variables
    for col, encoder in label_encoders.items():
        if col in df.columns:
            try:
                df[col] = encoder.transform(df[col])
            except ValueError:
                # Handle unseen categories by using the most frequent class
                df[col] = encoder.transform([encoder.classes_[0]])[0]
    
    # Ensure all features are present and in correct order
    for feature in feature_names:
        if feature not in df.columns:
            df[feature] = 0  # Default value for missing features
    
    # Select features in correct order
    X = df[feature_names]
    
    return X

def get_risk_level(probability):
    """
    Categorize attrition risk based on probability
    """
    if probability < 0.3:
        return 'Low'
    elif probability < 0.6:
        return 'Medium'
    else:
        return 'High'

def main():
    """
    Main prediction pipeline
    """
    try:
        # Get employee data from command line argument
        if len(sys.argv) < 2:
            raise ValueError("Employee data not provided")
        
        employee_data = json.loads(sys.argv[1])
        
        print("Loading model and preprocessors...", file=sys.stderr)
        model, scaler, label_encoders, feature_names, metadata = load_model_and_preprocessors()
        
        print("Preprocessing input data...", file=sys.stderr)
        X = preprocess_input(employee_data, label_encoders, feature_names)
        
        # Scale if needed
        if metadata['uses_scaling']:
            X_processed = scaler.transform(X)
        else:
            X_processed = X.values
        
        print("Making prediction...", file=sys.stderr)
        prediction = int(model.predict(X_processed)[0])
        probability = float(model.predict_proba(X_processed)[0][1])
        
        risk_level = get_risk_level(probability)
        
        # Prepare output
        output = {
            'prediction': prediction,
            'probability': probability,
            'riskLevel': risk_level,
            'model': metadata['best_model_name'],
            'interpretation': {
                'willLeave': prediction == 1,
                'confidence': probability if prediction == 1 else (1 - probability),
                'message': f"{'High' if risk_level == 'High' else 'Moderate' if risk_level == 'Medium' else 'Low'} risk of attrition"
            }
        }
        
        print(json.dumps(output))
        
    except Exception as e:
        print(f"Error during prediction: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
