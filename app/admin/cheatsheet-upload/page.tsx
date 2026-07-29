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
.admin-title { font-size: 28px; font-weight: 700; color: var(--text); }
.logout-btn { padding: 10px 20px; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 10px; font-weight: 600; cursor: pointer; transition: 0.3s; }
.logout-btn:hover { background: rgba(239, 68, 68, 0.2); }

/* Cards & Forms */
.card { background: var(--surface); border-radius: 20px; padding: 30px; box-shadow: var(--shadow); border: 1px solid var(--border); margin-bottom: 30px; transition: 0.3s; }
.card:hover { border-color: var(--primary); box-shadow: var(--shadow-hover); }
.form-title { font-size: 20px; font-weight: 700; margin-bottom: 24px; color: var(--text); }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; font-weight: 600; margin-bottom: 8px; color: var(--text); }

/* Inputs */
.form-group select, .form-group input, .form-group textarea { width: 100%; padding: 12px 16px; border: 1px solid var(--border); border-radius: 10px; font-size: 15px; box-sizing: border-box; transition: 0.3s; background: var(--bg); color: var(--text); font-family: inherit; }
.form-group select:focus, .form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15); }
.form-group textarea { resize: vertical; min-height: 80px; }

/* Image Grid */
.images-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin-top: 12px; }
.image-card { border: 2px solid var(--border); border-radius: 10px; overflow: hidden; cursor: pointer; transition: 0.3s; background: var(--surface-alt); }
.image-card:hover { border-color: var(--primary-light); transform: translateY(-2px); }
.image-card.selected { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.25); }
.image-card img { width: 100%; height: 100px; object-fit: cover; display: block; border-bottom: 1px solid var(--border); }
.image-card p { font-size: 11px; padding: 6px 8px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0; }

/* Buttons */
.button { padding: 12px 28px; border-radius: 10px; font-weight: 600; border: none; cursor: pointer; font-size: 15px; transition: 0.3s; }
.button-primary { background: var(--gradient); color: white; }
.button-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: var(--shadow-hover); }
.button-primary:disabled { opacity: 0.5; cursor: not-allowed; }

/* Messages */
.message { padding: 12px 16px; border-radius: 10px; margin-bottom: 16px; font-weight: 600; font-size: 14px; }
.message.success { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }
.message.error { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }

/* List */
.sheets-list { display: flex; flex-direction: column; gap: 10px; }
.sheet-item { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; background: var(--surface-alt); border-radius: 10px; border: 1px solid var(--border); transition: 0.3s; }
.sheet-item:hover { border-color: var(--primary); box-shadow: var(--shadow); }
.sheet-item .name { font-weight: 600; color: var(--text); }
.sheet-item .linked { font-size: 12px; color: #10b981; margin-top: 2px; }
.sheet-item .not-linked { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

/* Actions */
.item-actions { display: flex; align-items: center; gap: 12px; }
.delete-btn { padding: 6px 12px; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 12px; transition: 0.3s; }
.delete-btn:hover:not(:disabled) { background: rgba(239, 68, 68, 0.2); box-shadow: 0 0 10px rgba(239, 68, 68, 0.3); border-color: #ef4444; }
.delete-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.loading-text { color: var(--text-secondary); font-size: 14px; padding: 20px 0; }
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
  const [deleting, setDeleting] = useState<string | null>(null);
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
        body: JSON.stringify({
          slug,
          title,
          description,
          category,
          googleDriveId: selectedImage.id,
          googleDriveFolderId: selectedFolder
        })
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

  const handleDelete = async (targetSlug: string) => {
    if (!confirm('Are you sure you want to delete this cheat sheet?')) return;
    setDeleting(targetSlug);
    try {
      await fetch(`${API}/cheatsheets/${targetSlug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSheets();
    } catch {}
    setDeleting(null);
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
                  <input value={slug} readOnly style={{ background: 'var(--surface-alt)', color: 'var(--text-secondary)' }} />
                </div>
                <div className="form-group">
                  <label>4. Title (auto-filled from folder name)</label>
                  <input value={title} readOnly style={{ background: 'var(--surface-alt)', color: 'var(--text-secondary)' }} />
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
                  <div className="item-actions">
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.slug}</span>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDelete(s.slug)} 
                      disabled={deleting === s.slug}
                    >
                      {deleting === s.slug ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminShell>
    </>
  );
}