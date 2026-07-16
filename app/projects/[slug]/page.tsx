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
.project-container { max-width: 900px; margin: 0 auto; padding: 40px 0; }

.project-header { margin-bottom: 36px; }
.badge { display: inline-block; padding: 8px 16px; background: #EEF2FF; color: #6C3BFF; border-radius: 50px; font-size: 13px; font-weight: 700; margin-bottom: 16px; }
.project-header h1 { font-size: 2.75rem; margin: 18px 0 12px; font-family: Poppins, sans-serif; color: #111827; }
.project-header p { color: #6B7280; font-size: 1.05rem; line-height: 1.7; }

.tech-stack { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 36px; }
.tech-badge { background: linear-gradient(135deg, rgba(108,59,255,0.1), rgba(45,125,255,0.1)); color: #6C3BFF; padding: 10px 18px; border-radius: 12px; font-size: 14px; font-weight: 600; border: 1px solid rgba(108,59,255,0.2); }

.screenshots-section { margin-bottom: 40px; }
.screenshots-title { font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 16px; }
.screenshots-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.screenshot-card { border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.06); transition: 0.3s; cursor: pointer; }
.screenshot-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(124,58,237,0.15); border-color: #7C3AED; }
.screenshot-card img { width: 100%; height: 180px; object-fit: cover; display: block; }

.lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.lightbox img { max-width: 90vw; max-height: 85vh; border-radius: 12px; object-fit: contain; }
.lightbox-close { position: absolute; top: 20px; right: 28px; color: white; font-size: 36px; cursor: pointer; font-weight: 300; line-height: 1; }

.no-screenshots { background: #f9fafb; border-radius: 16px; padding: 40px; text-align: center; color: #9CA3AF; border: 1px solid #e5e7eb; }

.action-buttons { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 40px; }
.button { padding: 14px 32px; border-radius: 12px; font-weight: 600; transition: 0.3s; text-decoration: none; border: none; cursor: pointer; font-size: 16px; display: inline-flex; align-items: center; }
.button-primary { background: linear-gradient(135deg, #6C3BFF, #2D7DFF); color: white; box-shadow: 0 4px 15px rgba(108,59,255,0.3); }
.button-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(108,59,255,0.4); }
.button-secondary { border: 2px solid #6C3BFF; background: white; color: #6C3BFF; font-weight: 700; }
.button-secondary:hover { background: #f5f3ff; }
.back-link { margin-top: 50px; }

@media(max-width: 900px) {
  .project-header h1 { font-size: 2rem; }
  .action-buttons { flex-direction: column; }
  .button { width: 100%; justify-content: center; }
}
`;

export default function ProjectDetailPage({ params: paramsPromise }: PageProps) {
  const params = use(paramsPromise);
  const [project, setProject] = useState<any>(null);
  const [screenshots, setScreenshots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    fetch(`${API}/projects/${params.slug}`)
      .then(res => { if (!res.ok) { setNotFoundState(true); return null; } return res.json(); })
      .then(async data => {
        if (!data) return;
        setProject(data);
        if (data.googleDriveFolderId) {
          try {
            const res = await fetch(`${API}/drive/folders/${data.googleDriveFolderId}/images`);
            if (res.ok) setScreenshots(await res.json());
          } catch {}
        }
      })
      .catch(() => setNotFoundState(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (!loading && notFoundState) notFound();

  return (
    <>
      <style>{styles}</style>
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <span className="lightbox-close">×</span>
          <img src={lightbox} alt="Screenshot" onClick={e => e.stopPropagation()} />
        </div>
      )}
      <main>
        <Navigation />
        <section>
          <div className="container project-container">
            {loading && <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '80px 0' }}>Loading...</p>}

            {!loading && project && (
              <>
                <div className="project-header">
                  <p className="badge">Project</p>
                  <h1>{project.title}</h1>
                  {project.description && <p>{project.description}</p>}
                </div>

                {(project.tech || []).length > 0 && (
                  <div className="tech-stack">
                    {project.tech.map((t: string) => <span key={t} className="tech-badge">{t}</span>)}
                  </div>
                )}

                <div className="screenshots-section">
                  <h2 className="screenshots-title">Screenshots</h2>
                  {screenshots.length > 0 ? (
                    <div className="screenshots-grid">
                      {screenshots.map(img => (
                        <div key={img.id} className="screenshot-card" onClick={() => setLightbox(`http://localhost:5000/api/drive/image/${img.id}`)}>
                          <img src={`http://localhost:5000/api/drive/image/${img.id}`} alt={img.name} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-screenshots">
                      <p>No screenshots added yet</p>
                    </div>
                  )}
                </div>

                <div className="action-buttons">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer" className="button button-primary">View on GitHub</a>
                  )}
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noreferrer" className="button button-secondary">Live Demo</a>
                  )}
                </div>

                <div className="back-link">
                  <Link href="/projects" className="button button-secondary">← Back to Projects</Link>
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
