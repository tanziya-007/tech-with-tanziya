import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/SectionHeading';

const styles = `
.contact-section { 
  padding: 100px 0;
  background: linear-gradient(180deg, #ffffff 0%, #f9f7ff 100%);
}

.contact-container { 
  max-width: 760px;
}

.contact-form { 
  display: grid; 
  gap: 24px;
}

.form-label { 
  display: block; 
  margin-bottom: 10px; 
  font-weight: 600; 
  color: #111827;
  font-size: 15px;
}

.form-input, .form-textarea { 
  width: 100%; 
  border-radius: 16px; 
  padding: 14px 18px; 
  border: 1px solid #e5e7eb;
  background: white;
  font-family: inherit; 
  font-size: 16px; 
  transition: 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.form-input:focus, .form-textarea:focus { 
  outline: none; 
  border-color: #6C3BFF;
  box-shadow: 0 0 0 4px rgba(108, 59, 255, 0.1);
  background: linear-gradient(135deg, #ffffff 0%, #f9f7ff 100%);
}

.form-input::placeholder, .form-textarea::placeholder {
  color: #999;
}

.card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  transition: 0.3s;
}

.card:hover {
  box-shadow: 0 25px 60px rgba(108, 59, 255, 0.12);
  transform: translateY(-5px);
}

.button {
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  transition: 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.button:hover {
  transform: translateY(-3px);
}

.button-primary {
  background: linear-gradient(135deg, #6C3BFF, #2D7DFF);
  color: white;
  box-shadow: 0 8px 20px rgba(108, 59, 255, 0.3);
  width: 100%;
}

.button-primary:hover {
  box-shadow: 0 12px 30px rgba(108, 59, 255, 0.4);
}

.contact-info { 
  margin-top: 50px; 
  display: grid; 
  gap: 18px;
  background: linear-gradient(135deg, #f5f3ff 0%, #eef5ff 100%);
  padding: 30px;
  border-radius: 20px;
  border: 1px solid #e0d4ff;
}

.contact-info p { 
  margin: 0; 
  color: #6B7280;
  font-size: 15px;
}

.contact-info strong { 
  color: #111827;
  font-weight: 700;
}

@media(max-width: 768px) {
  .contact-section {
    padding: 80px 0;
  }

  .card {
    padding: 30px;
  }

  .form-input, .form-textarea {
    padding: 12px 16px;
    font-size: 15px;
  }

  .contact-info {
    padding: 20px;
  }
}
`;

export default function ContactPage() {
  return (
    <>
      <style>{styles}</style>
      <main>
        <Navigation />
        <section className="contact-section">
          <div className="container contact-container">
            <SectionHeading title="Contact" description="Send a message or connect on social channels." />
            <div className="card">
              <form className="contact-form">
                <label>
                  <span className="form-label">Name</span>
                  <input type="text" placeholder="Your name" className="form-input" />
                </label>
                <label>
                  <span className="form-label">Email</span>
                  <input type="email" placeholder="you@example.com" className="form-input" />
                </label>
                <label>
                  <span className="form-label">Subject</span>
                  <input type="text" placeholder="What would you like to discuss?" className="form-input" />
                </label>
                <label>
                  <span className="form-label">Message</span>
                  <textarea rows={6} placeholder="Write your message here" className="form-textarea" />
                </label>
                <button type="submit" className="button button-primary">Send Message</button>
              </form>
            </div>
            <div className="contact-info">
              <p>Connect directly:</p>
              <p><strong>LinkedIn</strong> • <strong>Instagram</strong> • <strong>GitHub</strong> • <strong>Email</strong></p>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
