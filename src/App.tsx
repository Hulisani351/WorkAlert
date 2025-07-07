import React from "react";
import { Link } from "react-router-dom";
import './landing.css';

function App() {
  return (
    <div className="landing-container">
      <div className="hero-wrapper">
        <header className="hero-section">
          <div className="hero-content">
            <h1>
              <span className="hero-highlight">Never Miss</span>
              <br />Your Dream Job Again
            </h1>
            <p className="hero-text">
              Get personalized job alerts delivered straight to your WhatsApp and email. 
              Our AI matches your CV with the perfect opportunities.
            </p>
            
            <Link to="/chat" className="cta-button">
              Get Started - It's Free
              <span className="button-icon">→</span>
            </Link>

            <div className="stats-bar">
              <div className="stat">
                <span className="stat-number">10k+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat">
                <span className="stat-number">98%</span>
                <span className="stat-label">Match Accuracy</span>
              </div>
              <div className="stat">
                <span className="stat-number">24h</span>
                <span className="stat-label">Alert Speed</span>
              </div>
            </div>
          </div>

          <div className="benefits-section">
            <div className="benefits-grid">
              <div className="benefit-item">
                <span className="benefit-icon">📅</span>
                <h3>Up to 3 smart job alerts weekly</h3>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">📱</span>
                <h3>Alerts via Email or WhatsApp</h3>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🎯</span>
                <h3>Matched to your CV or skills</h3>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">✨</span>
                <h3>100% free — no gimmicks</h3>
              </div>
            </div>
          </div>
        </header>
      </div>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-icon">📄</div>
            <h3>Share Your Profile</h3>
            <p>Upload your CV or list your key skills - it takes less than 2 minutes</p>
          </div>
          <div className="step">
            <div className="step-icon">🎯</div>
            <h3>Smart Matching</h3>
            <p>Our AI finds relevant jobs matching your experience and aspirations</p>
          </div>
          <div className="step">
            <div className="step-icon">📱</div>
            <h3>Instant Alerts</h3>
            <p>Get notified instantly when your dream job is posted</p>
          </div>
        </div>
      </section>

      <section className="trust-bar">
        <p>Trusted by professionals from</p>
        <div className="company-logos">
          <div className="company">Google</div>
          <div className="company">Microsoft</div>
          <div className="company">Amazon</div>
          <div className="company">Meta</div>
        </div>
      </section>

      <footer>
        <div className="footer-content">
          <p>© 2025 Job Alert App. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;