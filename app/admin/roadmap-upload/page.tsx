'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import AdminShell from '@/components/layout/AdminShell';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const styles = `
.admin-container { max-width: 900px; margin: 60px auto; padding: 40px; }
.admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
.admin-title { font-size: 28px; font-weight: 700; color: #111827; }
.logout-btn { padding: 10px 20px; background: #ef4444; color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; }
.card { background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e5e7eb; margin-bottom: 30px; }
.form-title { font-size: 20px; font-weight: 700; margin-bottom: 24px; color: #111827; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; font-weight: 600; margin-bottom: 8px; color: #111827; }
.form-group input, .form-group textarea { width: 100%; padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 15px; box-sizing: border-box; transition: 0.2s; font-family: inherit; }
.form-group input:focus, .form-group textarea:focus { outline: none; border-color: #7C3AED; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
.form-group textarea { resize: vertical; min-height: 80px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.button { padding: 12px 28px; border-radius: 10px; font-weight: 600; border: none; cursor: pointer; font-size: 15px; transition: 0.2s; }
.button-primary { background: linear-gradient(135deg, #7C3AED, #EC4899); color: white; width: 100%; }
.button-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.message { padding: 12px 16px; border-radius: 10px; margin-bottom: 16px; font-weight: 600; font-size: 14px; }
.message.success { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
.message.error { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
.list { display: flex; flex-direction: column; gap: 10px; }
.list-item { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; background: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb; }
.list-item .name { font-weight: 600; color: #111827; }
.list-item .meta { font-size: 12px; color: #9CA3AF; margin-top: 2px; }
.item-actions { display: flex; gap: 8px; }
.edit-btn { padding: 8px 14px; background: #7C3AED; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px; }
.edit-btn:hover { background: #6d28d9; }
.delete-btn { padding: 8px 14px; background: #ef4444; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px; }
.delete-btn:hover { background: #dc2626; }
.hint { font-size: 12px; color: #9CA3AF; margin-top: 6px; }
`;

export default function RoadmapUploadPage() {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [googleDriveFolderId, setGoogleDriveFolderId] = useState('');
  const [googleDrivePdfId, setGoogleDrivePdfId] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const router = useRouter();
  const { isAdmin, token, logout } = useAdmin();

  useEffect(() => {
    setMounted(true);
    if (!isAdmin) { router.push('/admin/login'); return; }
    fetchRoadmaps();
  }, [isAdmin]);

  const fetchRoadmaps = async () => {
    try {
      const res = await fetch(`${API}/roadmaps`);
      setRoadmaps(await res.json());
    } catch {}
  };

  const resetForm = () => {
    setTitle(''); setDescription(''); setGoogleDriveFolderId(''); setGoogleDrivePdfId(''); setEditingSlug(null);
  };

  const extractDriveFolderId = (value: string) => {
    const folderMatch = value.match(/folders\/([a-zA-Z0-9_-]+)/);
    if (folderMatch) return folderMatch[1];
    return value.trim();
  };

  const extractDriveFileId = (value: string) => {
    const idMatch = value.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/);
    return idMatch ? idMatch[1] : value.trim();
  };

  const handleSave = async () => {
    if (!title) { setMessage('Title is required'); return; }
    setSaving(true);
    setMessage('');
    const slug = editingSlug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const normalizedFolderId = googleDriveFolderId ? extractDriveFolderId(googleDriveFolderId) : '';
    const normalizedPdfId = googleDrivePdfId ? extractDriveFileId(googleDrivePdfId) : '';
    try {
      const res = await fetch(`${API}/roadmaps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slug, title, description, googleDriveFolderId: normalizedFolderId, googleDrivePdfId: normalizedPdfId }),
      });
      if (res.ok) {
        setMessage(editingSlug ? '✓ Roadmap updated!' : '✓ Roadmap saved!');
        resetForm();
        fetchRoadmaps();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const d = await res.json();
        setMessage(`✗ ${d.error}`);
      }
    } catch { setMessage('✗ Failed to save'); }
    setSaving(false);
  };

  const handleEdit = (slug: string) => {
    const r = roadmaps.find(x => x.slug === slug);
    if (!r) return;
    setTitle(r.title || ''); setDescription(r.description || ''); setGoogleDriveFolderId(r.googleDriveFolderId || ''); setGoogleDrivePdfId(r.googleDrivePdfId || ''); setEditingSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this roadmap?')) return;
    setDeleting(slug);
    try {
      await fetch(`${API}/roadmaps/${slug}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchRoadmaps();
    } catch {}
    setDeleting(null);
  };

  if (!mounted || !isAdmin) return null;

  return (
    <>
      <style>{styles}</style>
      <AdminShell
        title="Roadmap Manager"
        description="Manage learning roadmaps with Drive images and PDF references."
      >
        <div className="container admin-container">
          <div className="card">
            <h2 className="form-title">{editingSlug ? 'Edit Roadmap' : 'Add New Roadmap'}</h2>
            {message && <div className={`message ${message.startsWith('✓') ? 'success' : 'error'}`}>{message}</div>}

            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Java Roadmap" />
              </div>
              <div className="form-group">
                <label>Google Drive Folder ID</label>
                <input value={googleDriveFolderId} onChange={e => setGoogleDriveFolderId(e.target.value)} placeholder="Drive folder ID or full URL where images are stored" />
                <p className="hint">From the Drive folder URL: /folders/<strong>THIS_PART</strong></p>
                <p className="hint">Make sure the folder is shared with your service account email.</p>
              </div>
              <div className="form-group">
                <label>Google Drive PDF ID</label>
                <input value={googleDrivePdfId} onChange={e => setGoogleDrivePdfId(e.target.value)} placeholder="Drive file ID or full URL for the roadmap PDF" />
                <p className="hint">Paste the full Drive URL or just the file ID</p>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What does this roadmap cover?" />
            </div>

            <button className="button button-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingSlug ? 'Update Roadmap' : 'Save Roadmap'}
            </button>
            {editingSlug && (
              <button onClick={resetForm} style={{ marginTop: 12, width: '100%', padding: '12px', borderRadius: 10, border: '2px solid #e5e7eb', background: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}>
                Cancel Edit
              </button>
            )}
          </div>

          <div className="card">
            <h2 className="form-title">All Roadmaps</h2>
            {roadmaps.length === 0 ? (
              <p style={{ color: '#9CA3AF' }}>No roadmaps added yet.</p>
            ) : (
              <div className="list">
                {roadmaps.map(r => (
                  <div className="list-item" key={r.slug}>
                    <div>
                      <div className="name">{r.title}</div>
                      <div className="meta">{r.googleDrivePdfId ? 'PDF available' : 'No PDF'}</div>
                    </div>
                    <div className="item-actions">
                      <button className="edit-btn" onClick={() => handleEdit(r.slug)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(r.slug)} disabled={deleting === r.slug}>
                        {deleting === r.slug ? '...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </AdminShell>
    </>
  );
}
