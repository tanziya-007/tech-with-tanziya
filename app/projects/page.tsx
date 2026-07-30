'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { fetchProjects } from "@/lib/api";
import { getTechLogo } from "@/lib/techLogos";

const styles = `
@keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

.projects-page { padding: 90px 0; background: var(--bg); transition: background 0.5s ease; min-height: 100vh; }
.projects-grid { display: grid; gap: 30px; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }

/* --- Top Actions (Search & Banner) --- */
.top-actions { margin-bottom: 50px; display: flex; flex-direction: column; gap: 30px; }

.search-wrapper { position: relative; width: 100%; max-width: 600px; margin: 0 auto; }
.search-input { width: 100%; padding: 16px 24px; padding-left: 50px; border-radius: 99px; border: 1px solid var(--border); background: var(--surface); color: var(--text); font-size: 15px; transition: all 0.3s ease; box-shadow: var(--shadow); }
.search-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15); }
.search-icon { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: var(--text-secondary); width: 18px; height: 18px; }

.custom-banner { background: linear-gradient(135deg, #7b61b6 0%, #90387c 100%); border-radius: 20px; padding: 35px 40px; display: flex; align-items: center; justify-content: space-between; gap: 20px; color: white; box-shadow: var(--shadow); position: relative; overflow: hidden; }
.custom-banner::before { content: ''; position: absolute; top: -50%; right: -10%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
.banner-content h3 { font-size: 24px; font-family: 'Poppins', sans-serif; margin-bottom: 8px; font-weight: 700; color: white; position: relative; z-index: 1; }
.banner-content p { font-size: 15px; opacity: 0.9; margin: 0; color: white; max-width: 650px; line-height: 1.6; position: relative; z-index: 1; }

.banner-btn { background: #ffffff; color: #9b2eaa; padding: 12px 28px; border-radius: 12px; font-weight: 700; text-decoration: none; transition: 0.3s; white-space: nowrap; box-shadow: 0 4px 15px rgba(0,0,0,0.15); position: relative; z-index: 1; display: inline-block; }
.banner-btn:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 8px 25px rgba(0,0,0,0.25); background: #f3f4f6; color: #5b21b6; }

/* --- Project Cards --- */
.project-card { background: var(--surface); border-radius: 20px; padding: 30px; border: 1px solid var(--border); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: var(--shadow); position: relative; overflow: hidden; animation: slideInUp 0.6s ease-out backwards; }
.project-card:nth-child(2) { animation-delay: 0.1s; }
.project-card:nth-child(3) { animation-delay: 0.2s; }
.project-card:nth-child(4) { animation-delay: 0.3s; }

.project-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: var(--gradient); }
.project-card:hover { transform: translateY(-12px); box-shadow: var(--shadow-hover); border-color: var(--primary); }

.project-card h3 { font-size: 20px; font-weight: 700; margin-bottom: 12px; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.project-card p { color: var(--text-secondary); line-height: 1.8; margin-bottom: 18px; transition: color 0.3s ease; }

.tech-stack { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
.tech-stack .tech-badge { background: var(--tag-bg); color: var(--tag-text); padding: 6px 12px; border-radius: 10px; font-size: 0.85rem; font-weight: 600; border: 1px solid var(--border); display: inline-flex; align-items: center; gap: 8px; transition: all 0.3s ease; }
.tech-stack .tech-badge img { width: 16px; height: 16px; object-fit: contain; flex-shrink: 0; }
.project-card:hover .tech-stack .tech-badge { border-color: var(--primary); }

.project-buttons { display: flex; gap: 12px; flex-wrap: wrap; }
.project-buttons .btn { padding: 12px 20px; border-radius: 10px; font-weight: 600; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); text-decoration: none; display: inline-flex; align-items: center; font-size: 0.95rem; border: none; cursor: pointer; }
.project-buttons .btn-primary { background: var(--gradient); color: white; box-shadow: 0 4px 15px rgba(168, 85, 247, 0.2); }
.project-buttons .btn-primary:hover { transform: translateY(-3px) scale(1.02); box-shadow: var(--shadow-hover); }
.project-buttons .btn-secondary { background: transparent; color: var(--text); border: 2px solid var(--primary); }
.project-buttons .btn-secondary:hover { background: var(--surface-alt); transform: translateY(-2px); box-shadow: 0 5px 15px rgba(168, 85, 247, 0.15); }

.no-results { text-align: center; color: var(--text-secondary); padding: 60px 20px; background: var(--surface); border-radius: 20px; border: 1px solid var(--border); }

@media (max-width: 900px) {
  .custom-banner { flex-direction: column; text-align: center; padding: 25px; }
  .banner-btn { width: 100%; text-align: center; }
}

@media (max-width: 600px) {
  .projects-page { padding: 60px 0; }
  .project-card { padding: 20px; }
  .project-buttons { flex-direction: column; }
  .project-buttons .btn { width: 100%; justify-content: center; }
}
`;

export default function ProjectsPage() {
  const [projectList, setProjectList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProjects()
      .then(data => setProjectList(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projectList;
    const query = searchQuery.toLowerCase();
    return projectList.filter(project => 
      project.title.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query) ||
      project.tech?.some((t: string) => t.toLowerCase().includes(query))
    );
  }, [projectList, searchQuery]);

  return (
    <>
      <style>{styles}</style>
      <main>
        <Navigation />
        <section className="projects-page">
          <div className="container">
            
            <SectionHeading
              title="Projects"
              description="Build real-world applications and strengthen your development skills."
            />

            <div className="top-actions">
              <div className="search-wrapper">
                <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Search projects by name, tech, or keywords..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="custom-banner">
                <div className="banner-content">
                  <h3>Need a Custom Project Built?</h3>
                  <p>Whether it's a deep learning image classification system, a full-stack web app, or a placement-ready academic project, we build tailored, high-quality solutions specifically for your requirements.</p>
                </div>
                <a 
                  href="https://wa.me/919900378826?text=Hi! I am interested in getting a custom project built." 
                  target="_blank" 
                  rel="noreferrer" 
                  className="banner-btn"
                >
                  Discuss Your Idea
                </a>
              </div>
            </div>

            {loading && <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading projects...</p>}
            
            {!loading && projectList.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No projects added yet.</p>
            )}

            {!loading && projectList.length > 0 && filteredProjects.length === 0 && (
              <div className="no-results">
                <h3>No projects found</h3>
                <p>We couldn't find any projects matching "{searchQuery}". Try adjusting your search.</p>
              </div>
            )}

            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <div className="project-card" key={project.slug}>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tech-stack">
                    {(project.tech || []).map((t: string) => {
                      const logo = getTechLogo(t);
                      return (
                        <span key={t} className="tech-badge">
                          {logo && (
                            <img 
                              src={logo} 
                              alt={t} 
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          )}
                          {t}
                        </span>
                      );
                    })}
                  </div>
                  <div className="project-buttons">
                    <Link href={`/projects/${project.slug}`} className="btn btn-primary">View Project</Link>
                    {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="btn btn-secondary">GitHub</a>}
                    {project.demo && <a href={project.demo} target="_blank" rel="noreferrer" className="btn btn-secondary">Live Demo</a>}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}