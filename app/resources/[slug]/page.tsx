'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type PageProps = { params: Promise<{ slug: string }> };

const styles = `
.resource-container { max-width: 900px; margin: 0 auto; padding: 40px 0; }
.badge { display: inline-block; padding: 8px 16px; background: #EEF2FF; color: #6C3BFF; border-radius: 50px; font-size: 13px; font-weight: 700; margin-bottom: 16px; }
.resource-header { margin-bottom: 36px; }
.resource-header h1 { font-size: 2.75rem; margin: 18px 0 12px; font-family: Poppins, sans-serif; color: #111827; }
.resource-header p { color: #6B7280; font-size: 1.05rem; line-height: 1.7; }
.resource-card { margin-bottom: 40px; border-radius: 20px; background: #f9fafb; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #E5E7EB; text-align: center; }
.resource-card p { color: #6B7280; font-size: 1rem; line-height: 1.8; margin: 0; }
.action-buttons { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 40px; justify-content: center; }
.button { padding: 14px 32px; border-radius: 12px; font-weight: 600; transition: 0.3s; text-decoration: none; border: none; cursor: pointer; font-size: 16px; display: inline-flex; align-items: center; justify-content: center; }
.button-primary { background: linear-gradient(135deg, #6C3BFF, #2D7DFF); color: white; box-shadow: 0 4px 15px rgba(108,59,255,0.3); }
.button-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(108,59,255,0.4); }
.button-secondary { border: 2px solid #6C3BFF; background: white; color: #6C3BFF; font-weight: 700; }
.button-secondary:hover { background: #f5f3ff; }
.back-link { margin-top: 50px; }
@media(max-width: 900px) {
  .resource-header h1 { font-size: 2rem; }
  .action-buttons { flex-direction: column; }
  .button { width: 100%; justify-content: center; }
}
`;

export default function ResourceDetailPage({ params: paramsPromise }: PageProps) {
  const params = use(paramsPromise);
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    fetch(`${API}/resources/${params.slug}`)
      .then(res => { if (!res.ok) { setNotFoundState(true); return null; } return res.json(); })
      .then(data => { if (data) setResource(data); })
      .catch(() => setNotFoundState(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (!loading && notFoundState) notFound();

  return (
    <>
      <style>{styles}</style>
      <main>
        <Navigation />
        <section>
          <div className="container resource-container">
            {loading && <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '80px 0' }}>Loading...</p>}
            {!loading && resource && (
              <>
                <div className="resource-header">
                  {resource.tag && <p className="badge">{resource.tag}</p>}
                  <h1>{resource.title}</h1>
                  {resource.description && <p>{resource.description}</p>}
                </div>

                <div className="resource-card">
                  <p>{resource.description}</p>
                </div>

                <div className="action-buttons">
                  {resource.link && (
                    <a href={resource.link} target="_blank" rel="noreferrer" className="button button-primary">
                      🔗 Open Resource
                    </a>
                  )}
                  <Link href="/resources" className="button button-secondary">← Back to Resources</Link>
                </div>
              </>
            )}
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
