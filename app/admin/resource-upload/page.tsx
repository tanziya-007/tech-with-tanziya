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

export default function ResourceUploadPage() {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [link, setLink] = useState('');
  const [googleDriveId, setGoogleDriveId] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [resources, setResources] = useState<any[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const router = useRouter();
  const { isAdmin, token, logout } = useAdmin();

  useEffect(() => {
    setMounted(true);
    if (!isAdmin) { router.push('/admin/login'); return; }
    fetchResources();
  }, [isAdmin]);

  const fetchResources = async () => {
    try {
      const res = await fetch(`${API}/resources`);
      setResources(await res.json());
    } catch {}
  };

  const resetForm = () => {
    setTitle(''); setDescription(''); setTag(''); setLink(''); setGoogleDriveId(''); setEditingSlug(null);
  };

  const handleSave = async () => {
    if (!title) { setMessage('Title is required'); return; }
    setSaving(true);
    setMessage('');
    const slug = editingSlug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    try {
      const res = await fetch(`${API}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slug, title, description, tag, link, googleDriveId }),
      });
      if (res.ok) {
        setMessage(editingSlug ? '✓ Resource updated!' : '✓ Resource saved!');
        resetForm();
        fetchResources();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const d = await res.json();
        setMessage(`✗ ${d.error}`);
      }
    } catch { setMessage('✗ Failed to save'); }
    setSaving(false);
  };

  const handleEdit = async (slug: string) => {
    const r = resources.find(x => x.slug === slug);
    if (!r) return;
    setTitle(r.title || ''); setDescription(r.description || ''); setTag(r.tag || '');
    setLink(r.link || ''); setGoogleDriveId(r.googleDriveId || ''); setEditingSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this resource?')) return;
    setDeleting(slug);
    try {
      await fetch(`${API}/resources/${slug}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchResources();
    } catch {}
    setDeleting(null);
  };

  if (!mounted || !isAdmin) return null;

  return (
    <>
      <style>{styles}</style>
      <AdminShell
        title="Resource Manager"
        description="Publish resources, notes, templates, and preview images from one admin screen."
      >
        <div className="container admin-container">
          <div className="card">
            <h2 className="form-title">{editingSlug ? 'Edit Resource' : 'Add New Resource'}</h2>
            {message && <div className={`message ${message.startsWith('✓') ? 'success' : 'error'}`}>{message}</div>}

            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Resume Template" />
              </div>
              <div className="form-group">
                <label>Tag</label>
                <input value={tag} onChange={e => setTag(e.target.value)} placeholder="e.g. Template, PDF, Notes" />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What is this resource about?" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Download / External Link</label>
                <input value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Google Drive Image ID</label>
                <input value={googleDriveId} onChange={e => setGoogleDriveId(e.target.value)} placeholder="Drive file ID for the preview image" />
                <p className="hint">From the Drive share URL: /file/d/<strong>THIS_PART</strong>/view</p>
              </div>
            </div>

            <button className="button button-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingSlug ? 'Update Resource' : 'Save Resource'}
            </button>
            {editingSlug && (
              <button onClick={resetForm} style={{ marginTop: 12, width: '100%', padding: '12px', borderRadius: 10, border: '2px solid #e5e7eb', background: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}>
                Cancel Edit
              </button>
            )}
          </div>

          <div className="card">
            <h2 className="form-title">All Resources</h2>
            {resources.length === 0 ? (
              <p style={{ color: '#9CA3AF' }}>No resources added yet.</p>
            ) : (
              <div className="list">
                {resources.map(r => (
                  <div className="list-item" key={r.slug}>
                    <div>
                      <div className="name">{r.title}</div>
                      <div className="meta">{r.tag} {r.googleDriveId ? '· Image linked' : '· No image'}</div>
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
