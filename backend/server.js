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
app.use(cors());
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
    version: '1.0.0',
    endpoints: {
      train: 'POST /api/train',
      predict: 'POST /api/predict',
      metrics: 'GET /api/metrics',
      featureImportance: 'GET /api/feature-importance',
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
