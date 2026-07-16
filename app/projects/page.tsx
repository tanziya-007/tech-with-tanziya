'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { fetchProjects } from "@/lib/api";
import { getTechLogo } from "@/lib/techLogos";

const styles = `
@keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

.projects-page { padding: 90px 0; }
.projects-grid { display: grid; gap: 30px; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }

.project-card { background: white; border-radius: 20px; padding: 30px; border: 1px solid #E5E7EB; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 10px 30px rgba(0,0,0,0.04); position: relative; overflow: hidden; animation: slideInUp 0.6s ease-out forwards; }
.project-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #7C3AED, #EC4899); }
.project-card:hover { transform: translateY(-12px); box-shadow: 0 25px 50px rgba(124,58,237,0.15); }

.project-card h3 { font-size: 20px; font-weight: 700; margin-bottom: 12px; background: linear-gradient(135deg, #7C3AED, #EC4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.project-card p { color: #6B7280; line-height: 1.8; margin-bottom: 18px; }

.tech-stack { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
.tech-stack span { background: linear-gradient(135deg, rgba(124,58,237,0.1), rgba(236,72,153,0.1)); color: #7C3AED; padding: 6px 12px; border-radius: 10px; font-size: 0.85rem; font-weight: 500; border: 1px solid rgba(124,58,237,0.2); display: inline-flex; align-items: center; gap: 6px; }
.tech-stack span img { width: 18px; height: 18px; object-fit: contain; }

.project-buttons { display: flex; gap: 12px; flex-wrap: wrap; }
.project-buttons .btn { padding: 12px 20px; border-radius: 10px; font-weight: 600; transition: 0.3s; text-decoration: none; display: inline-flex; align-items: center; font-size: 0.95rem; border: none; cursor: pointer; }
.project-buttons .btn-primary { background: linear-gradient(135deg, #7C3AED, #EC4899); color: white; box-shadow: 0 4px 15px rgba(124,58,237,0.3); }
.project-buttons .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(124,58,237,0.4); }
.project-buttons .btn-secondary { background: #F3F4F6; color: #374151; border: 1px solid #E5E7EB; }
.project-buttons .btn-secondary:hover { background: #E5E7EB; transform: translateY(-2px); }

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

  useEffect(() => {
    fetchProjects()
      .then(data => setProjectList(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
            {loading && <p style={{ textAlign: 'center', color: '#9CA3AF' }}>Loading...</p>}
            {!loading && projectList.length === 0 && (
              <p style={{ textAlign: 'center', color: '#9CA3AF' }}>No projects added yet.</p>
            )}
            <div className="projects-grid">
              {projectList.map((project) => (
                <div className="project-card" key={project.slug}>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tech-stack">
                    {(project.tech || []).map((t: string) => {
                      const logo = getTechLogo(t);
                      return (
                        <span key={t}>
                          {logo && <img src={logo} alt={t} />}
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
