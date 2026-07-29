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
.blog-container {
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 20px;
}

.blog-header {
  margin-bottom: 40px;
}

.badge {
  display: inline-block;
  padding: 8px 16px;
  background: var(--tag-bg);
  color: var(--tag-text);
  border-radius: 50px;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 16px;
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}

.blog-header h1 {
  font-size: 2.75rem;
  margin: 18px 0 12px;
  font-family: 'Poppins', sans-serif;
  color: var(--text);
  line-height: 1.2;
  transition: color 0.3s ease;
}

.blog-header p {
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.7;
  transition: color 0.3s ease;
}

.blog-meta {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 14px;
  transition: border-color 0.3s ease, color 0.3s ease;
}

.content-section {
  background: var(--surface);
  border-radius: 24px;
  padding: 48px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  margin-bottom: 40px;
  white-space: pre-wrap;
  line-height: 1.9;
  color: var(--text);
  font-size: 16px;
  transition: background-color 0.5s ease, border-color 0.5s ease, color 0.5s ease;
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
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-decoration: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.button-secondary {
  border: 2px solid var(--primary);
  background: transparent;
  color: var(--text);
  font-weight: 700;
}

.button-secondary:hover {
  background: var(--surface-alt);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(168, 85, 247, 0.15);
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

  // Handle the share action
  const handleShare = async () => {
    if (!blog) return;

    const shareData = {
      title: blog.title,
      text: `Check out this article: ${blog.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link: ', err);
      }
    }
  };

  if (!loading && notFoundState) notFound();

  return (
    <>
      <style>{styles}</style>
      <main>
        <Navigation />
        <section>
          <div className="container blog-container">
            {loading && <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '80px 0' }}>Loading...</p>}

            {!loading && blog && (
              <>
                <div className="blog-header">
                  <p className="badge">{blog.category}</p>
                  <h1>{blog.title}</h1>
                  {blog.description && <p>{blog.description}</p>}
                  <div className="blog-meta">
                    <span>{new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span>· TechWithTanziya</span>
                  </div>
                </div>

                <div className="content-section">
                  {blog.content}
                </div>

                <div className="action-buttons">
                  <button onClick={handleShare} className="button button-secondary">
                    📤 Share Article
                  </button>
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