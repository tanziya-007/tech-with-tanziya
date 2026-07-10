import Link from "next/link";
import Image from "next/image";

const styles = `
.hero {
  padding: 120px 0;
  background: linear-gradient(135deg, #ffffff 0%, #f5f3ff 50%, #f0f9ff 100%);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -5%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
}

.hero-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 80px;
  position: relative;
  z-index: 1;
}

.hero-left {
  animation: slideInLeft 0.8s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.hero-badge {
  display: inline-block;
  padding: 12px 24px;
  background: linear-gradient(135deg, #F3E8FF, #FCE7F3);
  color: #7C3AED;
  border-radius: 50px;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 30px;
  border: 1px solid #E9D5FF;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.1);
}

.hero-left h1 {
  font-size: 4.2rem;
  font-family: Poppins, sans-serif;
  line-height: 1.2;
  margin: 25px 0;
  color: #111827;
  font-weight: 800;
}

.hero-left p {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 40px;
  max-width: 550px;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  margin-bottom: 50px;
  flex-wrap: wrap;
}

.button {
  padding: 14px 32px;
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
  transform: translateY(-4px);
}

.button-primary {
  background: linear-gradient(135deg, #7C3AED, #EC4899);
  color: white;
  box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
}

.button-primary:hover {
  box-shadow: 0 15px 40px rgba(124, 58, 237, 0.4);
}

.button-secondary {
  border: 2px solid #7C3AED;
  background: white;
  color: #7C3AED;
  font-weight: 700;
}

.button-secondary:hover {
  background: #F3E8FF;
}

.hero-tech {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  overflow-x: auto;
}

.hero-tech span {
  padding: 8px 14px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 50px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  font-size: 13px;
  font-weight: 600;
  color: #555;
  transition: 0.3s;
  white-space: nowrap;
}

.hero-tech span:hover {
  border-color: #7C3AED;
  color: #7C3AED;
  box-shadow: 0 8px 25px rgba(124, 58, 237, 0.15);
  transform: translateY(-3px);
}

.hero-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  animation: slideInRight 0.8s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.editor {
  width: 100%;
  background: #0f172a;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(124, 58, 237, 0.2);
  transition: 0.3s;
}

.editor:hover {
  box-shadow: 0 50px 100px rgba(124, 58, 237, 0.25);
  transform: translateY(-5px);
}

.editor-top {
  height: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  background: #1e293b;
  border-bottom: 1px solid rgba(124, 58, 237, 0.1);
}

.editor-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: block;
}

.editor-dot.red { background: #ff5f57; }
.editor-dot.yellow { background: #febc2e; }
.editor-dot.green { background: #28c840; }

.editor pre {
  padding: 30px;
  color: #e0e7ff;
  overflow: auto;
  font-size: 15px;
  line-height: 1.7;
  margin: 0;
  font-family: 'Courier New', monospace;
}

.editor pre::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.editor pre::-webkit-scrollbar-track {
  background: #0f172a;
}

.editor pre::-webkit-scrollbar-thumb {
  background: #7C3AED;
  border-radius: 4px;
}

.hero-logo {
  animation: float 4s ease-in-out infinite;
  filter: drop-shadow(0 20px 40px rgba(124, 58, 237, 0.2));
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@media(max-width: 900px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 50px;
  }

  .hero-left h1 {
    font-size: 2.8rem;
  }

  .hero-left p {
    font-size: 1rem;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .button {
    width: 100%;
  }

  .hero-tech {
    justify-content: center;
  }

  .hero {
    padding: 80px 0;
  }
}

@media(max-width: 600px) {
  .hero-left h1 {
    font-size: 2rem;
  }

  .hero-badge {
    font-size: 12px;
    padding: 10px 18px;
  }

  .button {
    padding: 12px 24px;
    font-size: 15px;
  }

  .editor pre {
    font-size: 13px;
    padding: 20px;
  }
}
`;

const technologies = [
  " Quick References",
  " Real Projects",
  "Expert Articles",
  "Career Paths",
  "Best Practices",
];

const editorDots = [
  { color: "red" },
  { color: "yellow" },
  { color: "green" },
];

const codeSnippet = `{
  "platform": "TechWithTanziya",
  "tagline": "Learn • Code • Grow",
  "mission": "Master programming",
  "resources": [
    "Cheat Sheets",
    "Projects",
    "Blogs",
    "Roadmaps"
  ]
}`;

export default function Hero() {
  return (
    <>
      <style>{styles}</style>
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-left">
            <span className="hero-badge">Learn • Code • Grow</span>

            <h1>
              Learn Programming
              <br />
              One Cheat Sheet
              <br />
              at a Time.
            </h1>

            <p>
              Master programming through
              beginner-friendly cheat sheets, practical projects,
              blogs and learning roadmaps.
            </p>

            <div className="hero-buttons">
              <Link href="/cheatsheets" className="button button-primary">
                Start Learning
              </Link>
              <Link href="/blog" className="button button-secondary">
                Explore Blogs
              </Link>
            </div>

            <div className="hero-tech">
              {technologies.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </div>

          <div className="hero-right">
            <div className="editor">
              <div className="editor-top">
                {editorDots.map((dot) => (
                  <span key={dot.color} className={`editor-dot ${dot.color}`}></span>
                ))}
              </div>
              <pre>{codeSnippet}</pre>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
