'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { fetchBlog } from '@/lib/api';
import { blogs } from '@/data/content';

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const styles = `
.blog-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 0;
}

.blog-header {
  max-width: 760px;
  margin-bottom: 36px;
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
}

.blog-header p {
  color: #6B7280;
  font-size: 1.05rem;
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

.image-section {
  margin-bottom: 40px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  background: #f9fafb;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-section img {
  width: 100%;
  height: auto;
  display: block;
}

.no-image {
  color: #9CA3AF;
  text-align: center;
  padding: 60px 20px;
}

.content-section {
  background: white;
  border-radius: 16px;
  padding: 40px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 40px;
  line-height: 1.8;
  color: #555;
}

.content-section h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #111827;
}

.content-section p {
  margin-bottom: 16px;
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

.button-primary {
  background: linear-gradient(135deg, #6C3BFF, #2D7DFF);
  color: white;
  box-shadow: 0 4px 15px rgba(108, 59, 255, 0.3);
}

.button-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(108, 59, 255, 0.4);
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

  .action-buttons {
    flex-direction: column;
  }

  .button {
    width: 100%;
  }
}
`;

export default function BlogDetailPage({ params: paramsPromise }: PageProps) {
  const params = use(paramsPromise);
  const blog = blogs.find((item) => item.slug === params.slug);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageExists, setImageExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBlog(params.slug);
        // Data fetched from API
      } catch (error) {
        console.log('Using fallback data');
      }
    };

    const checkImage = async () => {
      try {
        const extensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
        
        for (const ext of extensions) {
          const url = `/uploads/blogs/${params.slug}.${ext}`;
          const response = await fetch(url, { method: 'HEAD' });
          
          if (response.ok) {
            setImageUrl(url);
            setImageExists(true);
            return;
          }
        }
      } catch (error) {
        console.log('No image found for this blog');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    checkImage();
  }, [params.slug]);

  if (!blog) {
    notFound();
  }

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${blog.title}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <main>
        <Navigation />
        <section>
          <div className="container blog-container">
            <div className="blog-header">
              <p className="badge">{blog.category}</p>
              <h1>{blog.title}</h1>
              <p>{blog.description}</p>
              <div className="blog-meta">
                <span>📅 {blog.date}</span>
                <span>✍️ By TechWithTanziya</span>
              </div>
            </div>

            {!loading && (
              <div className="image-section">
                {imageExists && imageUrl ? (
                  <img src={imageUrl} alt={blog.title} />
                ) : (
                  <div className="no-image">
                    <p>📝 No blog image uploaded yet</p>
                    <p style={{ fontSize: '14px', marginTop: '8px' }}>
                      Admin can upload an image from the Blog Upload panel
                    </p>
                  </div>
                )}
              </div>
            )}

            {loading && (
              <div className="image-section">
                <div className="no-image">Loading...</div>
              </div>
            )}

            <div className="content-section">
              <h2>About This Blog</h2>
              <p>
                This blog post covers important concepts and practical insights about {blog.category}. 
                Whether you're a beginner looking to understand the fundamentals or an experienced developer 
                seeking to deepen your knowledge, this guide provides valuable information and best practices.
              </p>
              <p>
                The content is structured to help you learn progressively, starting with core concepts and 
                building up to more advanced topics. Each section includes practical examples and real-world 
                applications to reinforce your understanding.
              </p>
              <h2 style={{ marginTop: '30px' }}>Key Takeaways</h2>
              <p>
                By the end of this blog, you'll have a solid understanding of the key principles and be able 
                to apply them in your own projects. Don't hesitate to revisit sections as needed and practice 
                the concepts with your own code examples.
              </p>
            </div>

            <div className="action-buttons">
              {imageExists && imageUrl && (
                <button className="button button-primary" onClick={handleDownload}>
                  ⬇️ Download Blog Image
                </button>
              )}
              <button className="button button-secondary">📤 Share</button>
            </div>

            <div className="back-link">
              <Link href="/blog" className="button button-secondary">
                ← Back to Blogs
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
