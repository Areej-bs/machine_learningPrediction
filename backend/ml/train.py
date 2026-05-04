"""
Employee Attrition Prediction - Model Training Script

This script implements ALL 5 machine learning algorithms from the notebook:
1. Logistic Regression
2. Decision Tree
3. Random Forest
4. Gradient Boosting
5. XGBoost

It trains all models, evaluates them, and selects the best one based on F1-Score.
"""

import sys
import json
import warnings
import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                             f1_score, roc_auc_score)
from xgboost import XGBClassifier
import joblib

warnings.filterwarnings('ignore')

def load_and_preprocess_data():
    """
    Load and preprocess the employee attrition dataset
    Returns: X_train, X_test, y_train, y_test, scaler, label_encoders, feature_names
    """
    # Load dataset
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(script_dir, '..', 'data', 'WA_Fn-UseC_-HR-Employee-Attrition.csv')
    df = pd.read_csv(data_path)
    
    # Create a copy for modeling
    df_model = df.copy()
    
    # Encode target variable
    df_model['Attrition'] = (df_model['Attrition'] == 'Yes').astype(int)
    
    # Define features (exactly as in notebook)
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
    numeric_features = [f for f in numeric_features if f in df_model.columns]
    categorical_features = [f for f in categorical_features if f in df_model.columns]
    
    # Encode categorical variables
    df_encoded = df_model.copy()
    label_encoders = {}
    
    for col in categorical_features:
        le = LabelEncoder()
        df_encoded[col] = le.fit_transform(df_encoded[col])
        label_encoders[col] = le
    
    # Prepare features and target
    all_features = numeric_features + categorical_features
    X = df_encoded[all_features]
    y = df_encoded['Attrition']
    
    # Train/test split (80/20, stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Standardize features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    return X_train, X_test, X_train_scaled, X_test_scaled, y_train, y_test, scaler, label_encoders, all_features

def train_all_models(X_train, X_test, X_train_scaled, X_test_scaled, y_train, y_test):
    """
    Train all 5 ML models and evaluate them
    Returns: Dictionary with all results
    """
    results = {}
    
    # 1. Logistic Regression
    print("Training Logistic Regression...", file=sys.stderr)
    lr = LogisticRegression(random_state=42, max_iter=1000)
    lr.fit(X_train_scaled, y_train)
    y_pred_lr = lr.predict(X_test_scaled)
    y_pred_proba_lr = lr.predict_proba(X_test_scaled)[:, 1]
    
    results['Logistic Regression'] = {
        'model': lr,
        'scaled': True,
        'accuracy': float(accuracy_score(y_test, y_pred_lr)),
        'precision': float(precision_score(y_test, y_pred_lr, zero_division=0)),
        'recall': float(recall_score(y_test, y_pred_lr, zero_division=0)),
        'f1': float(f1_score(y_test, y_pred_lr, zero_division=0)),
        'roc_auc': float(roc_auc_score(y_test, y_pred_proba_lr))
    }
    
    # 2. Decision Tree
    print("Training Decision Tree...", file=sys.stderr)
    dt = DecisionTreeClassifier(random_state=42, max_depth=10)
    dt.fit(X_train, y_train)
    y_pred_dt = dt.predict(X_test)
    y_pred_proba_dt = dt.predict_proba(X_test)[:, 1]
    
    results['Decision Tree'] = {
        'model': dt,
        'scaled': False,
        'accuracy': float(accuracy_score(y_test, y_pred_dt)),
        'precision': float(precision_score(y_test, y_pred_dt, zero_division=0)),
        'recall': float(recall_score(y_test, y_pred_dt, zero_division=0)),
        'f1': float(f1_score(y_test, y_pred_dt, zero_division=0)),
        'roc_auc': float(roc_auc_score(y_test, y_pred_proba_dt))
    }
    
    # 3. Random Forest
    print("Training Random Forest...", file=sys.stderr)
    rf = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10)
    rf.fit(X_train, y_train)
    y_pred_rf = rf.predict(X_test)
    y_pred_proba_rf = rf.predict_proba(X_test)[:, 1]
    
    results['Random Forest'] = {
        'model': rf,
        'scaled': False,
        'accuracy': float(accuracy_score(y_test, y_pred_rf)),
        'precision': float(precision_score(y_test, y_pred_rf, zero_division=0)),
        'recall': float(recall_score(y_test, y_pred_rf, zero_division=0)),
        'f1': float(f1_score(y_test, y_pred_rf, zero_division=0)),
        'roc_auc': float(roc_auc_score(y_test, y_pred_proba_rf))
    }
    
    # 4. Gradient Boosting
    print("Training Gradient Boosting...", file=sys.stderr)
    gb = GradientBoostingClassifier(n_estimators=100, random_state=42, max_depth=5)
    gb.fit(X_train, y_train)
    y_pred_gb = gb.predict(X_test)
    y_pred_proba_gb = gb.predict_proba(X_test)[:, 1]
    
    results['Gradient Boosting'] = {
        'model': gb,
        'scaled': False,
        'accuracy': float(accuracy_score(y_test, y_pred_gb)),
        'precision': float(precision_score(y_test, y_pred_gb, zero_division=0)),
        'recall': float(recall_score(y_test, y_pred_gb, zero_division=0)),
        'f1': float(f1_score(y_test, y_pred_gb, zero_division=0)),
        'roc_auc': float(roc_auc_score(y_test, y_pred_proba_gb))
    }
    
    # 5. XGBoost
    print("Training XGBoost...", file=sys.stderr)
    scale_pos_weight = (y_train == 0).sum() / (y_train == 1).sum()
    
    xgb = XGBClassifier(
        n_estimators=300,
        learning_rate=0.05,
        max_depth=4,
        min_child_weight=2,
        subsample=0.8,
        colsample_bytree=0.8,
        gamma=0.1,
        reg_alpha=0.1,
        reg_lambda=1.0,
        objective='binary:logistic',
        eval_metric='logloss',
        random_state=42,
        scale_pos_weight=scale_pos_weight
    )
    xgb.fit(X_train, y_train)
    y_pred_xgb = xgb.predict(X_test)
    y_pred_proba_xgb = xgb.predict_proba(X_test)[:, 1]
    
    results['XGBoost'] = {
        'model': xgb,
        'scaled': False,
        'accuracy': float(accuracy_score(y_test, y_pred_xgb)),
        'precision': float(precision_score(y_test, y_pred_xgb, zero_division=0)),
        'recall': float(recall_score(y_test, y_pred_xgb, zero_division=0)),
        'f1': float(f1_score(y_test, y_pred_xgb, zero_division=0)),
        'roc_auc': float(roc_auc_score(y_test, y_pred_proba_xgb))
    }
    
    return results

def select_best_model(results):
    """
    Select the best model based on F1-Score
    Returns: best_model_name, best_model_metrics
    """
    best_f1 = 0
    best_model_name = None
    
    for model_name, metrics in results.items():
        if metrics['f1'] > best_f1:
            best_f1 = metrics['f1']
            best_model_name = model_name
    
    return best_model_name

def save_models_and_metrics(results, best_model_name, scaler, label_encoders, feature_names):
    """
    Save the best model, scaler, encoders, and metrics to disk
    """
    script_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(script_dir, '..', 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    # Save best model
    best_model = results[best_model_name]['model']
    model_path = os.path.join(models_dir, 'best_model.pkl')
    joblib.dump(best_model, model_path)
    
    # Save scaler
    scaler_path = os.path.join(models_dir, 'scaler.pkl')
    joblib.dump(scaler, scaler_path)
    
    # Save label encoders
    encoders_path = os.path.join(models_dir, 'label_encoders.pkl')
    joblib.dump(label_encoders, encoders_path)
    
    # Save feature names
    features_path = os.path.join(models_dir, 'feature_names.pkl')
    joblib.dump(feature_names, features_path)
    
    # Save model metadata
    metadata = {
        'best_model_name': best_model_name,
        'uses_scaling': results[best_model_name]['scaled']
    }
    metadata_path = os.path.join(models_dir, 'model_metadata.pkl')
    joblib.dump(metadata, metadata_path)
    
    # Save metrics
    metrics_data = {
        'bestModel': best_model_name,
        'metrics': {k: v for k, v in results[best_model_name].items() if k not in ['model', 'scaled']},
        'comparison': [
            {
                'model': name,
                **{k: v for k, v in metrics.items() if k not in ['model', 'scaled']}
            }
            for name, metrics in results.items()
        ]
    }
    metrics_path = os.path.join(models_dir, 'metrics.json')
    with open(metrics_path, 'w') as f:
        json.dump(metrics_data, f, indent=2)
    
    # Save feature importance (for tree-based models)
    if best_model_name in ['Random Forest', 'Gradient Boosting', 'Decision Tree', 'XGBoost']:
        feature_importance = [
            {
                'feature': feature,
                'importance': float(importance)
            }
            for feature, importance in zip(feature_names, best_model.feature_importances_)
        ]
        feature_importance.sort(key=lambda x: x['importance'], reverse=True)
        
        feature_path = os.path.join(models_dir, 'feature_importance.json')
        with open(feature_path, 'w') as f:
            json.dump(feature_importance, f, indent=2)

def main():
    """
    Main training pipeline
    """
    try:
        print("Loading and preprocessing data...", file=sys.stderr)
        X_train, X_test, X_train_scaled, X_test_scaled, y_train, y_test, scaler, label_encoders, feature_names = load_and_preprocess_data()
        
        print(f"Dataset loaded: {len(X_train)} training samples, {len(X_test)} test samples", file=sys.stderr)
        print(f"Features: {len(feature_names)}", file=sys.stderr)
        
        print("\nTraining all 5 models...", file=sys.stderr)
        results = train_all_models(X_train, X_test, X_train_scaled, X_test_scaled, y_train, y_test)
        
        print("\nSelecting best model...", file=sys.stderr)
        best_model_name = select_best_model(results)
        
        print(f"\nBest model: {best_model_name}", file=sys.stderr)
        print(f"F1-Score: {results[best_model_name]['f1']:.4f}", file=sys.stderr)
        
        print("\nSaving models and metrics...", file=sys.stderr)
        save_models_and_metrics(results, best_model_name, scaler, label_encoders, feature_names)
        
        # Prepare output
        output = {
            'bestModel': best_model_name,
            'metrics': {k: v for k, v in results[best_model_name].items() if k not in ['model', 'scaled']},
            'allModels': {
                name: {k: v for k, v in metrics.items() if k not in ['model', 'scaled']}
                for name, metrics in results.items()
            }
        }
        
        print(json.dumps(output))
        
    except Exception as e:
        print(f"Error during training: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
