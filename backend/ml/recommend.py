"""
Employee Recommendation System

Provides personalized HR recommendations based on employee profile,
attrition risk, and cluster segment.
"""

import sys
import json
import warnings
import os
import pandas as pd
import numpy as np
import joblib

warnings.filterwarnings('ignore')

def load_models():
    """Load all required models"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(script_dir, '..', 'models')
    
    # Load attrition model
    attrition_model = joblib.load(os.path.join(models_dir, 'best_model.pkl'))
    attrition_scaler = joblib.load(os.path.join(models_dir, 'scaler.pkl'))
    attrition_encoders = joblib.load(os.path.join(models_dir, 'label_encoders.pkl'))
    attrition_features = joblib.load(os.path.join(models_dir, 'feature_names.pkl'))
    attrition_metadata = joblib.load(os.path.join(models_dir, 'model_metadata.pkl'))
    
    # Load clustering model
    clustering_model = joblib.load(os.path.join(models_dir, 'clustering_model.pkl'))
    clustering_scaler = joblib.load(os.path.join(models_dir, 'clustering_scaler.pkl'))
    clustering_encoders = joblib.load(os.path.join(models_dir, 'clustering_encoders.pkl'))
    clustering_features = joblib.load(os.path.join(models_dir, 'clustering_features.pkl'))
    
    # Load cluster profiles
    with open(os.path.join(models_dir, 'cluster_profiles.json'), 'r') as f:
        profiles_data = json.load(f)
    
    # Load feature importance if available
    feature_importance = []
    feature_path = os.path.join(models_dir, 'feature_importance.json')
    if os.path.exists(feature_path):
        with open(feature_path, 'r') as f:
            feature_importance = json.load(f)
    
    return {
        'attrition': {
            'model': attrition_model,
            'scaler': attrition_scaler,
            'encoders': attrition_encoders,
            'features': attrition_features,
            'metadata': attrition_metadata
        },
        'clustering': {
            'model': clustering_model,
            'scaler': clustering_scaler,
            'encoders': clustering_encoders,
            'features': clustering_features,
            'profiles': profiles_data['clusters']
        },
        'feature_importance': feature_importance
    }

def preprocess_input(employee_data, encoders, feature_names):
    """Preprocess employee data"""
    df = pd.DataFrame([employee_data])
    
    for col, encoder in encoders.items():
        if col in df.columns:
            try:
                df[col] = encoder.transform(df[col])
            except ValueError:
                df[col] = encoder.transform([encoder.classes_[0]])[0]
    
    for feature in feature_names:
        if feature not in df.columns:
            df[feature] = 0
    
    return df[feature_names]

def get_attrition_prediction(employee_data, models):
    """Get attrition prediction"""
    X = preprocess_input(employee_data, models['attrition']['encoders'], models['attrition']['features'])
    
    if models['attrition']['metadata']['uses_scaling']:
        X_processed = models['attrition']['scaler'].transform(X)
    else:
        X_processed = X.values
    
    prediction = int(models['attrition']['model'].predict(X_processed)[0])
    probability = float(models['attrition']['model'].predict_proba(X_processed)[0][1])
    
    return prediction, probability

def get_cluster_assignment(employee_data, models):
    """Get cluster assignment"""
    X = preprocess_input(employee_data, models['clustering']['encoders'], models['clustering']['features'])
    X_scaled = models['clustering']['scaler'].transform(X)
    cluster_id = int(models['clustering']['model'].predict(X_scaled)[0])
    
    cluster_profile = next((c for c in models['clustering']['profiles'] if c['clusterId'] == cluster_id), None)
    
    return cluster_id, cluster_profile

def generate_recommendations(employee_data, attrition_prob, cluster_profile, feature_importance):
    """Generate personalized recommendations"""
    recommendations = []
    
    # Attrition-based recommendations
    if attrition_prob > 0.7:
        recommendations.append({
            'category': 'Retention',
            'priority': 'High',
            'title': 'Immediate Retention Action Required',
            'description': 'This employee has a very high risk of leaving. Schedule an urgent one-on-one meeting.',
            'actions': [
                'Schedule immediate meeting with manager',
                'Discuss career development opportunities',
                'Review compensation and benefits',
                'Identify and address concerns'
            ]
        })
    elif attrition_prob > 0.5:
        recommendations.append({
            'category': 'Retention',
            'priority': 'Medium',
            'title': 'Proactive Retention Strategy',
            'description': 'This employee shows moderate attrition risk. Take preventive measures.',
            'actions': [
                'Schedule regular check-ins',
                'Provide growth opportunities',
                'Review workload and work-life balance',
                'Consider mentorship programs'
            ]
        })
    
    # Job satisfaction recommendations
    job_satisfaction = employee_data.get('JobSatisfaction', 0)
    if job_satisfaction <= 2:
        recommendations.append({
            'category': 'Engagement',
            'priority': 'High',
            'title': 'Improve Job Satisfaction',
            'description': 'Low job satisfaction detected. Focus on engagement initiatives.',
            'actions': [
                'Conduct satisfaction survey',
                'Review job responsibilities',
                'Provide recognition and feedback',
                'Explore role adjustments'
            ]
        })
    
    # Work-life balance recommendations
    work_life_balance = employee_data.get('WorkLifeBalance', 0)
    if work_life_balance <= 2:
        recommendations.append({
            'category': 'Well-being',
            'priority': 'Medium',
            'title': 'Enhance Work-Life Balance',
            'description': 'Employee may be experiencing work-life balance issues.',
            'actions': [
                'Review working hours and overtime',
                'Offer flexible work arrangements',
                'Promote wellness programs',
                'Encourage time-off usage'
            ]
        })
    
    # Career development recommendations
    years_since_promotion = employee_data.get('YearsSinceLastPromotion', 0)
    if years_since_promotion > 3:
        recommendations.append({
            'category': 'Development',
            'priority': 'Medium',
            'title': 'Career Advancement Opportunity',
            'description': 'Employee has not been promoted recently. Consider career development.',
            'actions': [
                'Discuss career goals and aspirations',
                'Create development plan',
                'Identify promotion opportunities',
                'Provide skill development training'
            ]
        })
    
    # Training recommendations
    training_times = employee_data.get('TrainingTimesLastYear', 0)
    if training_times < 2:
        recommendations.append({
            'category': 'Development',
            'priority': 'Low',
            'title': 'Increase Training Opportunities',
            'description': 'Employee has received limited training. Invest in skill development.',
            'actions': [
                'Enroll in relevant training programs',
                'Provide online learning resources',
                'Attend industry conferences',
                'Cross-functional training'
            ]
        })
    
    # Cluster-based recommendations
    if cluster_profile:
        if cluster_profile.get('label') == 'High Risk':
            recommendations.append({
                'category': 'Segment',
                'priority': 'High',
                'title': 'High-Risk Segment Member',
                'description': f"Employee belongs to '{cluster_profile['label']}' segment with {cluster_profile['characteristics']['attritionRate']:.1f}% attrition rate.",
                'actions': [
                    'Apply segment-specific retention strategies',
                    'Monitor closely for warning signs',
                    'Benchmark against successful peers',
                    'Implement targeted interventions'
                ]
            })
        elif cluster_profile.get('label') == 'New Employees':
            recommendations.append({
                'category': 'Onboarding',
                'priority': 'Medium',
                'title': 'New Employee Support',
                'description': 'Focus on onboarding and integration.',
                'actions': [
                    'Assign mentor or buddy',
                    'Regular onboarding check-ins',
                    'Provide clear role expectations',
                    'Facilitate team integration'
                ]
            })
    
    # Sort by priority
    priority_order = {'High': 0, 'Medium': 1, 'Low': 2}
    recommendations.sort(key=lambda x: priority_order.get(x['priority'], 3))
    
    return recommendations[:5]  # Return top 5 recommendations

def generate_insights(employee_data, attrition_prob, cluster_profile, feature_importance):
    """Generate insights about the employee"""
    insights = []
    
    # Top risk factors
    if feature_importance:
        top_features = feature_importance[:3]
        risk_factors = []
        for feat in top_features:
            feature_name = feat['feature']
            if feature_name in employee_data:
                risk_factors.append(f"{feature_name}: {employee_data[feature_name]}")
        
        if risk_factors:
            insights.append({
                'type': 'risk_factors',
                'title': 'Key Risk Factors',
                'content': risk_factors
            })
    
    # Cluster insights
    if cluster_profile:
        insights.append({
            'type': 'segment',
            'title': 'Employee Segment',
            'content': [
                f"Segment: {cluster_profile['label']}",
                f"Description: {cluster_profile['description']}",
                f"Segment Size: {cluster_profile['percentage']:.1f}% of workforce",
                f"Segment Attrition Rate: {cluster_profile['characteristics']['attritionRate']:.1f}%"
            ]
        })
    
    # Comparative insights
    if cluster_profile:
        insights.append({
            'type': 'comparison',
            'title': 'Comparison to Segment Average',
            'content': [
                f"Your Age: {employee_data.get('Age', 'N/A')} vs Avg: {cluster_profile['characteristics']['avgAge']:.1f}",
                f"Your Income: ${employee_data.get('MonthlyIncome', 'N/A')} vs Avg: ${cluster_profile['characteristics']['avgIncome']:.0f}",
                f"Your Tenure: {employee_data.get('YearsAtCompany', 'N/A')} years vs Avg: {cluster_profile['characteristics']['avgYearsAtCompany']:.1f} years"
            ]
        })
    
    return insights

def main():
    """Main recommendation pipeline"""
    try:
        if len(sys.argv) < 2:
            raise ValueError("Employee data not provided")
        
        employee_data = json.loads(sys.argv[1])
        
        print("Loading models...", file=sys.stderr)
        models = load_models()
        
        print("Generating predictions...", file=sys.stderr)
        attrition_pred, attrition_prob = get_attrition_prediction(employee_data, models)
        cluster_id, cluster_profile = get_cluster_assignment(employee_data, models)
        
        print("Generating recommendations...", file=sys.stderr)
        recommendations = generate_recommendations(
            employee_data, 
            attrition_prob, 
            cluster_profile, 
            models['feature_importance']
        )
        
        print("Generating insights...", file=sys.stderr)
        insights = generate_insights(
            employee_data,
            attrition_prob,
            cluster_profile,
            models['feature_importance']
        )
        
        output = {
            'success': True,
            'attritionRisk': {
                'prediction': attrition_pred,
                'probability': attrition_prob,
                'level': 'High' if attrition_prob > 0.6 else 'Medium' if attrition_prob > 0.3 else 'Low'
            },
            'segment': {
                'clusterId': cluster_id,
                'label': cluster_profile['label'] if cluster_profile else f'Cluster {cluster_id}',
                'profile': cluster_profile
            },
            'recommendations': recommendations,
            'insights': insights
        }
        
        print(json.dumps(output))
        
    except Exception as e:
        print(f"Error generating recommendations: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
