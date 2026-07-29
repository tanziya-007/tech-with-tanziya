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
/* --- Fixed Navbar Wrapper --- */
.fixed-nav-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  /* Adaptive glass effect */
  background: color-mix(in srgb, var(--surface) 85%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  transition: background-color 0.5s ease, border-color 0.5s ease;
}

.page-wrapper {
  background: var(--bg);
  min-height: 100vh;
  /* Reduced padding: 90px clears the fixed navbar and leaves a much smaller, tighter margin */
  padding: 90px 0 100px;
  transition: background 0.5s ease;
}

.cheatsheet-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px;
}

/* --- Header Section --- */
.cheatsheet-header {
  max-width: 800px;
  margin-bottom: 40px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.badge {
  display: inline-block;
  padding: 8px 20px;
  background: var(--tag-bg);
  color: var(--tag-text);
  border-radius: 50px;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 16px;
  border: 1px solid var(--border);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.cheatsheet-header h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0 0 16px;
  font-family: 'Poppins', sans-serif;
  letter-spacing: -0.03em;
  color: var(--text);
  line-height: 1.2;
  transition: color 0.3s ease;
}

.cheatsheet-header p {
  color: var(--text-secondary);
  font-size: 1.15rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
  transition: color 0.3s ease;
}

/* --- Document Viewer & Controls --- */
.viewer-bezel {
  background: color-mix(in srgb, var(--surface) 70%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 32px;
  padding: 12px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  margin-bottom: 30px;
  transition: all 0.3s ease;
}

.page-controls-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 0 4px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-tabs {
  display: flex;
  gap: 8px;
  background: var(--surface-alt);
  padding: 6px;
  border-radius: 14px;
  border: 1px solid var(--border);
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
}

.page-tabs::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.page-tab {
  padding: 8px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-tab:hover {
  color: var(--primary);
}

.page-tab.active {
  background: var(--surface);
  color: var(--primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.page-nav-arrows {
  display: flex;
  gap: 8px;
}

.arrow-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.arrow-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--surface-alt);
}

.arrow-btn:active {
  transform: scale(0.95);
}

.image-section {
  border-radius: 20px;
  overflow: hidden;
  background: var(--surface-alt);
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 1px solid var(--border);
  transition: background 0.3s ease, border-color 0.3s ease;
}
.image-section img {
  width: 100%;
  height: auto;
  min-height: 600px;
  display: block;
  object-fit: contain;
}

.no-image {
  color: var(--text-secondary);
  text-align: center;
  padding: 60px 20px;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

/* --- Content Grid --- */
.section-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 60px;
  margin-bottom: 40px;
}

.card {
  background: var(--surface);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 32px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-6px);
  border-color: var(--primary);
}

.card h2 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 10px;
  transition: color 0.3s ease;
}

.card h2::before {
  content: '';
  display: block;
  width: 8px;
  height: 24px;
  background: var(--gradient);
  border-radius: 4px;
}

.card p {
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
  font-size: 15px;
  transition: color 0.3s ease;
}

.card ul {
  margin: 16px 0 0;
  padding-left: 0;
  list-style: none;
}

.card li {
  margin-bottom: 12px;
  line-height: 1.6;
  color: var(--text);
  padding-left: 24px;
  position: relative;
  font-size: 15px;
  transition: color 0.3s ease;
}

.card li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--primary);
  font-weight: bold;
}

/* --- Action Buttons --- */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 60px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 36px;
  border-radius: 16px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-decoration: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-family: inherit;
}

.btn-primary {
  background: var(--gradient);
  color: white;
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: var(--shadow-hover);
}

.btn-secondary {
  background: transparent;
  color: var(--text);
  border: 2px solid var(--primary);
}

.btn-secondary:hover {
  background: var(--surface-alt);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(168, 85, 247, 0.15);
}

.back-container {
  margin-top: 60px;
  text-align: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 600;
  transition: 0.3s;
}

.back-link:hover {
  color: var(--primary);
  transform: translateX(-4px);
}

@media(max-width: 768px) {
  .page-wrapper { padding: 90px 0 60px; }
  .cheatsheet-header h1 { font-size: 2.5rem; }
  .viewer-bezel { padding: 8px; border-radius: 20px; }
  .image-section { min-height: 400px; }
  .image-section iframe { min-height: 400px; }
  .action-buttons { flex-direction: column; width: 100%; }
  .btn { width: 100%; }
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

  // Share functionality (Native on Mobile, Clipboard fallback on Desktop)
  const handleShare = async () => {
    const shareData = {
      title: sheet?.title ? `${sheet.title} Cheat Sheet` : 'Cheat Sheet',
      text: sheet?.description || 'Check out this awesome cheat sheet!',
      url: window.location.href, 
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share was cancelled or failed', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('🔗 Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link', err);
      }
    }
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

  // Helper to format names (removes .jpeg, .png, etc., and capitalizes)
  const formatName = (filename: string) => {
    const cleanName = filename.replace(/\.[^/.]+$/, ""); 
    return cleanName.charAt(0).toUpperCase() + cleanName.slice(1); 
  };

  return (
    <>
      <style>{styles}</style>
      
      {/* 1. We extracted the Navigation to float fixed over everything */}
      <div className="fixed-nav-wrapper">
        <Navigation />
      </div>

      {/* 2. We reduced the padding-top so the margin feels tighter */}
      <main className="page-wrapper">
        <section>
          <div className="container cheatsheet-container">
            
            {/* Header */}
            <div className="cheatsheet-header">
              <span className="badge">{sheet?.category || 'Cheat Sheet'}</span>
              <h1>{sheet?.title ? `${sheet.title} Cheat Sheet` : 'Loading...'}</h1>
              <p>{sheet?.description}</p>
            </div>

            {/* Document Viewer */}
            <div className="viewer-bezel">
              
              {/* Page Selector & Navigation (Shows only if multiple pages exist) */}
              {!loading && driveImages.length > 1 && (
                <div className="page-controls-wrapper">
                  <div className="page-tabs">
                    {driveImages.map((image) => (
                      <button
                        key={image.id}
                        type="button"
                        className={`page-tab ${selectedImageId === image.id ? 'active' : ''}`}
                        onClick={() => setSelectedImageId(image.id)}
                      >
                        <span style={{ opacity: selectedImageId === image.id ? 1 : 0.5 }}>
                          📄
                        </span>
                        {formatName(image.name)}
                      </button>
                    ))}
                  </div>
                  
                  <div className="page-nav-arrows">
                    <button className="arrow-btn" onClick={handlePrev} title="Previous Page">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button className="arrow-btn" onClick={handleNext} title="Next Page">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="image-section">
                  <div className="no-image">
                    <span style={{ fontSize: '24px' }}>⏳</span>
                    <span>Loading Document...</span>
                  </div>
                </div>
              ) : (
                <div className="image-section">
                  {previewUrl ? (
                     <img
                        src={previewUrl}
                        alt={`${sheet?.title} Preview`}
                        style={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                          borderRadius: "12px",
                          objectFit: "contain"
                        }}
                      />
                  ) : (
                    <div className="no-image">
                      <span style={{ fontSize: '32px' }}>📋</span>
                      <span>No cheat sheet document uploaded yet</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content Cards */}
            {!loading && (sheet?.topics?.length > 0 || sheet?.interviews?.length > 0) && (
              <div className="section-grid">
                <article className="card">
                  <h2>Introduction</h2>
                  <p>A focused overview to boost your understanding and help you learn faster. Keep this guide handy while coding.</p>
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
                  <p>Simple code patterns to help you practice and remember the basics. Great for quick reference.</p>
                </article>

                {sheet.interviews?.length > 0 && (
                  <article className="card">
                    <h2>Interview Questions</h2>
                    <p>Common concepts you might be asked during technical interviews.</p>
                    <ul>
                      {sheet.interviews.map((q: string) => <li key={q}>{q}</li>)}
                    </ul>
                  </article>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="action-buttons">
              {downloadUrl && (
                <button className="btn btn-primary" onClick={handleDownload}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download Cheat Sheet
                </button>
              )}
              {/* Note the onClick trigger for sharing */}
              <button className="btn btn-secondary" onClick={handleShare}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                Share Resource
              </button>
            </div>

            <div className="back-container">
              <Link href="/cheatsheets" className="back-link">
                <span>←</span> Back to all Cheat Sheets
              </Link>
            </div>

          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}