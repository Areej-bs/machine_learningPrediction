/**
 * Employee Attrition Prediction - Backend Server
 * 
 * This Express server provides REST API endpoints for:
 * - Training ML models
 * - Making predictions
 * - Retrieving model metrics
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://machine-learningprediction-2.onrender.com',
    /\.onrender\.com$/
  ],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

/**
 * Helper function to execute Python scripts
 * @param {string} scriptName - Name of the Python script
 * @param {Array} args - Arguments to pass to the script
 * @returns {Promise} - Resolves with script output or rejects with error
 */
function runPythonScript(scriptName, args = []) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'ml', scriptName);
    // Use python3 explicitly for better compatibility
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    const python = spawn(pythonCmd, [scriptPath, ...args]);
    
    let dataString = '';
    let errorString = '';

    python.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorString += data.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python script error: ${errorString}`);
        reject(new Error(errorString || 'Python script failed'));
      } else {
        try {
          const result = JSON.parse(dataString);
          resolve(result);
        } catch (e) {
          console.error('Failed to parse Python output:', dataString);
          reject(new Error('Invalid JSON response from Python script'));
        }
      }
    });
  });
}

/**
 * POST /api/train
 * Train all ML models and select the best one
 */
app.post('/api/train', async (req, res) => {
  try {
    console.log('Starting model training...');
    
    // Check if dataset exists
    const dataPath = path.join(__dirname, 'data', 'WA_Fn-UseC_-HR-Employee-Attrition.csv');
    if (!fs.existsSync(dataPath)) {
      return res.status(400).json({
        success: false,
        error: 'Dataset not found. Please place WA_Fn-UseC_-HR-Employee-Attrition.csv in backend/data/ directory'
      });
    }

    const result = await runPythonScript('train.py');
    
    console.log('Training completed successfully');
    console.log(`Best model: ${result.bestModel}`);
    
    res.json({
      success: true,
      message: 'Models trained successfully',
      ...result
    });
  } catch (error) {
    console.error('Training error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to train models'
    });
  }
});

/**
 * POST /api/predict
 * Make prediction for a single employee
 */
app.post('/api/predict', async (req, res) => {
  try {
    const employeeData = req.body;
    
    // Validate input
    if (!employeeData || Object.keys(employeeData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Employee data is required'
      });
    }

    // Check if model exists
    const modelPath = path.join(__dirname, 'models', 'best_model.pkl');
    if (!fs.existsSync(modelPath)) {
      return res.status(400).json({
        success: false,
        error: 'Model not found. Please train the models first using /api/train endpoint'
      });
    }

    console.log('Making prediction for employee data...');
    
    // Pass employee data as JSON string argument
    const result = await runPythonScript('predict.py', [JSON.stringify(employeeData)]);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to make prediction'
    });
  }
});

/**
 * GET /api/metrics
 * Get performance metrics for all models
 */
app.get('/api/metrics', async (req, res) => {
  try {
    const metricsPath = path.join(__dirname, 'models', 'metrics.json');
    
    if (!fs.existsSync(metricsPath)) {
      return res.status(400).json({
        success: false,
        error: 'Metrics not found. Please train the models first using /api/train endpoint'
      });
    }

    const metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
    
    res.json({
      success: true,
      ...metrics
    });
  } catch (error) {
    console.error('Metrics error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve metrics'
    });
  }
});

/**
 * GET /api/feature-importance
 * Get feature importance from the best model
 */
app.get('/api/feature-importance', async (req, res) => {
  try {
    const featurePath = path.join(__dirname, 'models', 'feature_importance.json');
    
    if (!fs.existsSync(featurePath)) {
      return res.status(400).json({
        success: false,
        error: 'Feature importance not found. Please train the models first'
      });
    }

    const featureImportance = JSON.parse(fs.readFileSync(featurePath, 'utf8'));
    
    res.json({
      success: true,
      features: featureImportance
    });
  } catch (error) {
    console.error('Feature importance error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve feature importance'
    });
  }
});

/**
 * POST /api/segment
 * Train clustering model for employee segmentation
 */
app.post('/api/segment', async (req, res) => {
  try {
    console.log('='.repeat(60));
    console.log('Starting clustering model training...');
    console.log('='.repeat(60));
    
    // Check if dataset exists
    const dataPath = path.join(__dirname, 'data', 'WA_Fn-UseC_-HR-Employee-Attrition.csv');
    console.log('Checking dataset at:', dataPath);
    
    if (!fs.existsSync(dataPath)) {
      console.error('Dataset not found at:', dataPath);
      return res.status(400).json({
        success: false,
        error: 'Dataset not found. Please place WA_Fn-UseC_-HR-Employee-Attrition.csv in backend/data/ directory'
      });
    }
    
    console.log('Dataset found. Running cluster.py...');
    const result = await runPythonScript('cluster.py');
    
    console.log('Clustering completed successfully');
    console.log('Result:', JSON.stringify(result, null, 2));
    
    res.json(result);
  } catch (error) {
    console.error('Clustering error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to train clustering model'
    });
  }
});

/**
 * GET /api/clusters
 * Get cluster profiles
 */
app.get('/api/clusters', async (req, res) => {
  try {
    const clusterPath = path.join(__dirname, 'models', 'cluster_profiles.json');
    
    if (!fs.existsSync(clusterPath)) {
      return res.status(400).json({
        success: false,
        error: 'Cluster profiles not found. Please train the clustering model first using /api/segment endpoint'
      });
    }

    const clusters = JSON.parse(fs.readFileSync(clusterPath, 'utf8'));
    
    // Also get metrics if available
    const metricsPath = path.join(__dirname, 'models', 'clustering_metrics.json');
    let metrics = null;
    if (fs.existsSync(metricsPath)) {
      metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
    }
    
    res.json({
      success: true,
      clusters: clusters,
      metrics: metrics
    });
  } catch (error) {
    console.error('Clusters error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve cluster profiles'
    });
  }
});

/**
 * POST /api/recommend
 * Get recommendations for employee retention
 */
app.post('/api/recommend', async (req, res) => {
  try {
    const employeeData = req.body;
    
    // Validate input
    if (!employeeData || Object.keys(employeeData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Employee data is required'
      });
    }

    // For now, return generic recommendations based on common factors
    // This can be enhanced with ML-based recommendations later
    const recommendations = generateRecommendations(employeeData);
    
    res.json({
      success: true,
      recommendations: recommendations
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate recommendations'
    });
  }
});

/**
 * Helper function to generate recommendations
 */
function generateRecommendations(employeeData) {
  const recommendations = [];
  
  // Job Satisfaction
  if (employeeData.JobSatisfaction && employeeData.JobSatisfaction < 3) {
    recommendations.push({
      category: 'Job Satisfaction',
      priority: 'High',
      recommendation: 'Schedule one-on-one meetings to understand concerns and improve job satisfaction',
      impact: 'High'
    });
  }
  
  // Work-Life Balance
  if (employeeData.WorkLifeBalance && employeeData.WorkLifeBalance < 3) {
    recommendations.push({
      category: 'Work-Life Balance',
      priority: 'High',
      recommendation: 'Consider flexible work arrangements or reduced overtime',
      impact: 'High'
    });
  }
  
  // Overtime
  if (employeeData.OverTime === 'Yes') {
    recommendations.push({
      category: 'Overtime',
      priority: 'Medium',
      recommendation: 'Review workload distribution and consider additional resources',
      impact: 'Medium'
    });
  }
  
  // Monthly Income
  if (employeeData.MonthlyIncome && employeeData.MonthlyIncome < 5000) {
    recommendations.push({
      category: 'Compensation',
      priority: 'High',
      recommendation: 'Review compensation package and consider salary adjustment',
      impact: 'High'
    });
  }
  
  // Years Since Last Promotion
  if (employeeData.YearsSinceLastPromotion && employeeData.YearsSinceLastPromotion > 3) {
    recommendations.push({
      category: 'Career Growth',
      priority: 'Medium',
      recommendation: 'Discuss career development opportunities and promotion path',
      impact: 'Medium'
    });
  }
  
  // Environment Satisfaction
  if (employeeData.EnvironmentSatisfaction && employeeData.EnvironmentSatisfaction < 3) {
    recommendations.push({
      category: 'Work Environment',
      priority: 'Medium',
      recommendation: 'Improve workplace conditions and team dynamics',
      impact: 'Medium'
    });
  }
  
  // Training
  if (employeeData.TrainingTimesLastYear && employeeData.TrainingTimesLastYear < 2) {
    recommendations.push({
      category: 'Training & Development',
      priority: 'Low',
      recommendation: 'Provide more training and skill development opportunities',
      impact: 'Medium'
    });
  }
  
  return recommendations;
}

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Employee Attrition Prediction API',
    version: '2.0.0',
    endpoints: {
      train: 'POST /api/train',
      predict: 'POST /api/predict',
      metrics: 'GET /api/metrics',
      featureImportance: 'GET /api/feature-importance',
      segment: 'POST /api/segment',
      clusters: 'GET /api/clusters',
      recommend: 'POST /api/recommend',
      health: 'GET /api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 Employee Attrition Prediction Server');
  console.log('='.repeat(60));
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log('='.repeat(60));
});

module.exports = app;
