"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const styles = `
.hero {
  padding: 120px 0;
  background: linear-gradient(135deg, var(--bg) 0%, var(--surface-alt) 100%);
  position: relative;
  overflow: hidden;
  transition: background 0.5s ease;
}

.hero::before, .hero::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  z-index: 0;
}

.hero::before {
  top: -50%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%);
}

.hero::after {
  bottom: -30%;
  left: -5%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%);
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
  animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-40px); }
  to { opacity: 1; transform: translateX(0); }
}

.hero-badge {
  display: inline-block;
  padding: 12px 24px;
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
  color: var(--text);
  font-weight: 800;
}

.hero-left p {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 40px;
  max-width: 100%;
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
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.button:hover {
  transform: translateY(-4px) scale(1.03);
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
}

.hero-tech span {
  padding: 8px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50px;
  box-shadow: var(--shadow);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
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
  animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}

/* =========================================
   EDITOR STYLES & TECH ANIMATIONS
========================================= */
.editor {
  width: 100%;
  max-width: 650px;
  background: #0a0512;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  
  /* Subtle "breathing" tech glow on the border */
  border: 1px solid rgba(139, 92, 246, 0.25);
  animation: borderBreathe 4s ease-in-out infinite alternate;
  
  will-change: transform, max-width, height, border-radius;
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: center; 
}

@keyframes borderBreathe {
  0% { border-color: rgba(139, 92, 246, 0.2); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3); }
  100% { border-color: rgba(139, 92, 246, 0.6); box-shadow: 0 25px 60px rgba(139, 92, 246, 0.15); }
}

.editor:not(.closed):not(.minimized):not(.maximized):hover {
  transform: translateY(-5px);
}

.editor.closed {
  max-width: 102px !important;
  height: 50px !important;
  border-radius: 50px !important;
  animation: none; 
}
.editor.closed pre {
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px) scale(0.95);
}

.editor.minimized {
  transform: scale(0.5) !important;
  border-radius: 40px !important;
}

.editor.maximized {
  transform: scale(1.08) !important;
  z-index: 10;
  border-color: var(--primary);
  animation: none; 
}

.editor-top {
  height: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  background: #130a20;
  border-bottom: 1px solid rgba(139, 92, 246, 0.15);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.editor.closed .editor-top {
  border-bottom: 1px solid transparent; 
}

.editor-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: block;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.editor-dot:hover {
  transform: scale(1.25);
  filter: brightness(1.3);
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
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  
  /* FIXED THIS: 380px forces the window to be full size from the start! */
  min-height: 380px; 
}

/* The Blinking Tech Cursor */
.cursor {
  display: inline-block;
  width: 8px;
  height: 18px;
  background-color: var(--primary);
  margin-left: 4px;
  vertical-align: middle;
  animation: blink 1s step-end infinite;
  box-shadow: 0 0 8px var(--primary); 
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.editor pre::-webkit-scrollbar { width: 8px; height: 8px; }
.editor pre::-webkit-scrollbar-track { background: #0a0512; }
.editor pre::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 4px; }

@media (max-width: 900px) {
  .hero-container { grid-template-columns: 1fr; text-align: center; }
  .hero-left { order: 1; }
  .hero-right { order: 2; width: 100%; }
}
@media(max-width: 600px) {
  .editor.maximized { transform: scale(1.05) !important; } 
  .editor pre { min-height: 350px; } /* Slightly smaller for mobile */
}
`;

const technologies = [
  "Quick References",
  "Real Projects",
  "Expert Articles",
  "Career Paths",
  "Best Practices",
];

const fullCodeSnippet = `{
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
  const [isClosed, setIsClosed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayedText(""); 
    
    const typingInterval = setInterval(() => {
      if (i < fullCodeSnippet.length) {
        setDisplayedText(fullCodeSnippet.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 40); 

    return () => clearInterval(typingInterval);
  }, []);

  const handleClose = () => {
    if (isClosed) {
      setIsClosed(false); 
    } else {
      setIsClosed(true);
      setIsMinimized(false);
      setIsMaximized(false);
    }
  };

  const handleMinimize = () => {
    if (isMinimized) {
      setIsMinimized(false); 
    } else {
      setIsMinimized(true);
      setIsClosed(false);
      setIsMaximized(false);
    }
  };

  const handleMaximize = () => {
    if (isMaximized) {
      setIsMaximized(false); 
    } else {
      setIsMaximized(true);
      setIsClosed(false);
      setIsMinimized(false);
    }
  };

  const editorClass = `editor ${isClosed ? "closed" : ""} ${isMinimized ? "minimized" : ""} ${isMaximized ? "maximized" : ""}`;

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
            <div className={editorClass}>
              <div className="editor-top">
                <span className="editor-dot red" onClick={handleClose} title="Close"></span>
                <span className="editor-dot yellow" onClick={handleMinimize} title="Minimize"></span>
                <span className="editor-dot green" onClick={handleMaximize} title="Maximize"></span>
              </div>
              <pre>
                {displayedText}
                <span className="cursor"></span>
              </pre>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}