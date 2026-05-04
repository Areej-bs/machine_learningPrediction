import { useState, useEffect } from 'react';
import { getFeatureImportance, getMetrics } from '../services/api';
import { Bar } from 'react-chartjs-2';
import './ModelInfo.css';

function ModelInfo() {
  const [features, setFeatures] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [featuresData, metricsData] = await Promise.all([
        getFeatureImportance().catch(() => null),
        getMetrics().catch(() => null)
      ]);
      setFeatures(featuresData);
      setMetrics(metricsData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const modelDescriptions = {
    'Logistic Regression': {
      description: 'A linear model that predicts the probability of binary outcomes using a logistic function.',
      pros: ['Fast training', 'Interpretable coefficients', 'Works well with linearly separable data'],
      cons: ['Assumes linear relationship', 'May underperform with complex patterns'],
      useCase: 'Best for baseline models and when interpretability is crucial'
    },
    'Decision Tree': {
      description: 'A tree-like model that makes decisions by splitting data based on feature values.',
      pros: ['Easy to understand', 'Handles non-linear relationships', 'No feature scaling needed'],
      cons: ['Prone to overfitting', 'Can be unstable with small data changes'],
      useCase: 'Good for exploratory analysis and understanding decision rules'
    },
    'Random Forest': {
      description: 'An ensemble of decision trees that combines multiple trees to improve accuracy and reduce overfitting.',
      pros: ['High accuracy', 'Handles non-linear data well', 'Provides feature importance'],
      cons: ['Less interpretable', 'Slower training than single trees'],
      useCase: 'Excellent for production when accuracy is priority'
    },
    'Gradient Boosting': {
      description: 'Builds trees sequentially, where each tree corrects errors from previous trees.',
      pros: ['Very high accuracy', 'Handles complex patterns', 'Feature importance available'],
      cons: ['Longer training time', 'Requires careful tuning'],
      useCase: 'Best for competitions and when maximum accuracy is needed'
    },
    'XGBoost': {
      description: 'An optimized gradient boosting implementation with regularization and parallel processing.',
      pros: ['State-of-the-art performance', 'Built-in regularization', 'Handles missing values'],
      cons: ['Many hyperparameters to tune', 'Can be computationally expensive'],
      useCase: 'Industry standard for structured data and high-stakes predictions'
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading model information...</p>
      </div>
    );
  }

  return (
    <div className="model-info">
      <h2>📚 Model Information & Analysis</h2>
      <p className="subtitle">Understanding the machine learning algorithms and their performance</p>

      {/* Best Model Section */}
      {metrics && (
        <div className="card best-model-section">
          <h3 className="card-header">🏆 Selected Best Model</h3>
          <div className="best-model-content">
            <div className="best-model-name">{metrics.bestModel}</div>
            <p className="best-model-reason">
              Selected based on <strong>F1-Score</strong> ({(metrics.metrics.f1 * 100).toFixed(2)}%), 
              which balances precision and recall for optimal attrition prediction.
            </p>
            {modelDescriptions[metrics.bestModel] && (
              <div className="model-details">
                <p className="model-description">
                  {modelDescriptions[metrics.bestModel].description}
                </p>
                <div className="model-attributes">
                  <div className="attribute-section">
                    <h4>✅ Advantages</h4>
                    <ul>
                      {modelDescriptions[metrics.bestModel].pros.map((pro, idx) => (
                        <li key={idx}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="attribute-section">
                    <h4>⚠️ Considerations</h4>
                    <ul>
                      {modelDescriptions[metrics.bestModel].cons.map((con, idx) => (
                        <li key={idx}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="use-case">
                  <strong>Use Case:</strong> {modelDescriptions[metrics.bestModel].useCase}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* All Models Overview */}
      <div className="card">
        <h3 className="card-header">🤖 All Implemented Algorithms</h3>
        <div className="models-grid">
          {Object.entries(modelDescriptions).map(([name, info]) => (
            <div 
              key={name} 
              className={`model-card ${metrics?.bestModel === name ? 'best' : ''}`}
            >
              <div className="model-card-header">
                <h4>{name}</h4>
                {metrics?.bestModel === name && <span className="best-badge">🏆 Best</span>}
              </div>
              <p className="model-card-description">{info.description}</p>
              {metrics && (
                <div className="model-card-metrics">
                  {metrics.comparison.find(m => m.model === name) && (
                    <>
                      <div className="metric-item">
                        <span>Accuracy:</span>
                        <strong>{(metrics.comparison.find(m => m.model === name).accuracy * 100).toFixed(2)}%</strong>
                      </div>
                      <div className="metric-item">
                        <span>F1-Score:</span>
                        <strong>{(metrics.comparison.find(m => m.model === name).f1 * 100).toFixed(2)}%</strong>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Feature Importance */}
      {features && features.features && (
        <div className="card">
          <h3 className="card-header">📊 Feature Importance Analysis</h3>
          <p className="feature-description">
            These features have the most significant impact on predicting employee attrition.
            Understanding these factors helps HR teams focus on the right retention strategies.
          </p>
          
          <div className="top-features">
            <h4>Top 3 Most Important Features:</h4>
            <div className="top-features-grid">
              {features.features.slice(0, 3).map((feature, idx) => (
                <div key={idx} className="top-feature-card">
                  <div className="feature-rank">#{idx + 1}</div>
                  <div className="feature-name">{feature.feature}</div>
                  <div className="feature-importance">{(feature.importance * 100).toFixed(2)}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="feature-chart">
            <Bar
              data={{
                labels: features.features.slice(0, 15).map(f => f.feature),
                datasets: [
                  {
                    label: 'Importance (%)',
                    data: features.features.slice(0, 15).map(f => f.importance * 100),
                    backgroundColor: 'rgba(37, 99, 235, 0.7)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  title: {
                    display: true,
                    text: 'Top 15 Features by Importance',
                    font: {
                      size: 16,
                      weight: 'bold'
                    }
                  },
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return value + '%';
                      }
                    }
                  },
                },
              }}
              height={500}
            />
          </div>
        </div>
      )}

      {/* Model Selection Criteria */}
      <div className="card">
        <h3 className="card-header">🎯 Model Selection Criteria</h3>
        <div className="selection-criteria">
          <div className="criteria-item">
            <div className="criteria-icon">📈</div>
            <div className="criteria-content">
              <h4>F1-Score Priority</h4>
              <p>
                We use F1-Score as the primary metric because it balances precision (avoiding false alarms) 
                and recall (catching actual attrition cases). This is crucial for HR decision-making.
              </p>
            </div>
          </div>
          <div className="criteria-item">
            <div className="criteria-icon">⚖️</div>
            <div className="criteria-content">
              <h4>Class Imbalance Handling</h4>
              <p>
                Employee attrition is typically imbalanced (more people stay than leave). Our models 
                use techniques like class weighting to handle this effectively.
              </p>
            </div>
          </div>
          <div className="criteria-item">
            <div className="criteria-icon">🔄</div>
            <div className="criteria-content">
              <h4>Cross-Validation</h4>
              <p>
                All models are evaluated using stratified train-test split (80/20) to ensure 
                reliable performance estimates on unseen data.
              </p>
            </div>
          </div>
          <div className="criteria-item">
            <div className="criteria-icon">🎲</div>
            <div className="criteria-content">
              <h4>Reproducibility</h4>
              <p>
                All models use fixed random seeds (random_state=42) to ensure consistent 
                results across different runs and environments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="card">
        <h3 className="card-header">⚙️ Technical Implementation</h3>
        <div className="tech-details">
          <div className="tech-section">
            <h4>Data Preprocessing</h4>
            <ul>
              <li><strong>Label Encoding:</strong> Categorical variables converted to numerical format</li>
              <li><strong>Standard Scaling:</strong> Numerical features normalized for models that require it</li>
              <li><strong>Feature Selection:</strong> 25 features (18 numerical + 7 categorical)</li>
            </ul>
          </div>
          <div className="tech-section">
            <h4>Model Training</h4>
            <ul>
              <li><strong>Dataset:</strong> 1,470 employee records</li>
              <li><strong>Train/Test Split:</strong> 80% training, 20% testing</li>
              <li><strong>Stratification:</strong> Maintains class distribution in splits</li>
            </ul>
          </div>
          <div className="tech-section">
            <h4>Evaluation Metrics</h4>
            <ul>
              <li><strong>Accuracy:</strong> Overall correctness of predictions</li>
              <li><strong>Precision:</strong> Accuracy of positive predictions</li>
              <li><strong>Recall:</strong> Ability to find all positive cases</li>
              <li><strong>F1-Score:</strong> Harmonic mean of precision and recall</li>
              <li><strong>ROC-AUC:</strong> Model's ability to distinguish between classes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModelInfo;
