'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import AdminShell from '@/components/layout/AdminShell';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type Folder = { id: string; name: string };
type DriveImage = { id: string; name: string; thumbnailUrl: string; previewUrl: string; downloadUrl: string };
type CheatSheet = { slug: string; title: string; googleDriveId?: string };

const styles = `
.admin-container { max-width: 1000px; margin: 60px auto; padding: 40px; }
.admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
.admin-title { font-size: 28px; font-weight: 700; color: #111827; }
.logout-btn { padding: 10px 20px; background: #ef4444; color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; }
.card { background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e5e7eb; margin-bottom: 30px; }
.form-title { font-size: 20px; font-weight: 700; margin-bottom: 24px; color: #111827; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; font-weight: 600; margin-bottom: 8px; color: #111827; }
.form-group select, .form-group input, .form-group textarea { width: 100%; padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 15px; box-sizing: border-box; transition: 0.2s; }
.form-group select:focus, .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #7C3AED; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
.form-group textarea { resize: vertical; min-height: 80px; }
.images-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin-top: 12px; }
.image-card { border: 2px solid #e5e7eb; border-radius: 10px; overflow: hidden; cursor: pointer; transition: 0.2s; }
.image-card:hover { border-color: #7C3AED; }
.image-card.selected { border-color: #7C3AED; box-shadow: 0 0 0 3px rgba(124,58,237,0.2); }
.image-card img { width: 100%; height: 100px; object-fit: cover; display: block; }
.image-card p { font-size: 11px; padding: 6px 8px; color: #6B7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.button { padding: 12px 28px; border-radius: 10px; font-weight: 600; border: none; cursor: pointer; font-size: 15px; transition: 0.2s; }
.button-primary { background: linear-gradient(135deg, #7C3AED, #EC4899); color: white; }
.button-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.message { padding: 12px 16px; border-radius: 10px; margin-bottom: 16px; font-weight: 600; font-size: 14px; }
.message.success { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
.message.error { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
.sheets-list { display: flex; flex-direction: column; gap: 10px; }
.sheet-item { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; background: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb; }
.sheet-item .name { font-weight: 600; color: #111827; }
.sheet-item .linked { font-size: 12px; color: #10b981; margin-top: 2px; }
.sheet-item .not-linked { font-size: 12px; color: #9CA3AF; margin-top: 2px; }
.loading-text { color: #9CA3AF; font-size: 14px; padding: 20px 0; }
`;

export default function CheatSheetUploadPage() {
  const [mounted, setMounted] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [images, setImages] = useState<DriveImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<DriveImage | null>(null);
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [sheets, setSheets] = useState<CheatSheet[]>([]);
  const router = useRouter();
  const { isAdmin, token, logout, mounted: adminMounted } = useAdmin();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!adminMounted) return;
    if (!isAdmin) { router.push('/admin/login'); return; }
    fetchFolders();
    fetchSheets();
  }, [adminMounted, isAdmin]);

  const fetchFolders = async () => {
    setLoadingFolders(true);
    try {
      await fetch(`${API}/sync-drive`, { method: 'POST' });
      const res = await fetch(`${API}/drive/folders`);
      const data = await res.json();
      setFolders(Array.isArray(data) ? data : []);
    } catch { setMessage('Failed to load Drive folders'); }
    setLoadingFolders(false);
  };

  const fetchSheets = async () => {
    try {
      const res = await fetch(`${API}/cheatsheets`);
      const data = await res.json();
      setSheets(Array.isArray(data) ? data : []);
    } catch {}
  };

  const handleFolderChange = async (folderId: string) => {
    setSelectedFolder(folderId);
    setImages([]);
    setSelectedImage(null);
    if (!folderId) return;

    // Auto-derive slug and title from the folder name
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      setSlug(folder.name.toLowerCase().replace(/\s+/g, '-'));
      setTitle(folder.name);
    } else {
      setSlug('');
      setTitle('');
    }

    setLoadingImages(true);
    try {
      const res = await fetch(`${API}/drive/folders/${folderId}/images`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch { setMessage('Failed to load images'); }
    setLoadingImages(false);
  };

  const handleSave = async () => {
    if (!slug || !title || !selectedImage) { setMessage('Please fill slug, title and select an image'); return; }
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`${API}/cheatsheets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slug, title, description, category, googleDriveId: selectedImage.id })
      });
      if (res.ok) {
        setMessage('✓ Cheat sheet saved successfully!');
        setSlug(''); setTitle(''); setDescription(''); setCategory('');
        setSelectedImage(null); setSelectedFolder(''); setImages([]);
        fetchSheets();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const d = await res.json();
        setMessage(`✗ ${d.error}`);
      }
    } catch { setMessage('✗ Failed to save'); }
    setSaving(false);
  };

  if (!mounted || !adminMounted || !isAdmin) return null;

  return (
    <>
      <style>{styles}</style>
      <AdminShell
        title="Cheat Sheet Manager"
        description="Link cheat sheets with Google Drive and publish them to the site."
      >
        <div className="container admin-container">
          <div className="card">
            <h2 className="form-title">Link a Cheat Sheet to Google Drive</h2>

            {message && <div className={`message ${message.startsWith('✓') ? 'success' : 'error'}`}>{message}</div>}

            <div className="form-group">
              <label>1. Select Drive Folder</label>
              {loadingFolders ? <p className="loading-text">Loading folders...</p> : (
                <select value={selectedFolder} onChange={e => handleFolderChange(e.target.value)}>
                  <option value="">Choose a folder...</option>
                  {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              )}
            </div>

            {selectedFolder && (
              <div className="form-group">
                <label>2. Select Image</label>
                {loadingImages ? <p className="loading-text">Loading images...</p> : images.length === 0 ? (
                  <p className="loading-text">No images found in this folder</p>
                ) : (
                  <div className="images-grid">
                    {images.map(img => (
                      <div key={img.id} className={`image-card ${selectedImage?.id === img.id ? 'selected' : ''}`} onClick={() => setSelectedImage(img)}>
                        <img src={img.thumbnailUrl} alt={img.name} />
                        <p>{img.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedImage && (
              <>
                <div className="form-group">
                  <label>3. Slug (auto-filled from folder name)</label>
                  <input value={slug} readOnly style={{ background: '#f3f4f6', color: '#6B7280' }} />
                </div>
                <div className="form-group">
                  <label>4. Title (auto-filled from folder name)</label>
                  <input value={title} readOnly style={{ background: '#f3f4f6', color: '#6B7280' }} />
                </div>
                <div className="form-group">
                  <label>5. Description (optional)</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description..." />
                </div>
                <div className="form-group">
                  <label>6. Category (optional)</label>
                  <input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Java, Web, Tools" />
                </div>
                <button className="button button-primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Cheat Sheet'}
                </button>
              </>
            )}
          </div>

          <div className="card">
            <h2 className="form-title">All Cheat Sheets</h2>
            <div className="sheets-list">
              {sheets.map(s => (
                <div className="sheet-item" key={s.slug}>
                  <div>
                    <div className="name">{s.title || s.slug}</div>
                    {s.googleDriveId
                      ? <div className="linked">Linked to Drive</div>
                      : <div className="not-linked">No Drive link</div>}
                  </div>
                  <span style={{ fontSize: 13, color: '#9CA3AF' }}>{s.slug}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminShell>
    </>
  );
}
