import React, { useState } from "react";
import { Link } from "react-router-dom";
import './chat.css';

function Chat() {
  const [cv, setCv] = useState<File | null>(null);
  const [skills, setSkills] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCv(e.target.files[0]);
    }
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSkills(e.target.value);
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhatsapp(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!whatsapp && !email) {
      setMessage("Please provide either WhatsApp number or email to receive alerts");
      return;
    }

    if (!cv && !skills) {
      setMessage("Please provide either your CV or list your skills");
      return;
    }

    try {
      setIsLoading(true);
      setMessage(null);

      const formData = new FormData();
      if (cv) {
        formData.append('cv', cv);
      }
      formData.append('skills', skills);
      formData.append('whatsapp', whatsapp);
      formData.append('email', email);

      const response = await fetch("https://workalert.fly.dev/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMessage(data.message);
      // Reset form
      setCv(null);
      setSkills("");
      setWhatsapp("");
      setEmail("");
      
      // Reset file input
      const fileInput = document.getElementById('cv-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to submit form');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <Link to="/" className="back-button">
        <span className="back-icon">←</span>
        Back to Home
      </Link>

      <div className="chat-content">
        <div className="chat-header">
          <h1>Ready to get started?</h1>
          <p>Upload your CV or type your skills or both. We'll do the rest.</p>
        </div>

        <form className="chat-form" onSubmit={handleSubmit}>
          <div className="form-sections">
            <section className="form-section">
              <h2>Upload Your CV</h2>
              <div className="form-group file-upload">
                <label htmlFor="cv-upload">
                  <div className={`upload-area ${cv ? 'has-file' : ''}`}>
                    <span className="upload-icon">{cv ? '✅' : '📄'}</span>
                    <span className="upload-text">
                      {cv ? (
                        <div className="file-info">
                          <span className="file-name">{cv.name}</span>
                          <button 
                            type="button" 
                            className="remove-file"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCv(null);
                              const fileInput = document.getElementById('cv-upload') as HTMLInputElement;
                              if (fileInput) {
                                fileInput.value = '';
                              }
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        "Drop your CV here or click to browse"
                      )}
                    </span>
                  </div>
                  <input
                    id="cv-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCvChange}
                    className="hidden-input"
                  />
                </label>
                <span className="file-types">Accepts PDF, DOC, DOCX (Max 5MB)</span>
              </div>
            </section>
            
            <div className="divider">
              <span>and / or</span>
            </div>

            <section className="form-section">
              <h2>List Your Skills</h2>
              <div className="form-group">
                <textarea
                  id="skills"
                  value={skills}
                  onChange={handleSkillsChange}
                  placeholder="e.g. React, Python, Project Management, Team Leadership..."
                  rows={4}
                />
                <span className="form-help">Separate multiple skills with commas</span>
              </div>
            </section>

            <section className="form-section">
              <h2>How Should We Reach You?</h2>
              <div className="contact-fields">
                <div className="form-group">
                  <label htmlFor="whatsapp">WhatsApp Number</label>
                  <div className="input-icon whatsapp">
                    <input
                      id="whatsapp"
                      type="tel"
                      value={whatsapp}
                      onChange={handleWhatsappChange}
                      placeholder="+1234567890"
                    />
                  </div>
                  <span className="form-help">Include country code</span>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-icon email">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="form-footer">
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Start Getting Job Alerts"}
              <span className="button-icon">→</span>
            </button>
            
            {message && (
              <div className={`message ${message.includes("error") || message.includes("Failed") ? "error" : "success"}`}>
                {message}
              </div>
            )}
          </div>
        </form>
      </div>

      <footer className="chat-footer">
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
        <div className="footer-copyright">
          © 2024 WorkAlert. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Chat;
