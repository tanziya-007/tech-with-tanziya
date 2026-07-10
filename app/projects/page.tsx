'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { fetchProjects } from "@/lib/api";
import { projects } from "@/data/content";

const styles = `
@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
@keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

.projects-page { padding: 90px 0; position: relative; overflow: hidden; }
.projects-page::before { content: ''; position: absolute; top: -50%; left: -10%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
.projects-page::after { content: ''; position: absolute; bottom: -30%; right: -5%; width: 350px; height: 350px; background: radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }

.projects-grid { display: grid; gap: 30px; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); position: relative; z-index: 1; }

.project-card { background: white; border-radius: 20px; padding: 30px; border: 1px solid #E5E7EB; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04); position: relative; overflow: hidden; animation: slideInUp 0.6s ease-out forwards; }
.project-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #7C3AED, #EC4899); }
.project-card::after { content: ''; position: absolute; top: -50%; right: -50%; width: 200px; height: 200px; background: radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%); border-radius: 50%; }

.project-card:hover { transform: translateY(-12px); box-shadow: 0 25px 50px rgba(124, 58, 237, 0.15); }
.project-card:hover h3 { animation: float 3s ease-in-out infinite; }

.project-card h3 { font-size: 20px; font-weight: 700; margin-bottom: 12px; background: linear-gradient(135deg, #7C3AED, #EC4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; transition: 0.3s; }

.project-card p { color: #6B7280; line-height: 1.8; margin-bottom: 18px; }

.tech-stack { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
.tech-stack span { background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.1)); color: #7C3AED; padding: 8px 14px; border-radius: 10px; font-size: 0.85rem; font-weight: 500; border: 1px solid rgba(124, 58, 237, 0.2); transition: 0.3s; }
.tech-stack span:hover { background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(236, 72, 153, 0.2)); transform: translateY(-2px); }

.project-buttons { display: flex; gap: 12px; flex-wrap: wrap; }
.project-buttons .button { padding: 12px 20px; border-radius: 10px; font-weight: 600; transition: all 0.3s; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; font-size: 0.95rem; border: none; cursor: pointer; }

.project-buttons .button-primary { background: linear-gradient(135deg, #7C3AED, #EC4899); color: white; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3); }
.project-buttons .button-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4); }

.project-buttons .button-secondary { background: #F3F4F6; color: #374151; border: 1px solid #E5E7EB; }
.project-buttons .button-secondary:hover { background: linear-gradient(135deg, #E5E7EB, #D1D5DB); transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); }

@media (max-width: 900px) { 
  .projects-grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
  .projects-page::before { width: 300px; height: 300px; }
  .projects-page::after { width: 250px; height: 250px; }
}

@media (max-width: 600px) { 
  .projects-page { padding: 60px 0; }
  .project-card { padding: 20px; }
  .project-buttons { flex-direction: column; }
  .project-buttons .button { width: 100%; }
  .project-card h3 { font-size: 18px; }
}
`;

export default function ProjectsPage() {
  const [projectList, setProjectList] = useState(projects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProjects();
        setProjectList(data);
      } catch (error) {
        console.log('Using fallback project data');
        setProjectList(projects);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
            <div className="projects-grid">
              {projectList.map((project) => (
                <div className="project-card" key={project.slug}>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tech-stack">
                    {project.tech.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                  <div className="project-buttons">
                    <Link href={`/projects/${project.slug}`} className="button button-primary">
                      View Project
                    </Link>
                    <a href={project.github} target="_blank" rel="noreferrer" className="button button-secondary">
                      GitHub
                    </a>
                    <a href={project.demo} target="_blank" rel="noreferrer" className="button button-secondary">
                      Live Demo
                    </a>
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
