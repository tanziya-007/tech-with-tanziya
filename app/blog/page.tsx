'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { fetchBlogs } from "@/lib/api";

const styles = `
.blogs-page { 
  padding: 100px 0;
  background: linear-gradient(180deg, #ffffff 0%, #f9f7ff 100%);
}

.blog-card { 
  background: white; 
  border-radius: 24px; 
  overflow: hidden; 
  text-decoration: none; 
  color: inherit; 
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08); 
  transition: 0.4s; 
  display: flex; 
  flex-direction: column; 
  border: 1px solid #f0f0f0;
  position: relative;
}

.blog-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #7C3AED, #EC4899);
  border-radius: 24px 24px 0 0;
}

.blog-card:hover { 
  transform: translateY(-12px); 
  box-shadow: 0 30px 70px rgba(124, 58, 237, 0.15); 
  border-color: #7C3AED;
}

.blog-content { 
  padding: 35px; 
  display: flex; 
  flex-direction: column; 
  flex: 1;
}

.blog-category { 
  display: inline-block; 
  background: linear-gradient(135deg, #F3E8FF, #FCE7F3);
  color: #7C3AED; 
  padding: 8px 16px; 
  border-radius: 30px; 
  font-size: 13px; 
  font-weight: 700;
  width: max-content; 
  margin-bottom: 18px;
  border: 1px solid #E9D5FF;
}

.blog-content h3 { 
  font-size: 26px; 
  margin-bottom: 15px; 
  font-family: Poppins, sans-serif;
  color: #111827;
  line-height: 1.3;
}

.blog-content p { 
  color: #666; 
  line-height: 1.8; 
  flex: 1;
  font-size: 15px;
}

.blog-footer { 
  margin-top: 25px; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  font-size: 14px; 
  color: #999;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.read-blog { 
  color: #7C3AED; 
  font-weight: 700; 
  transition: 0.3s;
}

.blog-card:hover .read-blog { 
  transform: translateX(6px);
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

            {loading && <p style={{ textAlign: 'center', color: '#9CA3AF' }}>Loading...</p>}
            {!loading && blogPosts.length === 0 && (
              <p style={{ textAlign: 'center', color: '#9CA3AF' }}>No blog posts published yet.</p>
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
