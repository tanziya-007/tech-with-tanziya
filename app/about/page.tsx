import Image from "next/image";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

const styles = `
.about-hero { 
  padding: 120px 0; 
  background: linear-gradient(135deg, #f5f3ff 0%, #eef5ff 100%);
  position: relative;
  overflow: hidden;
}

.about-hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(108, 59, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.about-container { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  align-items: center; 
  gap: 80px;
  position: relative;
  z-index: 1;
}

.about-image { 
  display: flex; 
  justify-content: center;
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.about-content h1 { 
  font-size: 3.8rem; 
  font-family: Poppins, sans-serif; 
  margin: 20px 0;
  line-height: 1.2;
  background: linear-gradient(135deg, #6C3BFF, #2D7DFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.about-content span { 
  color: #6C3BFF; 
  font-weight: 700;
}

.about-content p { 
  color: #666; 
  line-height: 1.8; 
  font-size: 18px; 
  margin-bottom: 20px;
}

.about-badge { 
  background: linear-gradient(135deg, #EEF2FF, #F0E7FF);
  padding: 12px 24px; 
  border-radius: 50px; 
  display: inline-block; 
  color: #6C3BFF; 
  font-weight: 700;
  font-size: 14px;
  border: 1px solid #E0D4FF;
}

.about-buttons { 
  display: flex; 
  gap: 20px; 
  margin-top: 40px;
}

.about-section { 
  padding: 100px 0; 
}

.about-card { 
  background: white; 
  padding: 50px; 
  border-radius: 24px; 
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: 0.3s;
}

.about-card:hover {
  box-shadow: 0 30px 80px rgba(108, 59, 255, 0.12);
  transform: translateY(-5px);
}

.about-card h2 {
  font-size: 28px;
  font-family: Poppins, sans-serif;
  margin-bottom: 20px;
  color: #111827;
}

.center-title { 
  text-align: center; 
  font-size: 3.2rem; 
  margin-bottom: 70px; 
  font-family: Poppins, sans-serif;
  color: #111827;
}

.skills-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); 
  gap: 30px;
}

.skill-card { 
  background: linear-gradient(135deg, #ffffff 0%, #f9f7ff 100%);
  padding: 40px; 
  border-radius: 24px; 
  text-align: center; 
  font-size: 60px; 
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.06);
  transition: 0.4s;
  border: 1px solid #f0e7ff;
  cursor: pointer;
}

.skill-card:hover { 
  transform: translateY(-15px) scale(1.05);
  box-shadow: 0 30px 70px rgba(108, 59, 255, 0.2);
  background: linear-gradient(135deg, #f5f3ff 0%, #eef5ff 100%);
}

.skill-card h3 { 
  margin-top: 20px; 
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

.timeline { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
  gap: 30px;
}

.timeline-card { 
  padding: 40px; 
  background: linear-gradient(135deg, #ffffff 0%, #f9f7ff 100%);
  border-radius: 24px; 
  text-align: center; 
  font-size: 50px; 
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.06);
  transition: 0.4s;
  border: 1px solid #f0e7ff;
  position: relative;
}

.timeline-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #6C3BFF, #2D7DFF);
  border-radius: 24px 24px 0 0;
}

.timeline-card:hover { 
  transform: translateY(-15px);
  box-shadow: 0 30px 70px rgba(108, 59, 255, 0.2);
}

.timeline-card h3 { 
  margin-top: 20px; 
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

.about-stats { 
  padding: 100px 0; 
  background: linear-gradient(135deg, #6C3BFF 0%, #2D7DFF 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.about-stats::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.stats-grid div h2 {
  font-size: 3.5rem;
  font-family: Poppins, sans-serif;
  margin-bottom: 10px;
  font-weight: 800;
}

.stats-grid div p {
  font-size: 16px;
  opacity: 0.9;
  font-weight: 500;
}

@media(max-width: 900px) {
  .about-container { 
    grid-template-columns: 1fr; 
    text-align: center;
    gap: 50px;
  }
  
  .about-content h1 { 
    font-size: 2.8rem; 
  }
  
  .about-buttons { 
    justify-content: center; 
  }

  .center-title {
    font-size: 2.5rem;
  }

  .skills-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }

  .stats-grid div h2 {
    font-size: 2.5rem;
  }
}

@media(max-width: 600px) {
  .about-hero {
    padding: 80px 0;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .about-content h1 {
    font-size: 2rem;
  }
}
`;

export default function AboutPage() {
  return (
    <>
      <style>{styles}</style>
      <main>
        <Navigation />

        <section className="about-hero">
          <div className="container about-container">
            <div className="about-image">
              <Image src="/logo.png" alt="TechWithTanziya" width={320} height={320} />
            </div>

            <div className="about-content">
              <span className="about-badge">About Me</span>
              <h1>Hi, I'm <span>Tech WithTanziya</span></h1>
              <p>I'm an MCA Graduate and passionate software developer who loves simplifying programming concepts for students.</p>
              <p>Through <strong>TechWithTanziya</strong>, I create beginner-friendly cheat sheets, blogs, projects, roadmaps and practical coding tutorials to help learners grow with confidence.</p>
              <div className="about-buttons">
                <a href="https://github.com" target="_blank" className="button button-primary">GitHub</a>
                <a href="https://linkedin.com" target="_blank" className="button button-secondary">LinkedIn</a>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="container">
            <div className="about-card">
              <h2>My Mission</h2>
              <p>My mission is to make programming easy, practical and enjoyable for every student. I believe that anyone can learn to code with the right guidance and consistent practice.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="container">
            <h2 className="center-title">What You'll Learn</h2>
            <div className="skills-grid">
              <div className="skill-card">☕<h3>Java</h3></div>
              <div className="skill-card">🐍<h3>Python</h3></div>
              <div className="skill-card">🌐<h3>Web Development</h3></div>
              <div className="skill-card">🗄️<h3>SQL</h3></div>
              <div className="skill-card">⚛️<h3>React</h3></div>
              <div className="skill-card">🚀<h3>Next.js</h3></div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="container">
            <h2 className="center-title">My Journey</h2>
            <div className="timeline">
              <div className="timeline-card"><h3>BCA Graduate</h3></div>
              <div className="timeline-card"><h3>MCA Student</h3></div>
              <div className="timeline-card"><h3>Built Real Projects</h3></div>
              <div className="timeline-card"><h3>Started TechWithTanziya</h3></div>
            </div>
          </div>
        </section>

        <section className="about-stats">
          <div className="container stats-grid">
            <div><h2>100+</h2><p>Cheat Sheets</p></div>
            <div><h2>50+</h2><p>Blogs</p></div>
            <div><h2>25+</h2><p>Projects</p></div>
            <div><h2>1000+</h2><p>Community Members</p></div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
