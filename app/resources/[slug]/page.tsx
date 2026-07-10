'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { resources } from '@/data/content';

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const styles = `
.resource-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 0;
}

.resource-header {
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

.resource-header h1 {
  font-size: 2.75rem;
  margin: 18px 0 12px;
  font-family: Poppins, sans-serif;
  color: #111827;
}

.resource-header p {
  color: #6B7280;
  font-size: 1.05rem;
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

.content-section ul {
  margin-left: 20px;
  margin-bottom: 16px;
}

.content-section li {
  margin-bottom: 8px;
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
  .resource-header h1 {
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

export default function ResourceDetailPage({ params: paramsPromise }: PageProps) {
  const params = use(paramsPromise);
  const resource = resources.find((item) => item.slug === params.slug);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageExists, setImageExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkImage = async () => {
      try {
        const extensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
        
        for (const ext of extensions) {
          const url = `/uploads/resources/${params.slug}.${ext}`;
          const response = await fetch(url, { method: 'HEAD' });
          
          if (response.ok) {
            setImageUrl(url);
            setImageExists(true);
            return;
          }
        }
      } catch (error) {
        console.log('No image found for this resource');
      } finally {
        setLoading(false);
      }
    };

    checkImage();
  }, [params.slug]);

  if (!resource) {
    notFound();
  }

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${resource.title}.png`;
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
          <div className="container resource-container">
            <div className="resource-header">
              <p className="badge">{resource.tag}</p>
              <h1>{resource.title}</h1>
              <p>{resource.description}</p>
            </div>

            {!loading && (
              <div className="image-section">
                {imageExists && imageUrl ? (
                  <img src={imageUrl} alt={resource.title} />
                ) : (
                  <div className="no-image">
                    <p>📄 No resource image uploaded yet</p>
                    <p style={{ fontSize: '14px', marginTop: '8px' }}>
                      Admin can upload an image from the Resource Upload panel
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
              <h2>About This Resource</h2>
              <p>
                {resource.title} is a valuable resource designed to help you in your learning and development journey. 
                This {resource.tag.toLowerCase()} provides practical guidance and actionable insights that you can 
                immediately apply to your projects.
              </p>
              
              <h2 style={{ marginTop: '30px' }}>What You'll Get</h2>
              <ul>
                <li>Comprehensive and well-organized content</li>
                <li>Practical examples and use cases</li>
                <li>Best practices and industry standards</li>
                <li>Easy-to-follow structure</li>
                <li>Downloadable materials and templates</li>
              </ul>

              <h2 style={{ marginTop: '30px' }}>How to Use This Resource</h2>
              <p>
                This resource is designed to be flexible and can be used in multiple ways. Whether you're looking for 
                quick reference material or comprehensive learning content, you'll find valuable information here. 
                Feel free to download and share with your team or colleagues.
              </p>
            </div>

            <div className="action-buttons">
              {imageExists && imageUrl && (
                <button className="button button-primary" onClick={handleDownload}>
                  ⬇️ Download Resource
                </button>
              )}
              <button className="button button-secondary">📤 Share</button>
            </div>

            <div className="back-link">
              <Link href="/resources" className="button button-secondary">
                ← Back to Resources
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
