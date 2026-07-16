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
.form-group textarea { resize: vertical; min-height: 100px; line-height: 1.7; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.button { padding: 12px 28px; border-radius: 10px; font-weight: 600; border: none; cursor: pointer; font-size: 15px; transition: 0.2s; }
.button-primary { background: linear-gradient(135deg, #7C3AED, #EC4899); color: white; width: 100%; }
.button-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.message { padding: 12px 16px; border-radius: 10px; margin-bottom: 16px; font-weight: 600; font-size: 14px; }
.message.success { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
.message.error { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
.projects-list { display: flex; flex-direction: column; gap: 10px; }
.project-item { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; background: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb; }
.project-item .name { font-weight: 600; color: #111827; }
.project-item .meta { font-size: 12px; color: #9CA3AF; margin-top: 2px; }
.item-actions { display: flex; gap: 8px; }
.edit-btn { padding: 8px 14px; background: #7C3AED; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px; }
.edit-btn:hover { background: #6d28d9; }
.delete-btn { padding: 8px 14px; background: #ef4444; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px; }
.delete-btn:hover { background: #dc2626; }
.hint { font-size: 12px; color: #9CA3AF; margin-top: 6px; }
`;

export default function ProjectUploadPage() {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tech, setTech] = useState('');
  const [github, setGithub] = useState('');
  const [demo, setDemo] = useState('');
  const [googleDriveFolderId, setGoogleDriveFolderId] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const router = useRouter();
  const { isAdmin, token, logout } = useAdmin();

  useEffect(() => {
    setMounted(true);
    if (!isAdmin) { router.push('/admin/login'); return; }
    fetchProjects();
  }, [isAdmin]);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API}/projects`);
      setProjects(await res.json());
    } catch {}
  };

  const resetForm = () => {
    setTitle(''); setDescription(''); setTech(''); setGithub(''); setDemo(''); setGoogleDriveFolderId(''); setEditingSlug(null);
  };

  const handleSave = async () => {
    if (!title) { setMessage('Title is required'); return; }
    setSaving(true);
    setMessage('');
    const slug = editingSlug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    try {
      const res = await fetch(`${API}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          slug, title, description,
          tech: tech.split(',').map(t => t.trim()).filter(Boolean),
          github, demo, googleDriveFolderId
        }),
      });
      if (res.ok) {
        setMessage(editingSlug ? '✓ Project updated!' : '✓ Project saved!');
        resetForm();
        fetchProjects();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const d = await res.json();
        setMessage(`✗ ${d.error}`);
      }
    } catch { setMessage('✗ Failed to save'); }
    setSaving(false);
  };

  const handleEdit = async (slug: string) => {
    try {
      const res = await fetch(`${API}/projects/${slug}`);
      const data = await res.json();
      setTitle(data.title || '');
      setDescription(data.description || '');
      setTech((data.tech || []).join(', '));
      setGithub(data.github || '');
      setDemo(data.demo || '');
      setGoogleDriveFolderId(data.googleDriveFolderId || '');
      setEditingSlug(slug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch { setMessage('✗ Failed to load project'); }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this project?')) return;
    setDeleting(slug);
    try {
      await fetch(`${API}/projects/${slug}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchProjects();
    } catch {}
    setDeleting(null);
  };

  if (!mounted || !isAdmin) return null;

  return (
    <>
      <style>{styles}</style>
      <AdminShell
        title="Project Manager"
        description="Add and edit project entries, GitHub links, demos, and Drive screenshots."
      >
        <div className="container admin-container">
          <div className="card">
            <h2 className="form-title">{editingSlug ? 'Edit Project' : 'Add New Project'}</h2>

            {message && <div className={`message ${message.startsWith('✓') ? 'success' : 'error'}`}>{message}</div>}

            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Rice Grain Classifier" />
              </div>
              <div className="form-group">
                <label>Tech Stack</label>
                <input value={tech} onChange={e => setTech(e.target.value)} placeholder="e.g. Python, TensorFlow, Flask" />
                <p className="hint">Comma separated</p>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what this project does..." />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>GitHub URL</label>
                <input value={github} onChange={e => setGithub(e.target.value)} placeholder="https://github.com/..." />
              </div>
              <div className="form-group">
                <label>Live Demo URL</label>
                <input value={demo} onChange={e => setDemo(e.target.value)} placeholder="https://..." />
              </div>
            </div>

            <div className="form-group">
              <label>Google Drive Folder ID (Screenshots)</label>
              <input value={googleDriveFolderId} onChange={e => setGoogleDriveFolderId(e.target.value)} placeholder="Paste the folder ID from the Drive URL" />
              <p className="hint">Open the Drive folder → copy the ID from the URL: drive.google.com/drive/folders/<strong>THIS_PART</strong></p>
            </div>

            <button className="button button-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingSlug ? 'Update Project' : 'Save Project'}
            </button>
            {editingSlug && (
              <button onClick={resetForm} style={{ marginTop: 12, width: '100%', padding: '12px', borderRadius: 10, border: '2px solid #e5e7eb', background: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}>
                Cancel Edit
              </button>
            )}
          </div>

          <div className="card">
            <h2 className="form-title">All Projects</h2>
            {projects.length === 0 ? (
              <p style={{ color: '#9CA3AF' }}>No projects added yet.</p>
            ) : (
              <div className="projects-list">
                {projects.map(p => (
                  <div className="project-item" key={p.slug}>
                    <div>
                      <div className="name">{p.title}</div>
                      <div className="meta">{(p.tech || []).join(', ')} {p.googleDriveFolderId ? '· Drive linked' : '· No screenshots'}</div>
                    </div>
                    <div className="item-actions">
                      <button className="edit-btn" onClick={() => handleEdit(p.slug)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(p.slug)} disabled={deleting === p.slug}>
                        {deleting === p.slug ? '...' : 'Delete'}
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
