import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import ModelInfo from './pages/ModelInfo';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="container">
            <div className="nav-content">
              <div className="nav-brand">
                <h1>🎯 Employee Attrition Prediction</h1>
              </div>
              <div className="nav-links">
                <Link to="/" className="nav-link">Dashboard</Link>
                <Link to="/predict" className="nav-link">Prediction</Link>
                <Link to="/model-info" className="nav-link">Model Info</Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/predict" element={<Prediction />} />
              <Route path="/model-info" element={<ModelInfo />} />
            </Routes>
          </div>
        </main>

        <footer className="footer">
          <div className="container">
            <p>© 2026 Employee Attrition Prediction System | Built with React, Node.js & Python ML</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
