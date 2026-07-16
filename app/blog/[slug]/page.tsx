'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

type PageProps = {
  params: Promise<{ slug: string }>;
};

const styles = `
.blog-container {
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 0;
}

.blog-header {
  margin-bottom: 40px;
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

.blog-header h1 {
  font-size: 2.75rem;
  margin: 18px 0 12px;
  font-family: Poppins, sans-serif;
  color: #111827;
  line-height: 1.2;
}

.blog-header p {
  color: #6B7280;
  font-size: 1.05rem;
  line-height: 1.7;
}

.blog-meta {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
  color: #6B7280;
  font-size: 14px;
}

.content-section {
  background: white;
  border-radius: 16px;
  padding: 48px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 40px;
  white-space: pre-wrap;
  line-height: 1.9;
  color: #374151;
  font-size: 16px;
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
  .blog-header h1 {
    font-size: 2rem;
  }

  .content-section {
    padding: 25px;
  }

  .button {
    width: 100%;
  }
}
`;

export default function BlogDetailPage({ params: paramsPromise }: PageProps) {
  const params = use(paramsPromise);
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    fetch(`${api}/blogs/${params.slug}`)
      .then(res => {
        if (!res.ok) { setNotFoundState(true); return null; }
        return res.json();
      })
      .then(data => { if (data) setBlog(data); })
      .catch(() => setNotFoundState(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (!loading && notFoundState) notFound();

  return (
    <>
      <style>{styles}</style>
      <main>
        <Navigation />
        <section>
          <div className="container blog-container">
            {loading && <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '80px 0' }}>Loading...</p>}

            {!loading && blog && (
              <>
                <div className="blog-header">
                  <p className="badge">{blog.category}</p>
                  <h1>{blog.title}</h1>
                  {blog.description && <p>{blog.description}</p>}
                  <div className="blog-meta">
                    <span>📅 {new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span>✍️ TechWithTanziya</span>
                  </div>
                </div>

                <div className="content-section">
                  {blog.content}
                </div>

                <div className="action-buttons">
                  <button className="button button-secondary">📤 Share</button>
                </div>

                <div className="back-link">
                  <Link href="/blog" className="button button-secondary">
                    ← Back to Blogs
                  </Link>
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
