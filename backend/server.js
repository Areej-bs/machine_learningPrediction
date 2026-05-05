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

    console.log('Generating recommendations for employee...');
    
    // Get attrition prediction
    let attritionRisk = { level: 'Unknown', probability: 0 };
    try {
      const modelPath = path.join(__dirname, 'models', 'best_model.pkl');
      if (fs.existsSync(modelPath)) {
        const predictionResult = await runPythonScript('predict.py', [JSON.stringify(employeeData)]);
        attritionRisk = {
          level: predictionResult.riskLevel || 'Unknown',
          probability: predictionResult.probability || 0
        };
      }
    } catch (err) {
      console.log('Could not get attrition prediction:', err.message);
    }
    
    // Get segment information
    let segment = { label: 'Not Segmented', profile: { description: 'Employee segmentation not available' } };
    try {
      const clusterPath = path.join(__dirname, 'models', 'cluster_profiles.json');
      if (fs.existsSync(clusterPath)) {
        const clusters = JSON.parse(fs.readFileSync(clusterPath, 'utf8'));
        // For now, assign to first cluster - this should be enhanced with actual prediction
        if (clusters && clusters.length > 0) {
          segment = {
            label: clusters[0].label,
            profile: {
              description: clusters[0].description
            }
          };
        }
      }
    } catch (err) {
      console.log('Could not get segment information:', err.message);
    }
    
    // Generate insights
    const insights = generateInsights(employeeData, attritionRisk);
    
    // Generate recommendations
    const recommendations = generateDetailedRecommendations(employeeData, attritionRisk);
    
    res.json({
      success: true,
      attritionRisk: attritionRisk,
      segment: segment,
      insights: insights,
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
 * Helper function to generate insights
 */
function generateInsights(employeeData, attritionRisk) {
  const insights = [];
  
  // Risk factors insight
  const riskFactors = [];
  if (employeeData.JobSatisfaction < 3) riskFactors.push('Low job satisfaction');
  if (employeeData.WorkLifeBalance < 3) riskFactors.push('Poor work-life balance');
  if (employeeData.OverTime === 'Yes') riskFactors.push('Frequent overtime');
  if (employeeData.YearsSinceLastPromotion > 3) riskFactors.push('No recent promotion');
  if (employeeData.MonthlyIncome < 5000) riskFactors.push('Below average compensation');
  
  if (riskFactors.length > 0) {
    insights.push({
      title: 'Key Risk Factors',
      content: riskFactors
    });
  }
  
  // Positive factors insight
  const positiveFactors = [];
  if (employeeData.JobSatisfaction >= 3) positiveFactors.push('Good job satisfaction');
  if (employeeData.WorkLifeBalance >= 3) positiveFactors.push('Healthy work-life balance');
  if (employeeData.TrainingTimesLastYear >= 3) positiveFactors.push('Regular training participation');
  if (employeeData.YearsAtCompany >= 5) positiveFactors.push('Long tenure with company');
  
  if (positiveFactors.length > 0) {
    insights.push({
      title: 'Positive Indicators',
      content: positiveFactors
    });
  }
  
  return insights;
}

/**
 * Helper function to generate detailed recommendations
 */
function generateDetailedRecommendations(employeeData, attritionRisk) {
  const recommendations = [];
  
  // Job Satisfaction
  if (employeeData.JobSatisfaction && employeeData.JobSatisfaction < 3) {
    recommendations.push({
      title: 'Improve Job Satisfaction',
      category: 'Engagement',
      priority: 'High',
      description: 'Employee shows low job satisfaction which is a strong predictor of attrition.',
      actions: [
        'Schedule one-on-one meeting to understand concerns',
        'Review current role responsibilities and alignment with skills',
        'Explore opportunities for more meaningful work',
        'Consider job rotation or special projects'
      ]
    });
  }
  
  // Work-Life Balance
  if (employeeData.WorkLifeBalance && employeeData.WorkLifeBalance < 3) {
    recommendations.push({
      title: 'Enhance Work-Life Balance',
      category: 'Well-being',
      priority: 'High',
      description: 'Poor work-life balance can lead to burnout and turnover.',
      actions: [
        'Implement flexible work arrangements',
        'Review workload and redistribute if necessary',
        'Encourage use of vacation days',
        'Promote wellness programs'
      ]
    });
  }
  
  // Overtime
  if (employeeData.OverTime === 'Yes') {
    recommendations.push({
      title: 'Address Overtime Concerns',
      category: 'Workload',
      priority: 'Medium',
      description: 'Frequent overtime may indicate understaffing or inefficient processes.',
      actions: [
        'Analyze workload distribution across team',
        'Consider hiring additional resources',
        'Review and optimize work processes',
        'Set clear boundaries for work hours'
      ]
    });
  }
  
  // Compensation
  if (employeeData.MonthlyIncome && employeeData.MonthlyIncome < 5000) {
    recommendations.push({
      title: 'Review Compensation Package',
      category: 'Compensation',
      priority: 'High',
      description: 'Compensation appears below market average for the role.',
      actions: [
        'Conduct market salary analysis',
        'Consider salary adjustment or bonus',
        'Review benefits package',
        'Discuss performance-based incentives'
      ]
    });
  }
  
  // Career Growth
  if (employeeData.YearsSinceLastPromotion && employeeData.YearsSinceLastPromotion > 3) {
    recommendations.push({
      title: 'Career Development Opportunity',
      category: 'Growth',
      priority: 'Medium',
      description: 'Employee has not been promoted recently, which may affect motivation.',
      actions: [
        'Discuss career goals and aspirations',
        'Create clear promotion pathway',
        'Provide stretch assignments',
        'Offer leadership development programs'
      ]
    });
  }
  
  // Training
  if (employeeData.TrainingTimesLastYear && employeeData.TrainingTimesLastYear < 2) {
    recommendations.push({
      title: 'Increase Training Opportunities',
      category: 'Development',
      priority: 'Low',
      description: 'Limited training may hinder skill development and career growth.',
      actions: [
        'Identify skill gaps and training needs',
        'Enroll in relevant courses or certifications',
        'Provide mentorship opportunities',
        'Allocate budget for professional development'
      ]
    });
  }
  
  // Environment Satisfaction
  if (employeeData.EnvironmentSatisfaction && employeeData.EnvironmentSatisfaction < 3) {
    recommendations.push({
      title: 'Improve Work Environment',
      category: 'Environment',
      priority: 'Medium',
      description: 'Low environment satisfaction affects productivity and retention.',
      actions: [
        'Gather feedback on workplace conditions',
        'Improve physical workspace if needed',
        'Foster positive team culture',
        'Address any interpersonal conflicts'
      ]
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
    timestamp: new Date().toISOString(),
    version: '2.1.0',
    deployedAt: new Date().toISOString()
  });
});

/**
 * GET /api/clusters
 * Get cluster profiles - MOVED HERE FOR TESTING
 */
app.get('/api/clusters', async (req, res) => {
  console.log('='.repeat(60));
  console.log('GET /api/clusters endpoint HIT!');
  console.log('='.repeat(60));
  
  try {
    const clusterPath = path.join(__dirname, 'models', 'cluster_profiles.json');
    console.log('Looking for cluster profiles at:', clusterPath);
    console.log('File exists:', fs.existsSync(clusterPath));
    
    if (!fs.existsSync(clusterPath)) {
      console.log('Cluster profiles not found');
      return res.status(400).json({
        success: false,
        error: 'Cluster profiles not found. Please train the clustering model first using /api/segment endpoint'
      });
    }

    const clusters = JSON.parse(fs.readFileSync(clusterPath, 'utf8'));
    console.log('Clusters loaded successfully, count:', clusters.length);
    
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
 * GET /api/test-clusters
 * Test endpoint to verify routing works
 */
app.get('/api/test-clusters', (req, res) => {
  res.json({
    success: true,
    message: 'Test endpoint works! This means routing is functional.',
    note: 'If this works but /api/clusters does not, there is a specific issue with that route.'
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
    },
    note: 'All endpoints are prefixed with /api except root and health'
  });
});

/**
 * GET /api/status
 * Debug endpoint to check server status
 */
app.get('/api/status', (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    }
  });
  
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    registeredRoutes: routes,
    environment: process.env.NODE_ENV || 'development',
    port: PORT
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

// 404 handler - must be after all routes
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.path}`,
    message: 'Route not found',
    availableEndpoints: {
      train: 'POST /api/train',
      predict: 'POST /api/predict',
      metrics: 'GET /api/metrics',
      featureImportance: 'GET /api/feature-importance',
      segment: 'POST /api/segment',
      clusters: 'GET /api/clusters',
      recommend: 'POST /api/recommend',
      health: 'GET /api/health',
      status: 'GET /api/status'
    }
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
