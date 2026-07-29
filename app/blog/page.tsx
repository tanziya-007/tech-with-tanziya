'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { fetchBlogs } from "@/lib/api";

const styles = `
@keyframes slideInUp { 
  from { opacity: 0; transform: translateY(30px); } 
  to { opacity: 1; transform: translateY(0); } 
}

.blogs-page { 
  padding: 100px 0;
  background: var(--bg);
  min-height: 100vh;
  transition: background 0.5s ease;
}

.blog-card { 
  background: var(--surface); 
  border-radius: 24px; 
  overflow: hidden; 
  text-decoration: none; 
  color: inherit; 
  box-shadow: var(--shadow); 
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
  display: flex; 
  flex-direction: column; 
  border: 1px solid var(--border);
  position: relative;
  animation: slideInUp 0.6s ease-out backwards;
}

/* Staggered load effect */
.blog-card:nth-child(2) { animation-delay: 0.1s; }
.blog-card:nth-child(3) { animation-delay: 0.2s; }
.blog-card:nth-child(4) { animation-delay: 0.3s; }
.blog-card:nth-child(5) { animation-delay: 0.4s; }
.blog-card:nth-child(6) { animation-delay: 0.5s; }

.blog-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient);
  border-radius: 24px 24px 0 0;
  opacity: 0.8;
  transition: 0.4s;
}

.blog-card:hover { 
  transform: translateY(-12px); 
  box-shadow: var(--shadow-hover); 
  border-color: var(--primary);
}

.blog-card:hover::before {
  opacity: 1;
}

.blog-content { 
  padding: 35px; 
  display: flex; 
  flex-direction: column; 
  flex: 1;
}

.blog-category { 
  display: inline-block; 
  background: var(--tag-bg);
  color: var(--tag-text); 
  padding: 8px 16px; 
  border-radius: 30px; 
  font-size: 13px; 
  font-weight: 700;
  width: max-content; 
  margin-bottom: 18px;
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}

.blog-card:hover .blog-category {
  border-color: var(--primary);
}

.blog-content h3 { 
  font-size: 26px; 
  margin-bottom: 15px; 
  font-family: 'Poppins', sans-serif;
  color: var(--text);
  line-height: 1.3;
  transition: color 0.3s ease;
}

.blog-content p { 
  color: var(--text-secondary); 
  line-height: 1.8; 
  flex: 1;
  font-size: 15px;
  transition: color 0.3s ease;
}

.blog-footer { 
  margin-top: 25px; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  font-size: 14px; 
  color: var(--text-secondary);
  padding-top: 20px;
  border-top: 1px solid var(--border);
  transition: border-color 0.3s ease;
}

.read-blog { 
  color: var(--primary); 
  font-weight: 700; 
  transition: 0.3s;
}

.blog-card:hover .read-blog { 
  transform: translateX(6px);
  color: var(--secondary);
}

.cards { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
  gap: 30px;
}

@media(max-width: 768px) {
  .blogs-page {
    padding: 80px 0;
  }

  .blog-content { 
    padding: 25px; 
  }

  .blog-content h3 { 
    font-size: 22px; 
  }

  .cards {
    grid-template-columns: 1fr;
  }
}
`;

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs()
      .then(data => setBlogPosts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{styles}</style>
      <main>
        <Navigation />

        <section className="blogs-page">
          <div className="container">
            <SectionHeading
              title="Blogs"
              description="Explore programming tutorials, study plans, interview tips and learning experiences."
            />

            {loading && <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</p>}
            
            {!loading && blogPosts.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No blog posts published yet.</p>
            )}
            
            <div className="cards">
              {blogPosts.map((blog) => (
                <Link
                  key={blog.slug}
                  href={`/blog/${blog.slug}`}
                  className="blog-card"
                >
                  <div className="blog-content">
                    <span className="blog-category">{blog.category}</span>
                    <h3>{blog.title}</h3>
                    <p>{blog.description}</p>
                    <div className="blog-footer">
                      <span>{new Date(blog.date).toLocaleDateString()}</span>
                      <span className="read-blog">Read Blog →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}