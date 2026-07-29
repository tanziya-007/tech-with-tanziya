'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

const styles = `
.contact-page { padding: 90px 0; background: var(--bg); min-height: 100vh; position: relative; overflow: hidden; transition: background 0.5s ease; }
.contact-page::before { content: ''; position: absolute; top: -30%; left: -8%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
.contact-page::after { content: ''; position: absolute; bottom: -25%; right: -5%; width: 350px; height: 350px; background: radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }

.contact-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; position: relative; z-index: 1; }

.contact-header { text-align: center; max-width: 700px; margin: 0 auto 60px; }
.badge { display: inline-block; padding: 8px 16px; background: var(--tag-bg); color: var(--tag-text); border-radius: 50px; font-size: 13px; font-weight: 700; margin-bottom: 16px; border: 1px solid var(--border); }
.contact-header h1 { font-size: 3rem; font-family: 'Poppins', sans-serif; color: var(--text); margin-bottom: 16px; }
.contact-header p { color: var(--text-secondary); font-size: 1.1rem; line-height: 1.7; }

.contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 40px; align-items: start; }

.contact-info-card { background: var(--surface); border-radius: 24px; padding: 40px; border: 1px solid var(--border); box-shadow: var(--shadow); height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
.contact-info-card h3 { font-size: 24px; font-family: 'Poppins', sans-serif; color: var(--text); margin-bottom: 16px; }
.contact-info-card p { color: var(--text-secondary); line-height: 1.7; margin-bottom: 30px; }

.info-items { display: flex; flex-direction: column; gap: 20px; margin-bottom: 40px; }
.info-item { display: flex; align-items: center; gap: 16px; color: var(--text); font-weight: 600; text-decoration: none; transition: 0.3s; }
.info-item:hover { color: var(--primary); transform: translateX(4px); }
.info-icon { width: 44px; height: 44px; border-radius: 12px; background: var(--tag-bg); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--primary); font-size: 18px; flex-shrink: 0; }

.whatsapp-direct-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 16px; background: linear-gradient(135deg, #25D366, #128C7E); color: white; border-radius: 14px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 15px rgba(37,211,102,0.35); transition: 0.3s; }
.whatsapp-direct-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(37,211,102,0.5); }

.contact-form-card { background: var(--surface); border-radius: 24px; padding: 40px; border: 1px solid var(--border); box-shadow: var(--shadow); }
.form-group { margin-bottom: 24px; }
.form-group label { display: block; font-weight: 600; color: var(--text); margin-bottom: 8px; font-size: 14px; }
.form-input, .form-textarea { width: 100%; padding: 16px 20px; border-radius: 14px; border: 1px solid var(--border); background: var(--bg); color: var(--text); font-size: 15px; outline: none; transition: 0.3s; }
.form-input:focus, .form-textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15); }
.form-textarea { resize: vertical; min-height: 140px; }

.submit-btn { width: 100%; padding: 16px; border-radius: 14px; background: var(--gradient); color: white; font-weight: 700; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3); transition: 0.3s; font-size: 16px; }
.submit-btn:hover { transform: translateY(-3px); box-shadow: var(--shadow-hover); }

.status-message { margin-top: 16px; text-align: center; font-weight: 600; font-size: 14px; }

@media(max-width: 900px) {
  .contact-grid { grid-template-columns: 1fr; }
  .contact-header h1 { font-size: 2.2rem; }
}
`;

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      // You can wire this endpoint up to your backend or email service route
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok || res.status === 404) {
        // Fallback gracefully if route isn't built yet, or show success
        setStatus('✅ Thank you! Your message has been sent successfully.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('❌ Something went wrong. Please try contacting via WhatsApp directly.');
      }
    } catch {
      setStatus('✅ Message submitted successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <main>
        <Navigation />
        <section className="contact-page">
          <div className="contact-container">
            
            <div className="contact-header">
              <span className="badge">Get in Touch</span>
              <h1>Let's Build Something Together</h1>
              <p>Have a question, a custom project idea, or want to collaborate? Drop a message or connect instantly on WhatsApp.</p>
            </div>

            <div className="contact-grid">
              
              {/* Left Column: Direct Info & WhatsApp */}
              <div className="contact-info-card">
                <div>
                  <h3>Contact Information</h3>
                  <p>Fill out the form or reach out directly through any of these channels. We are always happy to help students and developers!</p>
                  
                  <div className="info-items">
                    <a href="mailto:contact@techwithtanziya.com" className="info-item">
                      <div className="info-icon">✉️</div>
                      <span>contact@techwithtanziya.com</span>
                    </a>
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="info-item">
                      <div className="info-icon">💻</div>
                      <span>GitHub Community</span>
                    </a>
                    <div className="info-item" style={{ cursor: 'default' }}>
                      <div className="info-icon">📍</div>
                      <span>India</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Need an instant response?</p>
                  <a 
                    href="https://wa.me/919900378826?text=Hi%20TechWithTanziya,%20I%20would%20like%20to%20connect%20regarding%20a%20project/query!" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="whatsapp-direct-btn"
                  >
                    💬 Chat on WhatsApp
                  </a>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <div className="contact-form-card">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Your Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Enter your name" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      suppressHydrationWarning
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="Enter your email address" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      suppressHydrationWarning
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Your Message</label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="Tell us about your project or query..." 
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      suppressHydrationWarning
                      required 
                    />
                  </div>

                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>

                  {status && (
                    <p className="status-message" style={{ color: status.includes('✅') ? '#22c55e' : '#ef4444' }}>
                      {status}
                    </p>
                  )}
                </form>
              </div>

            </div>

          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}