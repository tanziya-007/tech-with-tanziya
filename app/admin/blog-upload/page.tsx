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
.form-group input, .form-group select, .form-group textarea { width: 100%; padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 15px; box-sizing: border-box; transition: 0.2s; font-family: inherit; }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: #7C3AED; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
.form-group textarea { resize: vertical; min-height: 300px; line-height: 1.7; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.button { padding: 12px 28px; border-radius: 10px; font-weight: 600; border: none; cursor: pointer; font-size: 15px; transition: 0.2s; }
.button-primary { background: linear-gradient(135deg, #7C3AED, #EC4899); color: white; width: 100%; }
.button-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.message { padding: 12px 16px; border-radius: 10px; margin-bottom: 16px; font-weight: 600; font-size: 14px; }
.message.success { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
.message.error { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
.blogs-list { display: flex; flex-direction: column; gap: 10px; }
.blog-item { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; background: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb; }
.blog-item .name { font-weight: 600; color: #111827; }
.blog-item .meta { font-size: 12px; color: #9CA3AF; margin-top: 2px; }
.delete-btn { padding: 8px 14px; background: #ef4444; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px; }
.delete-btn:hover { background: #dc2626; }
.edit-btn { padding: 8px 14px; background: #7C3AED; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px; }
.edit-btn:hover { background: #6d28d9; }
.item-actions { display: flex; align-items: center; gap: 8px; }
.hint { font-size: 12px; color: #9CA3AF; margin-top: 6px; }
`;

export default function BlogUploadPage() {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [blogs, setBlogs] = useState<any[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const router = useRouter();
  const { isAdmin, token, logout, handleAuthError } = useAdmin();

  useEffect(() => {
    setMounted(true);
    if (!isAdmin) { router.push('/admin/login'); return; }
    fetchBlogs();
  }, [isAdmin]);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API}/blogs`);
      const data = await res.json();
      setBlogs(data);
    } catch {}
  };

  const handleSave = async () => {
    if (!title || !content) { setMessage('Title and content are required'); return; }
    setSaving(true);
    setMessage('');
    const slug = editingSlug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    try {
      const res = await fetch(`${API}/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slug, title, description, category, date, content }),
      });
      if (res.ok) {
        setMessage(editingSlug ? '✓ Blog updated successfully!' : '✓ Blog published successfully!');
        setTitle(''); setCategory(''); setDescription(''); setContent('');
        setDate(new Date().toISOString().split('T')[0]);
        setEditingSlug(null);
        fetchBlogs();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const d = await res.json();
        handleAuthError(res.status);
        setMessage(`✗ ${d.error}`);
      }
    } catch { setMessage('✗ Failed to save'); }
    setSaving(false);
  };

  const handleEdit = async (slug: string) => {
    try {
      const res = await fetch(`${API}/blogs/${slug}`);
      const data = await res.json();
      setTitle(data.title);
      setCategory(data.category || '');
      setDescription(data.description || '');
      setDate(data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
      setContent(data.content || '');
      setEditingSlug(slug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch { setMessage('✗ Failed to load blog for editing'); }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this blog post?')) return;
    setDeleting(slug);
    try {
      await fetch(`${API}/blogs/${slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBlogs();
    } catch {}
    setDeleting(null);
  };

  if (!mounted || !isAdmin) return null;

  return (
    <>
      <style>{styles}</style>
      <AdminShell
        title="Blog Manager"
        description="Create and manage blog posts with a single admin workflow."
      >
        <div className="container admin-container">
          <div className="card">
            <h2 className="form-title">{editingSlug ? 'Edit Blog Post' : 'Write a New Blog Post'}</h2>

            {message && <div className={`message ${message.startsWith('✓') ? 'success' : 'error'}`}>{message}</div>}

            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Java Basics for Beginners" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Java, Python, SQL" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Short Description</label>
                <input value={description} onChange={e => setDescription(e.target.value)} placeholder="One line summary shown on the blog card" />
              </div>
            </div>

            <div className="form-group">
              <label>Content</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Paste or type the full blog content here..."
              />
              <p className="hint">This is what visitors will read when they open the blog post.</p>
            </div>

            <button className="button button-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingSlug ? 'Update Blog' : 'Publish Blog'}
            </button>
            {editingSlug && (
              <button style={{ marginTop: 12, width: '100%', padding: '12px', borderRadius: 10, border: '2px solid #e5e7eb', background: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}
                onClick={() => { setEditingSlug(null); setTitle(''); setCategory(''); setDescription(''); setContent(''); setDate(new Date().toISOString().split('T')[0]); }}>
                Cancel Edit
              </button>
            )}
          </div>

          <div className="card">
            <h2 className="form-title">Published Blogs</h2>
            {blogs.length === 0 ? (
              <p style={{ color: '#9CA3AF' }}>No blogs published yet.</p>
            ) : (
              <div className="blogs-list">
                {blogs.map(b => (
                  <div className="blog-item" key={b.slug}>
                    <div>
                      <div className="name">{b.title}</div>
                      <div className="meta">{b.category} · {new Date(b.date).toLocaleDateString()}</div>
                    </div>
                    <div className="item-actions">
                      <button className="edit-btn" onClick={() => handleEdit(b.slug)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(b.slug)} disabled={deleting === b.slug}>
                        {deleting === b.slug ? '...' : 'Delete'}
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
