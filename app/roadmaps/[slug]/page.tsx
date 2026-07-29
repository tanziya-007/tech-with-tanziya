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
.roadmap-container { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
.badge { display: inline-block; padding: 8px 16px; background: var(--tag-bg); color: var(--tag-text); border-radius: 50px; font-size: 13px; font-weight: 700; margin-bottom: 16px; border: 1px solid var(--border); transition: all 0.3s ease; }
.roadmap-header { margin-bottom: 36px; animation: fadeUp 0.6s ease-out; }
.roadmap-header h1 { font-size: 2.75rem; margin: 18px 0 12px; font-family: 'Poppins', sans-serif; color: var(--text); transition: color 0.3s ease; }
.roadmap-header p { color: var(--text-secondary); font-size: 1.05rem; line-height: 1.7; transition: color 0.3s ease; }

.image-section { margin-bottom: 40px; border-radius: 20px; overflow: hidden; box-shadow: var(--shadow); background: var(--surface); border: 1px solid var(--border); min-height: 300px; display: flex; align-items: center; justify-content: center; transition: all 0.4s ease; }
.image-section:hover { border-color: var(--primary); box-shadow: var(--shadow-hover); }
.image-section img { width: 100%; height: auto; display: block; }
.no-image { color: var(--text-secondary); text-align: center; padding: 60px 20px; transition: color 0.3s ease; }

.action-buttons { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 40px; }
.button { padding: 14px 32px; border-radius: 12px; font-weight: 600; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); text-decoration: none; border: none; cursor: pointer; font-size: 16px; display: inline-flex; align-items: center; justify-content: center; }
.button-primary { background: var(--gradient); color: white; box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3); }
.button-primary:hover { transform: translateY(-3px) scale(1.02); box-shadow: var(--shadow-hover); }
.button-secondary { border: 2px solid var(--primary); background: transparent; color: var(--text); font-weight: 700; }
.button-secondary:hover { background: var(--surface-alt); transform: translateY(-3px); box-shadow: 0 5px 15px rgba(168, 85, 247, 0.15); }

.back-link { margin-top: 50px; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

@media(max-width: 900px) {
  .roadmap-header h1 { font-size: 2rem; }
  .action-buttons { flex-direction: column; }
  .button { width: 100%; justify-content: center; }
}
`;

export default function RoadmapDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);
  const [folderImages, setFolderImages] = useState<any[]>([]);
  const [folderLoading, setFolderLoading] = useState(false);
  const [folderError, setFolderError] = useState('');

  useEffect(() => {
    fetch(`${API}/roadmaps/${slug}`)
      .then(res => { if (!res.ok) { setNotFoundState(true); return null; } return res.json(); })
      .then(data => { if (data) setRoadmap(data); })
      .catch(() => setNotFoundState(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!roadmap?.googleDriveFolderId) {
      setFolderImages([]);
      setFolderError('');
      return;
    }
    setFolderLoading(true);
    setFolderError('');
    fetch(`${API}/drive/folders/${roadmap.googleDriveFolderId}/images`)
      .then(async res => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Unable to load folder images');
        }
        return res.json();
      })
      .then(data => setFolderImages(data || []))
      .catch(error => {
        setFolderImages([]);
        setFolderError(error.message);
      })
      .finally(() => setFolderLoading(false));
  }, [roadmap?.googleDriveFolderId]);

  if (!loading && notFoundState) notFound();

  return (
    <>
      <style>{styles}</style>
      <main>
        <Navigation />
        <section>
          <div className="container roadmap-container">
            {loading && <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '80px 0' }}>Loading...</p>}
            {!loading && roadmap && (
              <>
                <div className="roadmap-header">
                  <p className="badge">Roadmap</p>
                  <h1>{roadmap.title}</h1>
                  {roadmap.description && <p>{roadmap.description}</p>}
                </div>

                <div className="image-section">
                  {folderLoading ? (
                    <div className="no-image"><p>Loading images from folder...</p></div>
                  ) : folderError ? (
                    <div className="no-image"><p>{folderError}</p></div>
                  ) : folderImages.length ? (
                    <img src={folderImages[0].thumbnailUrl} alt={roadmap.title} />
                  ) : (
                    <div className="no-image"><p>No roadmap image found in folder</p></div>
                  )}
                </div>

                <div className="action-buttons">
                  <Link href="/roadmaps" className="button button-secondary">← Back to Roadmaps</Link>
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