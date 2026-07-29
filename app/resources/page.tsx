'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { fetchResources } from "@/lib/api";

const styles = `
@keyframes slideInUp { 
  from { opacity: 0; transform: translateY(30px); } 
  to { opacity: 1; transform: translateY(0); } 
}

.resources-page { 
  padding: 90px 0; 
  position: relative; 
  overflow: hidden; 
  background: var(--bg);
  min-height: 100vh;
  transition: background 0.5s ease;
}

.resources-page::before { content: ''; position: absolute; top: -40%; left: -5%; width: 350px; height: 350px; background: radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
.resources-page::after { content: ''; position: absolute; bottom: -20%; right: -8%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }

.resources-grid { display: grid; gap: 25px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); position: relative; z-index: 1; }

.resource-card { background: var(--surface); border-radius: 20px; overflow: hidden; border: 1px solid var(--border); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: var(--shadow); text-decoration: none; color: inherit; display: flex; flex-direction: column; animation: slideInUp 0.6s ease-out backwards; }

.resource-card:nth-child(2) { animation-delay: 0.1s; }
.resource-card:nth-child(3) { animation-delay: 0.2s; }
.resource-card:nth-child(4) { animation-delay: 0.3s; }

.resource-card::before { content: ''; display: block; height: 4px; background: var(--gradient); }
.resource-card:hover { transform: translateY(-10px); box-shadow: var(--shadow-hover); border-color: var(--primary); }

.resource-image { width: 100%; height: 180px; object-fit: cover; display: block; background: var(--surface-alt); }
.resource-image-placeholder { width: 100%; height: 180px; background: var(--tag-bg); display: flex; align-items: center; justify-content: center; font-size: 48px; }

.resource-body { padding: 24px; display: flex; flex-direction: column; flex: 1; }
.resource-tag { display: inline-block; background: var(--tag-bg); color: var(--tag-text); border-radius: 999px; padding: 6px 14px; font-size: 12px; font-weight: 600; border: 1px solid var(--border); margin-bottom: 12px; width: fit-content; transition: all 0.3s ease; }
.resource-card:hover .resource-tag { border-color: var(--primary); }

.resource-title { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 10px; transition: color 0.3s ease; }
.resource-description { color: var(--text-secondary); line-height: 1.7; font-size: 14px; flex: 1; transition: color 0.3s ease; }
.resource-footer { margin-top: 20px; color: var(--primary); font-weight: 700; font-size: 14px; transition: color 0.3s ease; }
.resource-card:hover .resource-footer { color: var(--secondary); }

@media (max-width: 600px) {
  .resources-page { padding: 60px 0; }
  .resources-grid { grid-template-columns: 1fr; }
}
`;

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources()
      .then(data => setResources(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{styles}</style>
      <main>
        <Navigation />
        <section className="resources-page">
          <div className="container">
            <SectionHeading title="Resources" description="Helpful files, guides, and study tools for the learning journey." />
            {loading && <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</p>}
            {!loading && resources.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No resources added yet.</p>
            )}
            <div className="resources-grid">
              {resources.map(r => (
                <Link key={r.slug} href={`/resources/${r.slug}`} className="resource-card">
                  <div className="resource-body">
                    {r.tag && <span className="resource-tag">{r.tag}</span>}
                    <h3 className="resource-title">{r.title}</h3>
                    {r.description && <p className="resource-description">{r.description}</p>}
                    <div className="resource-footer">View Resource →</div>
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