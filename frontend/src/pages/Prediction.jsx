import { useState } from 'react';
import { makePrediction } from '../services/api';
import './Prediction.css';

function Prediction() {
  const [formData, setFormData] = useState({
    Age: 30,
    MonthlyIncome: 5000,
    YearsAtCompany: 3,
    JobSatisfaction: 3,
    EnvironmentSatisfaction: 3,
    WorkLifeBalance: 3,
    JobInvolvement: 3,
    YearsInCurrentRole: 2,
    YearsSinceLastPromotion: 1,
    YearsWithCurrManager: 2,
    NumCompaniesWorked: 2,
    TotalWorkingYears: 8,
    TrainingTimesLastYear: 2,
    PercentSalaryHike: 15,
    StockOptionLevel: 1,
    DistanceFromHome: 10,
    JobLevel: 2,
    RelationshipSatisfaction: 3,
    BusinessTravel: 'Travel_Rarely',
    Department: 'Research & Development',
    EducationField: 'Life Sciences',
    Gender: 'Male',
    JobRole: 'Research Scientist',
    MaritalStatus: 'Single',
    OverTime: 'No'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
    setError(null);
    setResult(null);

    try {
      const prediction = await makePrediction(formData);
      setResult(prediction);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to make prediction. Please ensure models are trained.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = (level) => {
    switch(level) {
      case 'High': return 'risk-high';
      case 'Medium': return 'risk-medium';
      case 'Low': return 'risk-low';
      default: return '';
    }
  };

  return (
    <div className="prediction">
      <h2>🔮 Employee Attrition Prediction</h2>
      <p className="subtitle">Enter employee information to predict attrition risk</p>

      {error && <div className="error">{error}</div>}

      <div className="prediction-container">
        <div className="form-section">
          <div className="card">
            <h3 className="card-header">Employee Information</h3>
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="form-section-title">Personal Information</div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    name="Age"
                    value={formData.Age}
                    onChange={handleChange}
                    className="form-input"
                    min="18"
                    max="65"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Marital Status</label>
                  <select
                    name="MaritalStatus"
                    value={formData.MaritalStatus}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Distance From Home (km)</label>
                  <input
                    type="number"
                    name="DistanceFromHome"
                    value={formData.DistanceFromHome}
                    onChange={handleChange}
                    className="form-input"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Job Information */}
              <div className="form-section-title">Job Information</div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    name="Department"
                    value={formData.Department}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="Research & Development">Research & Development</option>
                    <option value="Sales">Sales</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Job Role</label>
                  <select
                    name="JobRole"
                    value={formData.JobRole}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="Research Scientist">Research Scientist</option>
                    <option value="Sales Executive">Sales Executive</option>
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
                  <label className="form-label">Job Level</label>
                  <input
                    type="number"
                    name="JobLevel"
                    value={formData.JobLevel}
                    onChange={handleChange}
                    className="form-input"
                    min="1"
                    max="5"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Education Field</label>
                  <select
                    name="EducationField"
                    value={formData.EducationField}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="Life Sciences">Life Sciences</option>
                    <option value="Medical">Medical</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Technical Degree">Technical Degree</option>
                    <option value="Other">Other</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>
              </div>

              {/* Work Details */}
              <div className="form-section-title">Work Details</div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Monthly Income ($)</label>
                  <input
                    type="number"
                    name="MonthlyIncome"
                    value={formData.MonthlyIncome}
                    onChange={handleChange}
                    className="form-input"
                    min="1000"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Years At Company</label>
                  <input
                    type="number"
                    name="YearsAtCompany"
                    value={formData.YearsAtCompany}
                    onChange={handleChange}
                    className="form-input"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Years In Current Role</label>
                  <input
                    type="number"
                    name="YearsInCurrentRole"
                    value={formData.YearsInCurrentRole}
                    onChange={handleChange}
                    className="form-input"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Years Since Last Promotion</label>
                  <input
                    type="number"
                    name="YearsSinceLastPromotion"
                    value={formData.YearsSinceLastPromotion}
                    onChange={handleChange}
                    className="form-input"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Years With Current Manager</label>
                  <input
                    type="number"
                    name="YearsWithCurrManager"
                    value={formData.YearsWithCurrManager}
                    onChange={handleChange}
                    className="form-input"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Total Working Years</label>
                  <input
                    type="number"
                    name="TotalWorkingYears"
                    value={formData.TotalWorkingYears}
                    onChange={handleChange}
                    className="form-input"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Number of Companies Worked</label>
                  <input
                    type="number"
                    name="NumCompaniesWorked"
                    value={formData.NumCompaniesWorked}
                    onChange={handleChange}
                    className="form-input"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Business Travel</label>
                  <select
                    name="BusinessTravel"
                    value={formData.BusinessTravel}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="Travel_Rarely">Travel Rarely</option>
                    <option value="Travel_Frequently">Travel Frequently</option>
                    <option value="Non-Travel">Non-Travel</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Over Time</label>
                  <select
                    name="OverTime"
                    value={formData.OverTime}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>

              {/* Satisfaction Metrics */}
              <div className="form-section-title">Satisfaction & Performance</div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Job Satisfaction (1-4)</label>
                  <input
                    type="number"
                    name="JobSatisfaction"
                    value={formData.JobSatisfaction}
                    onChange={handleChange}
                    className="form-input"
                    min="1"
                    max="4"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Environment Satisfaction (1-4)</label>
                  <input
                    type="number"
                    name="EnvironmentSatisfaction"
                    value={formData.EnvironmentSatisfaction}
                    onChange={handleChange}
                    className="form-input"
                    min="1"
                    max="4"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Work Life Balance (1-4)</label>
                  <input
                    type="number"
                    name="WorkLifeBalance"
                    value={formData.WorkLifeBalance}
                    onChange={handleChange}
                    className="form-input"
                    min="1"
                    max="4"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Involvement (1-4)</label>
                  <input
                    type="number"
                    name="JobInvolvement"
                    value={formData.JobInvolvement}
                    onChange={handleChange}
                    className="form-input"
                    min="1"
                    max="4"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Relationship Satisfaction (1-4)</label>
                  <input
                    type="number"
                    name="RelationshipSatisfaction"
                    value={formData.RelationshipSatisfaction}
                    onChange={handleChange}
                    className="form-input"
                    min="1"
                    max="4"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Training Times Last Year</label>
                  <input
                    type="number"
                    name="TrainingTimesLastYear"
                    value={formData.TrainingTimesLastYear}
                    onChange={handleChange}
                    className="form-input"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Percent Salary Hike (%)</label>
                  <input
                    type="number"
                    name="PercentSalaryHike"
                    value={formData.PercentSalaryHike}
                    onChange={handleChange}
                    className="form-input"
                    min="0"
                    max="25"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Option Level (0-3)</label>
                  <input
                    type="number"
                    name="StockOptionLevel"
                    value={formData.StockOptionLevel}
                    onChange={handleChange}
                    className="form-input"
                    min="0"
                    max="3"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-large"
                disabled={loading}
              >
                {loading ? '⏳ Predicting...' : '🔮 Predict Attrition Risk'}
              </button>
            </form>
          </div>
        </div>

        {result && (
          <div className="result-section">
            <div className="card result-card">
              <h3 className="card-header">Prediction Result</h3>
              
              <div className="result-main">
                <div className={`risk-indicator ${getRiskClass(result.riskLevel)}`}>
                  <div className="risk-icon">
                    {result.riskLevel === 'High' ? '⚠️' : result.riskLevel === 'Medium' ? '⚡' : '✅'}
                  </div>
                  <div className="risk-level">{result.riskLevel} Risk</div>
                  <div className="risk-probability">{(result.probability * 100).toFixed(1)}%</div>
                  <div className="risk-label">Attrition Probability</div>
                </div>

                <div className="result-details">
                  <div className="detail-item">
                    <span className="detail-label">Prediction:</span>
                    <span className="detail-value">
                      {result.interpretation.willLeave ? 
                        '❌ Likely to Leave' : 
                        '✅ Likely to Stay'
                      }
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Confidence:</span>
                    <span className="detail-value">
                      {(result.interpretation.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Model Used:</span>
                    <span className="detail-value">{result.model}</span>
                  </div>
                </div>

                <div className="result-message">
                  <p>{result.interpretation.message}</p>
                </div>

                {result.riskLevel === 'High' && (
                  <div className="recommendations">
                    <h4>🎯 Recommended Actions:</h4>
                    <ul>
                      <li>Schedule immediate one-on-one meeting</li>
                      <li>Review compensation and benefits</li>
                      <li>Discuss career development opportunities</li>
                      <li>Assess work-life balance concerns</li>
                      <li>Consider retention bonus or promotion</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Prediction;
