'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const styles = `
.cheatsheet-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 0;
}

.cheatsheet-header {
  max-width: 760px;
  margin-bottom: 36px;
}

.badge {
  display: inline-block;
  padding: 8px 16px;
  background: #EEF2FF;
  color: #6C3BFF;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 16px;
}

.cheatsheet-header h1 {
  font-size: 2.75rem;
  margin: 18px 0 12px;
  font-family: Poppins, sans-serif;
  color: #111827;
}

.cheatsheet-header p {
  color: #6B7280;
  font-size: 1.05rem;
}

.image-section {
  margin-bottom: 40px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  background: #f9fafb;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-section img {
  width: 100%;
  height: auto;
  display: block;
}

.no-image {
  color: #9CA3AF;
  text-align: center;
  padding: 60px 20px;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #6C3BFF, #2D7DFF);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: 0.3s;
  border: none;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 4px 15px rgba(108, 59, 255, 0.3);
}

.download-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(108, 59, 255, 0.4);
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: 0.3s;
}

.card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.card h2 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #111827;
}

.card p {
  color: #6B7280;
  line-height: 1.6;
  margin: 0;
}

.card ul {
  margin: 16px 0 0;
  padding-left: 20px;
  color: #6B7280;
}

.card li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 40px;
}

.button {
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 600;
  transition: 0.3s;
  text-decoration: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.button-primary {
  background: linear-gradient(135deg, #6C3BFF, #2D7DFF);
  color: white;
  box-shadow: 0 4px 15px rgba(108, 59, 255, 0.3);
}

.button-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(108, 59, 255, 0.4);
}

.button-secondary {
  border: 2px solid #6C3BFF;
  background: white;
  color: #6C3BFF;
  font-weight: 700;
}

.button-secondary:hover {
  background: #f5f3ff;
}

.back-link {
  margin-top: 50px;
}

@media(max-width: 900px) {
  .cheatsheet-header h1 {
    font-size: 2rem;
  }

  .section-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .button {
    width: 100%;
  }
}
`;

export default function CheatSheetPage({ params: paramsPromise }: PageProps) {
  const params = use(paramsPromise);
  const [sheet, setSheet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);
  const [driveImages, setDriveImages] = useState<Array<{ id: string; name: string; previewUrl: string; downloadUrl: string }>>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    setLoading(true);
    setNotFoundState(false);
    setDriveImages([]);
    setSelectedImageId(null);

    fetch(`${api}/cheatsheets/${params.slug}`)
      .then(res => {
        if (!res.ok) { setNotFoundState(true); return null; }
        return res.json();
      })
      .then(data => {
        if (data) setSheet(data);
      })
      .catch(() => setNotFoundState(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  useEffect(() => {
    if (!sheet) return;
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    fetch(`${api}/cheatsheets/${params.slug}/drive`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (Array.isArray(data.images) && data.images.length) {
          setDriveImages(data.images);
          setSelectedImageId(data.images[0].id);
        }
      })
      .catch(() => {
        setDriveImages([]);
        setSelectedImageId(null);
      });
  }, [sheet, params.slug]);

  if (!loading && notFoundState) notFound();

  const selectedImage = driveImages.find(img => img.id === selectedImageId) || driveImages[0] || null;
  const previewUrl = selectedImage?.previewUrl ?? null;
  const downloadUrl = selectedImage?.downloadUrl ?? null;

  const handleDownload = () => { if (downloadUrl) window.open(downloadUrl, '_blank'); };

  const handlePrev = () => {
    if (driveImages.length <= 1) return;
    const currentIndex = driveImages.findIndex(img => img.id === selectedImage?.id);
    const prevIndex = currentIndex <= 0 ? driveImages.length - 1 : currentIndex - 1;
    setSelectedImageId(driveImages[prevIndex].id);
  };

  const handleNext = () => {
    if (driveImages.length <= 1) return;
    const currentIndex = driveImages.findIndex(img => img.id === selectedImage?.id);
    const nextIndex = currentIndex === -1 || currentIndex === driveImages.length - 1 ? 0 : currentIndex + 1;
    setSelectedImageId(driveImages[nextIndex].id);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (driveImages.length <= 1) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrev();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [driveImages, selectedImage]);

  return (
    <>
      <style>{styles}</style>
      <main>
        <Navigation />
        <section>
          <div className="container cheatsheet-container">
            <div className="cheatsheet-header">
              <p className="badge">{sheet?.category || 'Cheat Sheet'}</p>
              <h1>{sheet?.title} Cheat Sheet</h1>
              <p>{sheet?.description}</p>
            </div>

            {loading && (
              <div className="image-section">
                <div className="no-image">Loading...</div>
              </div>
            )}

            {!loading && (
              <div>
                <div className="image-section">
                  {previewUrl ? (
                    <iframe
                      src={previewUrl}
                      style={{ width: '100%', minHeight: '500px', border: 'none' }}
                      allow="autoplay"
                    />
                  ) : (
                    <div className="no-image">
                      <p>📋 No cheat sheet uploaded yet</p>
                    </div>
                  )}
                </div>

                {driveImages.length > 1 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '20px' }}>
                    {driveImages.map(image => (
                      <button
                        key={image.id}
                        className={`button button-secondary ${selectedImageId === image.id ? 'selected' : ''}`}
                        type="button"
                        onClick={() => setSelectedImageId(image.id)}
                        style={{ padding: '10px 16px', fontSize: '14px' }}
                      >
                        {image.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {sheet?.topics?.length > 0 || sheet?.interviews?.length > 0 ? (
              <div className="section-grid">
                <article className="card">
                  <h2>Introduction</h2>
                  <p>A focused overview to boost your understanding and help you learn faster.</p>
                </article>
                {sheet.topics?.length > 0 && (
                  <article className="card">
                    <h2>Syntax & Essentials</h2>
                    <p>Key language syntax, structure, and usage guidelines in one place.</p>
                    <ul>
                      {sheet.topics.map((t: string) => <li key={t}>{t}</li>)}
                    </ul>
                  </article>
                )}
                <article className="card">
                  <h2>Examples</h2>
                  <p>Simple code patterns to help you practice and remember the basics.</p>
                </article>
                {sheet.interviews?.length > 0 && (
                  <article className="card">
                    <h2>Interview Questions</h2>
                    <ul>
                      {sheet.interviews.map((q: string) => <li key={q}>{q}</li>)}
                    </ul>
                  </article>
                )}
              </div>
            ) : null}

            <div className="action-buttons">
              {downloadUrl && (
                <button className="button button-primary" onClick={handleDownload}>
                  ⬇️ Download Cheat Sheet
                </button>
              )}
              <button className="button button-secondary">📤 Share</button>
            </div>

            <div className="back-link">
              <Link href="/cheatsheets" className="button button-secondary">
                ← Back to Cheat Sheets
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
