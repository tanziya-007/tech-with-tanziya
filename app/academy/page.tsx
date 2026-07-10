import { Navigation } from '../../components/layout/Navigation';
import { Footer } from '../../components/layout/Footer';

const styles = `
.academy-section { background: linear-gradient(135deg, rgba(108, 59, 255, 0.12), rgba(45, 125, 255, 0.14)); padding: 120px 0; }
.academy-container { text-align: center; max-width: 720px; }
.badge { display: inline-block; background: #EEF2FF; padding: 10px 18px; border-radius: 999px; color: #6C3BFF; font-weight: 700; font-size: 13px; margin-bottom: 20px; }
.academy-title { margin: 24px 0 20px; font-size: 3rem; font-family: Poppins, sans-serif; }
.academy-description { color: var(--muted); font-size: 1.05rem; }
`;

export default function AcademyPage() {
  return (
    <>
      <style>{styles}</style>
      <main>
        <Navigation />
        <section className="academy-section">
          <div className="container academy-container">
            <span className="badge">Coming Soon</span>
            <h1 className="academy-title">Academy is on the way</h1>
            <p className="academy-description">A full learning platform for structured courses, projects, and community support. Launching soon at <strong>academy.techwithtanziya.com</strong>.</p>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
