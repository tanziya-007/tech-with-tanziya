import Link from "next/link";

const styles = `
.hero {
  padding: 120px 0;
  /* Updated to use theme variables for a smooth transition */
  background: linear-gradient(135deg, var(--bg) 0%, var(--surface-alt) 100%);
  position: relative;
  overflow: hidden;
  transition: background 0.5s ease;
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 600px;
  height: 600px;
  /* Glow effects adapt slightly but remain vibrant */
  background: radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%);
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
  gap: 80px;
  position: relative;
  z-index: 1;
  width: 100%;
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
  /* Uses the dynamic tag variables from globals.css */
  background: var(--tag-bg);
  color: var(--tag-text);
  border-radius: 50px;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 30px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.hero-left h1 {
  font-size: clamp(2.5rem, 6vw, 4.2rem);
  font-family: Poppins, sans-serif;
  line-height: 1.2;
  margin: 25px 0;
  /* Dynamic text color */
  color: var(--text);
  font-weight: 800;
  transition: color 0.5s ease;
}

.hero-left p {
  font-size: 1.1rem;
  /* Dynamic secondary text color */
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 40px;
  max-width: 100%;
  transition: color 0.5s ease;
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
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.button:hover {
  transform: translateY(-4px) scale(1.02);
}

.button-primary {
  background: var(--gradient);
  color: white;
  box-shadow: 0 10px 30px rgba(168, 85, 247, 0.2);
}

.button-primary:hover {
  box-shadow: var(--shadow-hover);
}

.button-secondary {
  border: 2px solid var(--primary);
  background: transparent;
  color: var(--text);
}

.button-secondary:hover {
  background: var(--surface-alt);
  box-shadow: 0 5px 15px rgba(168, 85, 247, 0.15);
}

.hero-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  overflow: visible;
}

.hero-tech span {
  padding: 8px 14px;
  /* Adapts to light/dark mode surfaces */
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50px;
  box-shadow: var(--shadow);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  white-space: nowrap;
}

.hero-tech span:hover {
  border-color: var(--primary);
  color: var(--primary);
  box-shadow: var(--shadow-hover);
  transform: translateY(-3px);
}

.hero-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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
  max-width: 650px;
  /* Kept permanently dark to mimic a real terminal window */
  background: #0a0512;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 92, 246, 0.25);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.editor:hover {
  box-shadow: 0 30px 60px rgba(147, 51, 234, 0.15);
  transform: translateY(-5px);
  border-color: var(--primary);
}

.editor-top {
  height: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  background: #130a20;
  border-bottom: 1px solid rgba(139, 92, 246, 0.15);
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
  background: #0a0512;
}

.editor pre::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 4px;
}

/* TABLET */
@media (max-width: 900px) {
  .hero {
    padding: 80px 20px;
  }
  .hero-container {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  .hero-left {
    order: 1;
  }
  .hero-right {
    order: 2;
    width: 100%;
  }
  .hero-left h1 {
    line-height: 1.2;
  }
  .hero-left p {
    margin: auto auto 35px;
  }
  .hero-buttons {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .button {
    width: 100%;
  }
  .hero-tech {
    justify-content: center;
  }
  .editor {
    width: 100%;
    max-width: 100%;
  }
}

/* LARGE MOBILE */
@media(max-width: 600px) {
  .hero-left h1 {
    font-size: 2.2rem;
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

/* SMALL MOBILE */
@media (max-width: 480px) {
  .hero {
    padding: 60px 16px;
  }
  .hero-left h1 {
    font-size: 2rem;
  }
  .hero-left p {
    font-size: 15px;
  }
  .hero-badge {
    padding: 8px 18px;
  }
  .editor pre {
    font-size: 12px;
    padding: 18px;
  }
}
`;

const technologies = [
  "Quick References",
  "Real Projects",
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