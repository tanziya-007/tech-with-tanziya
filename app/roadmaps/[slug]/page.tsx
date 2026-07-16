'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type PageProps = { params: Promise<{ slug: string }> };

const styles = `
.roadmap-container { max-width: 900px; margin: 0 auto; padding: 40px 0; }
.badge { display: inline-block; padding: 8px 16px; background: #EEF2FF; color: #6C3BFF; border-radius: 50px; font-size: 13px; font-weight: 700; margin-bottom: 16px; }
.roadmap-header { margin-bottom: 36px; }
.roadmap-header h1 { font-size: 2.75rem; margin: 18px 0 12px; font-family: Poppins, sans-serif; color: #111827; }
.roadmap-header p { color: #6B7280; font-size: 1.05rem; line-height: 1.7; }
.image-section { margin-bottom: 40px; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); background: #f9fafb; min-height: 300px; display: flex; align-items: center; justify-content: center; }
.image-section img { width: 100%; height: auto; display: block; }
.no-image { color: #9CA3AF; text-align: center; padding: 60px 20px; }
.action-buttons { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 40px; }
.button { padding: 14px 32px; border-radius: 12px; font-weight: 600; transition: 0.3s; text-decoration: none; border: none; cursor: pointer; font-size: 16px; display: inline-flex; align-items: center; }
.button-primary { background: linear-gradient(135deg, #6C3BFF, #2D7DFF); color: white; box-shadow: 0 4px 15px rgba(108,59,255,0.3); }
.button-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(108,59,255,0.4); }
.button-secondary { border: 2px solid #6C3BFF; background: white; color: #6C3BFF; font-weight: 700; }
.button-secondary:hover { background: #f5f3ff; }
.back-link { margin-top: 50px; }
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
            {loading && <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '80px 0' }}>Loading...</p>}
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
