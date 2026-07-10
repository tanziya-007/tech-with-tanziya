'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { cheatSheets } from '@/data/content';

const styles = `
.admin-container {
  max-width: 900px;
  margin: 60px auto;
  padding: 40px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.admin-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
}

.logout-btn {
  padding: 10px 20px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.logout-btn:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

.admin-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

.upload-form {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.form-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #111827;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #111827;
}

.form-group select,
.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 16px;
  transition: 0.3s;
  box-sizing: border-box;
}

.form-group select:focus,
.form-group input:focus {
  outline: none;
  border-color: #7C3AED;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.select-row {
  display: flex;
  gap: 10px;
}

.select-row select {
  flex: 1;
}

.new-btn {
  padding: 12px 16px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
  white-space: nowrap;
}

.new-btn:hover {
  background: #eef2ff;
}

.hint-text {
  font-size: 13px;
  color: #9CA3AF;
  margin-top: 8px;
}

.file-input-wrapper {
  position: relative;
  overflow: hidden;
}

.file-input-wrapper input[type="file"] {
  position: absolute;
  left: -9999px;
}

.file-input-label {
  display: block;
  padding: 12px 16px;
  background: #f3f4f6;
  border: 2px dashed #7C3AED;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
  color: #7C3AED;
  font-weight: 600;
}

.file-input-label:hover {
  background: #f3e8ff;
}

.preview {
  margin-top: 15px;
  border-radius: 10px;
  overflow: hidden;
  max-height: 200px;
}

.preview img {
  width: 100%;
  height: auto;
  display: block;
}

.button {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: 0.3s;
  font-size: 16px;
}

.button-primary {
  background: linear-gradient(135deg, #7C3AED, #EC4899);
  color: white;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
}

.button-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
}

.button-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 15px;
  font-weight: 600;
  font-size: 14px;
}

.message.success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

.message.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.uploads-list {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.uploads-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #111827;
}

.upload-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f9fafb;
  border-radius: 10px;
  margin-bottom: 12px;
  border: 1px solid #e5e7eb;
}

.upload-info {
  flex: 1;
}

.upload-name {
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.upload-file {
  font-size: 13px;
  color: #6B7280;
}

.delete-btn {
  padding: 8px 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  font-size: 14px;
}

.delete-btn:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #9CA3AF;
}

@media(max-width: 900px) {
  .admin-grid {
    grid-template-columns: 1fr;
  }

  .admin-header {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
}
`;

export default function CheatSheetUploadPage() {
  const [mounted, setMounted] = useState(false);
  const [slug, setSlug] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [showNewTopic, setShowNewTopic] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState<any[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();
  const { isAdmin, logout } = useAdmin();

  useEffect(() => {
    setMounted(true);
    if (!isAdmin) {
      router.push('/admin/login');
    } else {
      fetchUploads();
    }
  }, [isAdmin, router]);

  const fetchUploads = async () => {
    try {
      const response = await fetch('/api/cheatsheet-upload');
      const data = await response.json();
      setUploads(data.cheatsheets || []);
    } catch (error) {
      console.log('Failed to fetch uploads');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalSlug = newTopic ? newTopic.toLowerCase().replace(/\s+/g, '-') : slug;

    if (!finalSlug || !file) {
      setMessage('Please select or add a cheat sheet and upload an image');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slug', finalSlug);
      formData.append('title', newTopic || cheatSheets.find(cs => cs.slug === slug)?.title || finalSlug);

      const response = await fetch('/api/cheatsheet-upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✓ ${data.message}`);
        setSlug('');
        setNewTopic('');
        setShowNewTopic(false);
        setFile(null);
        setPreview('');
        fetchUploads();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`✗ ${data.error}`);
      }
    } catch (error) {
      setMessage('✗ Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (uploadSlug: string) => {
    if (!confirm('Are you sure you want to delete this cheat sheet?')) return;

    setDeleting(uploadSlug);

    try {
      const response = await fetch('/api/cheatsheet-upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: uploadSlug }),
      });

      if (response.ok) {
        setMessage('✓ Cheat sheet deleted successfully');
        fetchUploads();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('✗ Failed to delete cheat sheet');
      }
    } catch (error) {
      setMessage('✗ Delete failed. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!mounted || !isAdmin) {
    return null;
  }

  const getCheatSheetName = (slug: string) => {
    return cheatSheets.find(cs => cs.slug === slug)?.title || slug;
  };

  return (
    <>
      <style>{styles}</style>
      <main>
        <Navigation />
        <div className="container admin-container">
          <div className="admin-header">
            <h1 className="admin-title">📊 Admin Panel</h1>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <div className="admin-grid">
            <div className="upload-form">
              <h2 className="form-title">Upload Cheat Sheet</h2>

              {message && (
                <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Select Cheat Sheet</label>
                  <div className="select-row">
                    <select
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      disabled={loading || showNewTopic}
                    >
                      <option value="">Choose a cheat sheet...</option>
                      {cheatSheets.map((sheet) => (
                        <option key={sheet.slug} value={sheet.slug}>
                          {sheet.title}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="new-btn"
                      onClick={() => {
                        setShowNewTopic(!showNewTopic);
                        setSlug('');
                      }}
                      disabled={loading}
                    >
                      ➕ New
                    </button>
                  </div>
                </div>

                {showNewTopic && (
                  <div className="form-group">
                    <label htmlFor="newTopic">Add New Topic</label>
                    <input
                      id="newTopic"
                      type="text"
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      placeholder="e.g., Go, Rust, TypeScript"
                      disabled={loading}
                    />
                    <p className="hint-text">💡 Enter the new language/topic name</p>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="file">Upload Image</label>
                  <div className="file-input-wrapper">
                    <input
                      id="file"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={loading}
                    />
                    <label htmlFor="file" className="file-input-label">
                      {file ? `📁 ${file.name}` : '📤 Click to upload'}
                    </label>
                  </div>
                </div>

                {preview && (
                  <div className="preview">
                    <img src={preview} alt="Preview" />
                  </div>
                )}

                <button
                  type="submit"
                  className="button button-primary"
                  disabled={loading || (!slug && !newTopic) || !file}
                >
                  {loading ? 'Uploading...' : 'Upload'}
                </button>
              </form>
            </div>

            <div className="uploads-list">
              <h2 className="uploads-title">Uploaded Cheat Sheets</h2>

              {uploads.length === 0 ? (
                <div className="empty-state">
                  <p>No cheat sheets uploaded yet</p>
                </div>
              ) : (
                uploads.map((upload) => (
                  <div className="upload-item" key={upload.slug}>
                    <div className="upload-info">
                      <div className="upload-name">
                        {getCheatSheetName(upload.slug)}
                      </div>
                      <div className="upload-file">{upload.filename}</div>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(upload.slug)}
                      disabled={deleting === upload.slug}
                    >
                      {deleting === upload.slug ? 'Deleting...' : '🗑️ Delete'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
