'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { fetchRoadmaps } from "@/lib/api";

const styles = `
.roadmaps-page { padding: 90px 0; position: relative; overflow: hidden; }
.roadmaps-page::before { content: ''; position: absolute; top: -30%; left: -8%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
.roadmaps-page::after { content: ''; position: absolute; bottom: -25%; right: -5%; width: 350px; height: 350px; background: radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }

.roadmap-grid { display: grid; gap: 30px; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); position: relative; z-index: 1; }

.roadmap-card { display: flex; flex-direction: column; background: white; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1); box-shadow: 0 10px 30px rgba(0,0,0,0.04); text-decoration: none; color: inherit; }
.roadmap-card::before { content: ''; display: block; height: 4px; background: linear-gradient(90deg, #7C3AED, #EC4899); }
.roadmap-card:hover { transform: translateY(-12px); box-shadow: 0 25px 50px rgba(124,58,237,0.15); }

.roadmap-image { width: 100%; height: 200px; object-fit: cover; display: block; background: #f3f4f6; }
.roadmap-image-placeholder { width: 100%; height: 200px; background: linear-gradient(135deg, #f3e8ff, #fce7f3); display: flex; align-items: center; justify-content: center; font-size: 56px; }

.roadmap-body { padding: 28px; display: flex; flex-direction: column; flex: 1; }
.roadmap-number { font-size: 13px; font-weight: 700; color: #7C3AED; letter-spacing: 1px; margin-bottom: 10px; }
.roadmap-body h2 { font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 10px; }
.roadmap-body p { color: #6B7280; line-height: 1.7; font-size: 14px; flex: 1; }
.roadmap-footer { margin-top: 20px; color: #7C3AED; font-weight: 700; font-size: 14px; }

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
            {loading && <p style={{ textAlign: 'center', color: '#9CA3AF' }}>Loading...</p>}
            {!loading && roadmaps.length === 0 && (
              <p style={{ textAlign: 'center', color: '#9CA3AF' }}>No roadmaps added yet.</p>
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
