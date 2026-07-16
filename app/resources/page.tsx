'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/SectionHeading';
import { fetchResources } from '@/lib/api';

const styles = `
.resources-page { padding: 90px 0; position: relative; overflow: hidden; }
.resources-page::before { content: ''; position: absolute; top: -40%; left: -5%; width: 350px; height: 350px; background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
.resources-page::after { content: ''; position: absolute; bottom: -20%; right: -8%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }

.resources-grid { display: grid; gap: 25px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); position: relative; z-index: 1; }

.resource-card { background: white; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1); box-shadow: 0 10px 30px rgba(0,0,0,0.04); text-decoration: none; color: inherit; display: flex; flex-direction: column; }
.resource-card::before { content: ''; display: block; height: 4px; background: linear-gradient(90deg, #7C3AED, #EC4899); }
.resource-card:hover { transform: translateY(-10px); box-shadow: 0 20px 45px rgba(124,58,237,0.12); }

.resource-image { width: 100%; height: 180px; object-fit: cover; display: block; background: #f3f4f6; }
.resource-image-placeholder { width: 100%; height: 180px; background: linear-gradient(135deg, #f3e8ff, #fce7f3); display: flex; align-items: center; justify-content: center; font-size: 48px; }

.resource-body { padding: 24px; display: flex; flex-direction: column; flex: 1; }
.resource-tag { display: inline-block; background: linear-gradient(135deg, rgba(124,58,237,0.1), rgba(236,72,153,0.1)); color: #7C3AED; border-radius: 999px; padding: 6px 14px; font-size: 12px; font-weight: 600; border: 1px solid rgba(124,58,237,0.2); margin-bottom: 12px; width: fit-content; }
.resource-title { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 10px; }
.resource-description { color: #6B7280; line-height: 1.7; font-size: 14px; flex: 1; }
.resource-footer { margin-top: 20px; color: #7C3AED; font-weight: 700; font-size: 14px; }

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
            {loading && <p style={{ textAlign: 'center', color: '#9CA3AF' }}>Loading...</p>}
            {!loading && resources.length === 0 && (
              <p style={{ textAlign: 'center', color: '#9CA3AF' }}>No resources added yet.</p>
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
