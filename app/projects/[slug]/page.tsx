'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { fetchProject } from '@/lib/api';
import { projects } from '@/data/content';

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const styles = `
.project-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 0;
}

.project-header {
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

.project-header h1 {
  font-size: 2.75rem;
  margin: 18px 0 12px;
  font-family: Poppins, sans-serif;
  color: #111827;
}

.project-header p {
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

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 30px;
}

.tech-badge {
  background: linear-gradient(135deg, rgba(108, 59, 255, 0.1), rgba(45, 125, 255, 0.1));
  color: #6C3BFF;
  padding: 10px 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid rgba(108, 59, 255, 0.2);
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
  .project-header h1 {
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

export default function ProjectDetailPage({ params: paramsPromise }: PageProps) {
  const params = use(paramsPromise);
  const project = projects.find((item) => item.slug === params.slug);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageExists, setImageExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProject(params.slug);
        // Data fetched from API
      } catch (error) {
        console.log('Using fallback data');
      }
    };

    const checkImage = async () => {
      try {
        const extensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
        
        for (const ext of extensions) {
          const url = `/uploads/projects/${params.slug}.${ext}`;
          const response = await fetch(url, { method: 'HEAD' });
          
          if (response.ok) {
            setImageUrl(url);
            setImageExists(true);
            return;
          }
        }
      } catch (error) {
        console.log('No image found for this project');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    checkImage();
  }, [params.slug]);

  if (!project) {
    notFound();
  }

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${project.title}.png`;
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
          <div className="container project-container">
            <div className="project-header">
              <p className="badge">Project</p>
              <h1>{project.title}</h1>
              <p>{project.description}</p>
            </div>

            {!loading && (
              <div className="image-section">
                {imageExists && imageUrl ? (
                  <img src={imageUrl} alt={project.title} />
                ) : (
                  <div className="no-image">
                    <p>🖼️ No project image uploaded yet</p>
                    <p style={{ fontSize: '14px', marginTop: '8px' }}>
                      Admin can upload an image from the Project Upload panel
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

            <div className="tech-stack">
              {project.tech.map((tech) => (
                <span key={tech} className="tech-badge">{tech}</span>
              ))}
            </div>

            <div className="content-section">
              <h2>Project Overview</h2>
              <p>
                {project.title} is a comprehensive project that demonstrates modern development practices 
                and best practices in software engineering. This project showcases the integration of multiple 
                technologies and architectural patterns.
              </p>
              
              <h2 style={{ marginTop: '30px' }}>Key Features</h2>
              <ul>
                <li>Clean and maintainable code architecture</li>
                <li>Responsive and user-friendly interface</li>
                <li>Scalable backend infrastructure</li>
                <li>Comprehensive error handling</li>
                <li>Performance optimized</li>
              </ul>

              <h2 style={{ marginTop: '30px' }}>Technologies Used</h2>
              <p>
                This project leverages {project.tech.join(', ')} to create a robust and efficient solution. 
                Each technology was carefully selected to ensure optimal performance and maintainability.
              </p>
            </div>

            <div className="action-buttons">
              {imageExists && imageUrl && (
                <button className="button button-primary" onClick={handleDownload}>
                  ⬇️ Download Project Image
                </button>
              )}
              <a href={project.github} target="_blank" rel="noreferrer" className="button button-secondary">
                🔗 View on GitHub
              </a>
              <a href={project.demo} target="_blank" rel="noreferrer" className="button button-secondary">
                🚀 Live Demo
              </a>
            </div>

            <div className="back-link">
              <Link href="/projects" className="button button-secondary">
                ← Back to Projects
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
