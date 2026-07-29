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
.project-container { max-width: 1300px; margin: 0 auto; padding: 40px 20px; }

/* --- Project Details --- */
.project-header { margin-bottom: 36px; animation: fadeUp 0.6s ease-out; }
.badge { display: inline-block; padding: 8px 16px; background: var(--tag-bg); color: var(--tag-text); border-radius: 50px; font-size: 13px; font-weight: 700; margin-bottom: 16px; border: 1px solid var(--border); }
.project-header h1 { font-size: 2.75rem; margin: 18px 0 12px; font-family: 'Poppins', sans-serif; color: var(--text); }
.project-header p { color: var(--text-secondary); font-size: 1.05rem; line-height: 1.7; }

.tech-stack { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 36px; }
.tech-badge { background: var(--surface-alt); color: var(--primary); padding: 10px 18px; border-radius: 12px; font-size: 14px; font-weight: 600; border: 1px solid var(--border); transition: 0.3s; }
.tech-badge:hover { border-color: var(--primary); background: var(--tag-bg); transform: translateY(-2px); }

.screenshots-section { margin-bottom: 40px; }
.screenshots-title { font-size: 20px; font-weight: 700; color: var(--text); margin-bottom: 16px; }
.screenshots-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(480px, 1fr)); gap: 24px; }
.screenshot-card { border-radius: 12px; overflow: hidden; border: 1px solid var(--border); box-shadow: var(--shadow); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); cursor: pointer; background: var(--surface); }
.screenshot-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-hover); border-color: var(--primary); }
.screenshot-card img { width: 100%; height: auto; min-height: 420px; max-height: 600px; object-fit: contain; display: block; background: var(--surface-alt); }

.lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; animation: fadeIn 0.3s ease; }
.lightbox img { max-width: 90vw; max-height: 85vh; border-radius: 12px; object-fit: contain; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
.lightbox-close { position: absolute; top: 20px; right: 28px; color: white; font-size: 40px; cursor: pointer; font-weight: 300; line-height: 1; transition: 0.3s; }
.lightbox-close:hover { color: var(--secondary); transform: scale(1.1); }

.no-screenshots { background: var(--surface-alt); border-radius: 16px; padding: 40px; text-align: center; color: var(--text-secondary); border: 1px solid var(--border); }

/* --- Action Buttons --- */
.action-buttons { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 40px; }
.button { padding: 14px 32px; border-radius: 12px; font-weight: 600; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); text-decoration: none; border: none; cursor: pointer; font-size: 16px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; }
.button-primary { background: var(--gradient); color: white; box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3); }
.button-primary:hover { transform: translateY(-3px) scale(1.02); box-shadow: var(--shadow-hover); }
.button-secondary { border: 2px solid var(--primary); background: transparent; color: var(--text); font-weight: 700; }
.button-secondary:hover { background: var(--surface-alt); box-shadow: 0 5px 15px rgba(168, 85, 247, 0.15); }

/* Premium WhatsApp Button */
.button-whatsapp { background: linear-gradient(135deg, #25D366, #128C7E); color: white; box-shadow: 0 4px 15px rgba(37,211,102,0.35); border: 1px solid rgba(255,255,255,0.1); }
.button-whatsapp:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 10px 25px rgba(37,211,102,0.5); background: linear-gradient(135deg, #22c55e, #0f766e); }
.button-whatsapp svg { width: 20px; height: 20px; fill: currentColor; transition: transform 0.3s ease; }
.button-whatsapp:hover svg { transform: scale(1.1) rotate(-5deg); }

.back-link { margin-top: 50px; }

/* Animations */
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

@media(max-width: 900px) {
  .project-header h1 { font-size: 2rem; }
  .action-buttons { flex-direction: column; }
  .button { width: 100%; justify-content: center; }
  .screenshots-grid { grid-template-columns: 1fr; }
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

            {loading && <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '80px 0' }}>Loading project details...</p>}

            {!loading && project && (
              <>
                <div className="project-header">
                  <p className="badge">Project Details</p>
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
                        <div
                          key={img.id}
                          className="screenshot-card"
                          onClick={() => setLightbox(`${API}/drive/image/${img.id}`)}
                        >
                          <img
                            src={`${API}/drive/image/${img.id}`}
                            alt={img.name}
                          />
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
                  
                  {/* Enhanced WhatsApp Integration */}
                  <a 
                    href={`https://wa.me/919900378826?text=${encodeURIComponent(`Hi TechWithTanziya, I saw your project "${project.title}" and would like to connect!`)}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="button button-whatsapp"
                  >
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                    </svg>
                    Contact on WhatsApp
                  </a>
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