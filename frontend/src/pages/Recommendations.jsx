import { useState } from 'react';
import { getRecommendations } from '../services/api';
import './Recommendations.css';

function Recommendations() {
  const [formData, setFormData] = useState({
    Age: 30,
    MonthlyIncome: 5000,
    YearsAtCompany: 5,
    JobSatisfaction: 3,
    EnvironmentSatisfaction: 3,
    WorkLifeBalance: 3,
    JobInvolvement: 3,
    YearsInCurrentRole: 3,
    YearsSinceLastPromotion: 1,
    YearsWithCurrManager: 3,
    NumCompaniesWorked: 2,
    TotalWorkingYears: 10,
    TrainingTimesLastYear: 2,
    PercentSalaryHike: 15,
    StockOptionLevel: 1,
    DistanceFromHome: 10,
    JobLevel: 2,
    RelationshipSatisfaction: 3,
    BusinessTravel: 'Travel_Rarely',
    Department: 'Sales',
    EducationField: 'Life Sciences',
    Gender: 'Male',
    JobRole: 'Sales Executive',
    MaritalStatus: 'Single',
    OverTime: 'No'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(value) ? value : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await getRecommendations(formData);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="recommendations-page">
      <div className="page-header">
        <h1>Employee Recommendations</h1>
        <p>Get personalized HR recommendations based on employee profile</p>
      </div>

      <div className="content-grid">
        <div className="form-section">
          <form onSubmit={handleSubmit} className="employee-form">
            <h2>Employee Information</h2>
            
            <div className="form-group">
              <label>Age</label>
              <input type="number" name="Age" value={formData.Age} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Monthly Income ($)</label>
              <input type="number" name="MonthlyIncome" value={formData.MonthlyIncome} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Years at Company</label>
              <input type="number" name="YearsAtCompany" value={formData.YearsAtCompany} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Job Satisfaction (1-4)</label>
              <input type="number" min="1" max="4" name="JobSatisfaction" value={formData.JobSatisfaction} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Work-Life Balance (1-4)</label>
              <input type="number" min="1" max="4" name="WorkLifeBalance" value={formData.WorkLifeBalance} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Years Since Last Promotion</label>
              <input type="number" name="YearsSinceLastPromotion" value={formData.YearsSinceLastPromotion} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Training Times Last Year</label>
              <input type="number" name="TrainingTimesLastYear" value={formData.TrainingTimesLastYear} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Department</label>
              <select name="Department" value={formData.Department} onChange={handleChange} required>
                <option value="Sales">Sales</option>
                <option value="Research & Development">Research & Development</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>

            <div className="form-group">
              <label>Job Role</label>
              <select name="JobRole" value={formData.JobRole} onChange={handleChange} required>
                <option value="Sales Executive">Sales Executive</option>
                <option value="Research Scientist">Research Scientist</option>
                <option value="Laboratory Technician">Laboratory Technician</option>
                <option value="Manufacturing Director">Manufacturing Director</option>
                <option value="Healthcare Representative">Healthcare Representative</option>
                <option value="Manager">Manager</option>
                <option value="Sales Representative">Sales Representative</option>
                <option value="Research Director">Research Director</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>

            <div className="form-group">
              <label>Overtime</label>
              <select name="OverTime" value={formData.OverTime} onChange={handleChange} required>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Generating...' : 'Get Recommendations'}
            </button>
          </form>
        </div>

        <div className="results-section">
          {error && (
            <div className="error-message">{error}</div>
          )}

          {result && (
            <>
              <div className="summary-cards">
                <div className="summary-card" style={{ borderLeftColor: getRiskColor(result.attritionRisk.level) }}>
                  <h3>Attrition Risk</h3>
                  <div className="risk-level" style={{ color: getRiskColor(result.attritionRisk.level) }}>
                    {result.attritionRisk.level}
                  </div>
                  <div className="risk-probability">
                    {(result.attritionRisk.probability * 100).toFixed(1)}% probability
                  </div>
                </div>

                <div className="summary-card" style={{ borderLeftColor: '#667eea' }}>
                  <h3>Employee Segment</h3>
                  <div className="segment-label">{result.segment.label}</div>
                  <div className="segment-description">
                    {result.segment.profile?.description}
                  </div>
                </div>
              </div>

              {result.insights && result.insights.length > 0 && (
                <div className="insights-section">
                  <h2>Insights</h2>
                  {result.insights.map((insight, idx) => (
                    <div key={idx} className="insight-card">
                      <h3>{insight.title}</h3>
                      <ul>
                        {insight.content.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {result.recommendations && result.recommendations.length > 0 && (
                <div className="recommendations-section">
                  <h2>Recommendations</h2>
                  {result.recommendations.map((rec, idx) => (
                    <div key={idx} className="recommendation-card">
                      <div className="rec-header">
                        <div>
                          <h3>{rec.title}</h3>
                          <span className="rec-category">{rec.category}</span>
                        </div>
                        <span 
                          className="rec-priority" 
                          style={{ backgroundColor: getPriorityColor(rec.priority) }}
                        >
                          {rec.priority}
                        </span>
                      </div>
                      <p className="rec-description">{rec.description}</p>
                      <div className="rec-actions">
                        <h4>Suggested Actions:</h4>
                        <ul>
                          {rec.actions.map((action, i) => (
                            <li key={i}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {!result && !error && (
            <div className="empty-state">
              <p>Fill in the employee information and click "Get Recommendations" to see personalized HR recommendations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recommendations;
