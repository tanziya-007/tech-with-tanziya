'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { fetchRoadmaps } from "@/lib/api";

const styles = `
@keyframes slideInUp { 
  from { opacity: 0; transform: translateY(30px); } 
  to { opacity: 1; transform: translateY(0); } 
}

.roadmaps-page { 
  padding: 90px 0; 
  position: relative; 
  overflow: hidden; 
  background: var(--bg);
  min-height: 100vh;
  transition: background 0.5s ease;
}

.roadmaps-page::before { content: ''; position: absolute; top: -30%; left: -8%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
.roadmaps-page::after { content: ''; position: absolute; bottom: -25%; right: -5%; width: 350px; height: 350px; background: radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }

.roadmap-grid { display: grid; gap: 30px; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); position: relative; z-index: 1; }

.roadmap-card { display: flex; flex-direction: column; background: var(--surface); border-radius: 20px; overflow: hidden; border: 1px solid var(--border); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: var(--shadow); text-decoration: none; color: inherit; animation: slideInUp 0.6s ease-out backwards; }

.roadmap-card:nth-child(2) { animation-delay: 0.1s; }
.roadmap-card:nth-child(3) { animation-delay: 0.2s; }
.roadmap-card:nth-child(4) { animation-delay: 0.3s; }

.roadmap-card::before { content: ''; display: block; height: 4px; background: var(--gradient); }
.roadmap-card:hover { transform: translateY(-12px); box-shadow: var(--shadow-hover); border-color: var(--primary); }

.roadmap-image { width: 100%; height: 200px; object-fit: cover; display: block; background: var(--surface-alt); }
.roadmap-image-placeholder { width: 100%; height: 200px; background: var(--tag-bg); display: flex; align-items: center; justify-content: center; font-size: 56px; border-bottom: 1px solid var(--border); }

.roadmap-body { padding: 28px; display: flex; flex-direction: column; flex: 1; }
.roadmap-number { font-size: 13px; font-weight: 700; color: var(--primary); letter-spacing: 1px; margin-bottom: 10px; }
.roadmap-body h2 { font-size: 20px; font-weight: 700; color: var(--text); margin-bottom: 10px; transition: color 0.3s ease; }
.roadmap-body p { color: var(--text-secondary); line-height: 1.7; font-size: 14px; flex: 1; transition: color 0.3s ease; }
.roadmap-footer { margin-top: 20px; color: var(--primary); font-weight: 700; font-size: 14px; transition: color 0.3s ease; }
.roadmap-card:hover .roadmap-footer { color: var(--secondary); }

@media (max-width: 600px) {
  .roadmaps-page { padding: 60px 0; }
  .roadmap-grid { grid-template-columns: 1fr; }
}
`;

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoadmaps()
      .then(data => setRoadmaps(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{styles}</style>
      <main>
        <Navigation />
        <section className="roadmaps-page">
          <div className="container">
            <SectionHeading
              title="Learning Roadmaps"
              description="Structured learning paths to help you master programming step by step."
            />
            {loading && <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</p>}
            {!loading && roadmaps.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No roadmaps added yet.</p>
            )}
            <div className="roadmap-grid">
              {roadmaps.map((roadmap, index) => (
                <Link key={roadmap.slug} href={`/roadmaps/${roadmap.slug}`} className="roadmap-card">
                  <div className="roadmap-image-placeholder">🗺️</div>
                  <div className="roadmap-body">
                    <div className="roadmap-number">ROADMAP {String(index + 1).padStart(2, '0')}</div>
                    <h2>{roadmap.title}</h2>
                    <p>{roadmap.description}</p>
                    <div className="roadmap-footer">View Complete Roadmap →</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}