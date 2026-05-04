import { useState, useEffect } from 'react';
import { trainModels, getMetrics } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [training, setTraining] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMetrics();
      setMetrics(data);
    } catch (err) {
      if (err.response?.status === 400) {
        setError('Models not trained yet. Please train the models first.');
      } else {
        setError('Failed to load metrics. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTrain = async () => {
    try {
      setTraining(true);
      setError(null);
      setSuccess(null);
      
      const result = await trainModels();
      setMetrics(result);
      setSuccess(`Models trained successfully! Best model: ${result.bestModel}`);
      
      // Reload metrics after training
      setTimeout(() => loadMetrics(), 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to train models. Please check if the dataset is in place.');
    } finally {
      setTraining(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading metrics...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📊 Model Performance Dashboard</h2>
        <button 
          className="btn btn-primary" 
          onClick={handleTrain}
          disabled={training}
        >
          {training ? '⏳ Training...' : '🚀 Train Models'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {!metrics ? (
        <div className="card">
          <div className="empty-state">
            <h3>No Models Trained Yet</h3>
            <p>Click the "Train Models" button to train all 5 machine learning algorithms and compare their performance.</p>
            <ul className="model-list">
              <li>✓ Logistic Regression</li>
              <li>✓ Decision Tree</li>
              <li>✓ Random Forest</li>
              <li>✓ Gradient Boosting</li>
              <li>✓ XGBoost</li>
            </ul>
          </div>
        </div>
      ) : (
        <>
          {/* Best Model Card */}
          <div className="best-model-card">
            <div className="best-model-badge">🏆 Best Model</div>
            <h3>{metrics.bestModel}</h3>
            <p>Selected based on highest F1-Score</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-3">
            <div className="metric-card" style={{background: 'linear-gradient(135deg, #3b82f6, #2563eb)'}}>
              <div className="metric-value">{(metrics.metrics.accuracy * 100).toFixed(2)}%</div>
              <div className="metric-label">Accuracy</div>
            </div>
            <div className="metric-card" style={{background: 'linear-gradient(135deg, #10b981, #059669)'}}>
              <div className="metric-value">{(metrics.metrics.precision * 100).toFixed(2)}%</div>
              <div className="metric-label">Precision</div>
            </div>
            <div className="metric-card" style={{background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
              <div className="metric-value">{(metrics.metrics.recall * 100).toFixed(2)}%</div>
              <div className="metric-label">Recall</div>
            </div>
            <div className="metric-card" style={{background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'}}>
              <div className="metric-value">{(metrics.metrics.f1 * 100).toFixed(2)}%</div>
              <div className="metric-label">F1-Score</div>
            </div>
            <div className="metric-card" style={{background: 'linear-gradient(135deg, #ec4899, #db2777)'}}>
              <div className="metric-value">{(metrics.metrics.roc_auc * 100).toFixed(2)}%</div>
              <div className="metric-label">ROC-AUC</div>
            </div>
          </div>

          {/* Comparison Charts */}
          <div className="grid grid-2">
            <div className="card">
              <h3 className="card-header">Model Comparison - All Metrics</h3>
              <div style={{ position: 'relative', height: '350px' }}>
                <Bar
                  data={{
                    labels: metrics.comparison.map(m => m.model),
                    datasets: [
                      {
                        label: 'Accuracy',
                        data: metrics.comparison.map(m => m.accuracy * 100),
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                      },
                      {
                        label: 'F1-Score',
                        data: metrics.comparison.map(m => m.f1 * 100),
                        backgroundColor: 'rgba(139, 92, 246, 0.7)',
                      },
                      {
                        label: 'ROC-AUC',
                        data: metrics.comparison.map(m => m.roc_auc * 100),
                        backgroundColor: 'rgba(236, 72, 153, 0.7)',
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          callback: function(value) {
                            return value + '%';
                          }
                        }
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="card">
              <h3 className="card-header">F1-Score Distribution</h3>
              <div style={{ position: 'relative', height: '350px' }}>
                <Doughnut
                  data={{
                    labels: metrics.comparison.map(m => m.model),
                    datasets: [
                      {
                        data: metrics.comparison.map(m => m.f1 * 100),
                        backgroundColor: [
                          'rgba(59, 130, 246, 0.8)',
                          'rgba(16, 185, 129, 0.8)',
                          'rgba(245, 158, 11, 0.8)',
                          'rgba(139, 92, 246, 0.8)',
                          'rgba(236, 72, 153, 0.8)',
                        ],
                        borderWidth: 2,
                        borderColor: '#fff',
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return context.label + ': ' + context.parsed.toFixed(2) + '%';
                          }
                        }
                      }
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Detailed Comparison Table */}
          <div className="card">
            <h3 className="card-header">Detailed Model Comparison</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Accuracy</th>
                    <th>Precision</th>
                    <th>Recall</th>
                    <th>F1-Score</th>
                    <th>ROC-AUC</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.comparison.map((model, index) => (
                    <tr key={index} className={model.model === metrics.bestModel ? 'best-row' : ''}>
                      <td>
                        <strong>{model.model}</strong>
                        {model.model === metrics.bestModel && <span className="best-badge">🏆 Best</span>}
                      </td>
                      <td>{(model.accuracy * 100).toFixed(2)}%</td>
                      <td>{(model.precision * 100).toFixed(2)}%</td>
                      <td>{(model.recall * 100).toFixed(2)}%</td>
                      <td><strong>{(model.f1 * 100).toFixed(2)}%</strong></td>
                      <td>{(model.roc_auc * 100).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
