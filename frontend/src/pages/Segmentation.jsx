import { useState, useEffect } from 'react';
import { trainClustering, getClusters } from '../services/api';
import './Segmentation.css';

function Segmentation() {
  const [loading, setLoading] = useState(false);
  const [training, setTraining] = useState(false);
  const [clusters, setClusters] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadClusters();
  }, []);

  const loadClusters = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getClusters();
      setClusters(data.clusters || []);
      setMetrics(data.metrics || null);
    } catch (err) {
      console.log('No clusters found yet');
    } finally {
      setLoading(false);
    }
  };

  const handleTrain = async () => {
    try {
      setTraining(true);
      setError('');
      const result = await trainClustering();
      setClusters(result.clusters || []);
      setMetrics(result.metrics || null);
      alert('Clustering model trained successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to train clustering model');
    } finally {
      setTraining(false);
    }
  };

  const getRiskColor = (rate) => {
    if (rate > 25) return '#ef4444';
    if (rate > 15) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="segmentation-page">
      <div className="page-header">
        <h1>Employee Segmentation</h1>
        <p>Cluster analysis to identify employee groups</p>
      </div>

      <div className="action-section">
        <button 
          onClick={handleTrain} 
          disabled={training}
          className="train-button"
        >
          {training ? 'Training Model...' : 'Train Clustering Model'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {metrics && (
        <div className="metrics-card">
          <h2>Clustering Metrics</h2>
          <div className="metrics-grid">
            <div className="metric-item">
              <span className="metric-label">Number of Clusters</span>
              <span className="metric-value">{metrics.n_clusters}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Silhouette Score</span>
              <span className="metric-value">{metrics.silhouette_score?.toFixed(3)}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Davies-Bouldin Score</span>
              <span className="metric-value">{metrics.davies_bouldin_score?.toFixed(3)}</span>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading clusters...</div>
      ) : clusters.length > 0 ? (
        <div className="clusters-grid">
          {clusters.map((cluster) => (
            <div key={cluster.clusterId} className="cluster-card">
              <div className="cluster-header">
                <h3>{cluster.label}</h3>
                <span className="cluster-badge">Cluster {cluster.clusterId}</span>
              </div>
              
              <p className="cluster-description">{cluster.description}</p>
              
              <div className="cluster-stats">
                <div className="stat-row">
                  <span className="stat-label">Size:</span>
                  <span className="stat-value">{cluster.size} employees ({cluster.percentage.toFixed(1)}%)</span>
                </div>
                
                <div className="stat-row">
                  <span className="stat-label">Attrition Rate:</span>
                  <span 
                    className="stat-value" 
                    style={{ color: getRiskColor(cluster.characteristics.attritionRate) }}
                  >
                    {cluster.characteristics.attritionRate.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="cluster-characteristics">
                <h4>Average Characteristics</h4>
                <div className="char-grid">
                  <div className="char-item">
                    <span className="char-label">Age</span>
                    <span className="char-value">{cluster.characteristics.avgAge.toFixed(1)}</span>
                  </div>
                  <div className="char-item">
                    <span className="char-label">Income</span>
                    <span className="char-value">${cluster.characteristics.avgIncome.toFixed(0)}</span>
                  </div>
                  <div className="char-item">
                    <span className="char-label">Tenure</span>
                    <span className="char-value">{cluster.characteristics.avgYearsAtCompany.toFixed(1)} yrs</span>
                  </div>
                  <div className="char-item">
                    <span className="char-label">Job Satisfaction</span>
                    <span className="char-value">{cluster.characteristics.avgJobSatisfaction.toFixed(1)}/4</span>
                  </div>
                  <div className="char-item">
                    <span className="char-label">Work-Life Balance</span>
                    <span className="char-value">{cluster.characteristics.avgWorkLifeBalance.toFixed(1)}/4</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No clusters available. Train the clustering model to get started.</p>
        </div>
      )}
    </div>
  );
}

export default Segmentation;
