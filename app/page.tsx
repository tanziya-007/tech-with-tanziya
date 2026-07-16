'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import Hero from "@/components/hero/hero";
import { SectionHeading } from "@/components/SectionHeading";

import {
  fetchCheatSheets,
  fetchBlogs,
  fetchProjects,
  fetchRoadmaps,
  fetchResources,
} from "@/lib/api";
import {
  blogs,
  projects,
  roadmaps,
  resources,
} from "@/data/content";
import { getTechLogo } from "@/lib/techLogos";

const styles = `
/* ===========================
   FEATURES SECTION
=========================== */
.features {
    padding: 60px 0;
    background: var(--background);
}

.heading {
    text-align: center;
    max-width: 760px;
    margin: 0 auto 40px;
}

.heading h2 {
    font-size: 3rem;
    margin: 20px 0;
    font-family: 'Poppins', sans-serif;
    line-height: 1.2;
}

.sectionTag {
    display: inline-flex;
    padding: 10px 18px;
    background: #F3E8FF;
    color: var(--primary);
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1px;
}

.featureGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
}

.featureCard {
    background: var(--surface);
    border-radius: var(--radius-lg);
    padding: 35px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    transition: var(--transition-smooth);
}

.featureCard:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: var(--shadow-premium);
    border-color: var(--primary);
}

.featureNumber {
    width: 55px;
    height: 55px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gradient);
    color: #fff;
    font-weight: 700;
    margin-bottom: 25px;
}

.featureCard h3 {
    margin-bottom: 18px;
    font-size: 24px;
}

/* ===========================
   GENERIC CONTENT SECTIONS
=========================== */
.contentSection {
    padding: 60px 0;
}

.alternate {
    background: var(--background);
}

.contentGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 35px;
}

.contentCard {
    background: var(--surface);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
    padding: 32px;
    box-shadow: var(--shadow-sm);
    transition: var(--transition-smooth);
    display: flex;
    flex-direction: column;
}

.contentCard:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: var(--shadow-premium);
    border-color: var(--primary);
}

.cardTop {
    margin-bottom: 25px;
}

.cardCategory {
    display: inline-flex;
    padding: 8px 18px;
    border-radius: 50px;
    background: #F3E8FF;
    color: var(--primary);
    font-size: 13px;
    font-weight: 600;
}

.contentCard h3, .blogContent h3 {
    font-size: 24px;
    margin-bottom: 18px;
    font-family: 'Poppins', sans-serif;
}

.contentCard p {
    flex: 1;
}

.cardBottom {
    margin-top: 35px;
    color: var(--primary);
    font-weight: 700;
}

/* ===========================
   BLOG CARDS
=========================== */
.blogCard {
    overflow: hidden;
    border-radius: var(--radius-lg);
    background: var(--surface);
    border: 1px solid var(--border);
    transition: var(--transition-smooth);
    display: flex;
    flex-direction: column;
}

.blogCard:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: var(--shadow-premium);
    border-color: var(--primary);
}

.blogCover {
    height: 220px;
    background: var(--gradient);
    position: relative;
}

.blogOverlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    letter-spacing: 2px;
    font-weight: 700;
}

.blogContent {
    padding: 30px;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.blogFooter {
    margin-top: 35px;
    display: flex;
    justify-content: space-between;
    color: var(--primary);
    font-weight: 600;
}

/* ===========================
   PROJECT CARDS
=========================== */
.projectCard {
    background: var(--surface);
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 1px solid var(--border);
    transition: var(--transition-smooth);
    display: flex;
    flex-direction: column;
}

.projectCard:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: var(--shadow-premium);
    border-color: var(--primary);
}

.projectBanner {
    height: 200px;
    background: var(--gradient);
    display: flex;
    align-items: center;
    justify-content: center;
}

.projectBannerContent {
    text-align: center;
    color: white;
}

.projectBannerContent span {
    letter-spacing: 2px;
    font-size: 13px;
}

.projectBannerContent h4 {
    margin-top: 10px;
    font-size: 30px;
}

.projectContent {
    padding: 30px;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.techList {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 25px;
}

.techList span {
    padding: 8px 14px;
    border-radius: 40px;
    background: #F3E8FF;
    color: var(--primary);
    font-size: 13px;
}

.projectFooter {
    margin-top: 30px;
    color: var(--primary);
    font-weight: 700;
}

/* ===========================
   ROADMAP CARDS
=========================== */
.roadmapGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 30px;
}

.roadmapCard {
    background: var(--surface);
    border-radius: var(--radius-lg);
    padding: 35px;
    border: 1px solid var(--border);
    transition: var(--transition-smooth);
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
}

.roadmapCard:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: var(--shadow-premium);
    border-color: var(--primary);
}

.roadmapHead {
    display: flex;
    gap: 20px;
}

.roadmapIndex {
    width: 60px;
    height: 60px;
    background: var(--gradient);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    font-weight: 700;
    flex-shrink: 0;
}

.roadmapHead h3 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
}

.roadmapHead p {
    color: var(--text-muted);
    font-size: 0.95rem;
}

.roadmapLine {
    height: 1px;
    background: var(--border);
    margin: 30px 0;
}

.roadmapCard ul {
    margin: 0;
    padding-left: 18px;
    flex: 1;
    list-style: none;
}

.roadmapCard li {
    margin-bottom: 14px;
    color: var(--text-muted);
}

.roadmapFooter {
    margin-top: 30px;
    color: var(--primary);
    font-weight: 700;
}

/* ===========================
   CTA SECTION
=========================== */
.cta {
    padding: 60px 0;
}

.ctaBox {
    background: var(--gradient);
    border-radius: 30px;
    padding: 80px;
    color: white;
    text-align: center;
}

.ctaBox h2 {
    font-size: 3rem;
    margin: 25px 0;
    color: white;
}

.ctaBox p {
    max-width: 650px;
    margin: auto;
    color: rgba(255, 255, 255, 0.9);
}

.ctaButtons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 40px;
}

/* ===========================
   NEWSLETTER SECTION
=========================== */
.newsletter {
    padding-bottom: 60px;
}

.newsletterBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 50px;
}

.newsletterBox h2 {
    font-size: 2.5rem;
    margin-bottom: 20px;
}

.newsletterForm {
    display: flex;
    gap: 15px;
}

.newsletterForm input {
    width: 360px;
    padding: 16px;
    border-radius: 14px;
    border: 1px solid var(--border);
    outline: none;
    transition: var(--transition-smooth);
}

.newsletterForm input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

/* ===========================
   RESPONSIVE
=========================== */
@media(max-width: 900px) {
    .heading h2 {
        font-size: 2.2rem;
    }
    .newsletterBox {
        flex-direction: column;
    }
    .newsletterForm {
        width: 100%;
        flex-direction: column;
    }
    .newsletterForm input {
        width: 100%;
    }
    .ctaBox {
        padding: 50px 30px;
    }
    .ctaButtons {
        flex-direction: column;
    }
}
`;

export default function HomePage() {
  const [sheets, setSheets] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState(blogs);
  const [projectList, setProjectList] = useState(projects);
  const [roadmapList, setRoadmapList] = useState(roadmaps);
  const [resourceList, setResourceList] = useState(resources);

  useEffect(() => {
    fetchCheatSheets()
      .then(data => setSheets(data.filter((s: any) => s.googleDriveId)))
      .catch(() => {});
    fetchBlogs().then(setBlogPosts).catch(() => {});
    fetchProjects().then(setProjectList).catch(() => {});
    fetchRoadmaps().then(setRoadmapList).catch(() => {});
    fetchResources().then(setResourceList).catch(() => {});
  }, []);

  return (
    <>
      <style>{styles}</style>
      <main>
        <Navigation />
        <Hero />

        {/* ================================= FEATURES ================================= */}
        <section className="features">
          <div className="container">
            <div className="heading">
              <span className="sectionTag">WHY TechWithTanziya</span>
              <h2>
                Learn Programming With
                <br />
                Confidence
              </h2>
              <p>
                High-quality content designed to help students
                understand concepts quickly and build real skills.
              </p>
            </div>

            <div className="featureGrid">
              <div className="featureCard">
                <div className="featureNumber">01</div>
                <h3>Cheat Sheets</h3>
                <p>
                  Concise notes covering programming,
                  databases, web development and more.
                </p>
              </div>

              <div className="featureCard">
                <div className="featureNumber">02</div>
                <h3>Projects</h3>
                <p>
                  Learn by building practical projects
                  with complete explanations.
                </p>
              </div>

              <div className="featureCard">
                <div className="featureNumber">03</div>
                <h3>Blogs</h3>
                <p>
                  Articles focused on concepts,
                  interview preparation and career growth.
                </p>
              </div>

              <div className="featureCard">
                <div className="featureNumber">04</div>
                <h3>Roadmaps</h3>
                <p>
                  Structured learning paths from beginner
                  to advanced.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================= CHEAT SHEETS ================================= */}
        <section className="contentSection">
          <div className="container">
            <SectionHeading
              title="Latest Cheat Sheets"
              description="Quick references for faster learning."
              action={
                <Link href="/cheatsheets" className="button button-secondary">
                  View All
                </Link>
              }
            />

            <div className="contentGrid">
              {sheets.slice(0, 6).map((sheet) => {
                const logo = getTechLogo(sheet.title) || getTechLogo(sheet.slug);
                return (
                  <Link
                    key={sheet.slug}
                    href={`/cheatsheets/${sheet.slug}`}
                    className="contentCard"
                  >
                    <div className="cardTop" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg,#f3e8ff,#fce7f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10, flexShrink: 0 }}>
                        {logo
                          ? <img src={logo} alt={sheet.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          : <span style={{ fontSize: 24 }}>📘</span>}
                      </div>
                      {sheet.category && <span className="cardCategory">{sheet.category}</span>}
                    </div>
                    <h3>{sheet.title}</h3>
                    <p>{sheet.description}</p>
                    <div className="cardBottom">
                      <span>Read Guide</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================================= BLOGS ================================= */}
        <section className="contentSection alternate">
          <div className="container">
            <SectionHeading
              title="Latest Blogs"
              description="Programming articles and learning resources."
              action={
                <Link href="/blog" className="button button-secondary">
                  View All
                </Link>
              }
            />

            <div className="contentGrid">
              {blogPosts.map((blog) => (
                <Link
                  key={blog.slug}
                  href={`/blog/${blog.slug}`}
                  className="blogCard"
                >
                  <div className="blogCover">
                    <div className="blogOverlay">
                      <span>TechWithTanziya</span>
                    </div>
                  </div>
                  <div className="blogContent">
                    <span className="cardCategory">{blog.category}</span>
                    <h3>{blog.title}</h3>
                    <p>{blog.description}</p>
                    <div className="blogFooter">
                      <small>{blog.date}</small>
                      <span>Read Article →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================================= PROJECTS ================================= */}
        <section className="contentSection">
          <div className="container">
            <SectionHeading
              title="Featured Projects"
              description="Projects that demonstrate practical software development skills."
              action={
                <Link href="/projects" className="button button-secondary">
                  View All
                </Link>
              }
            />

            <div className="contentGrid">
              {projectList.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="projectCard"
                >
                  <div className="projectBanner">
                    <div className="projectBannerContent">
                      <span>PROJECT</span>
                      <h4>{project.title}</h4>
                    </div>
                  </div>
                  <div className="projectContent">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="techList">
                      {project.tech.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                    <div className="projectFooter">
                      <span>View Project →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================================= ROADMAPS ================================= */}
        <section className="contentSection alternate">
          <div className="container">
            <SectionHeading
              title="Learning Roadmaps"
              description="Follow structured learning paths and become job-ready."
              action={
                <Link href="/roadmaps" className="button button-secondary">
                  Explore
                </Link>
              }
            />

            <div className="roadmapGrid">
              {roadmapList.slice(0, 3).map((roadmap, index) => (
                <Link
                  key={roadmap.slug}
                  href={`/roadmaps/${roadmap.slug}`}
                  className="roadmapCard"
                >
                  <div className="roadmapHead">
                    <div className="roadmapIndex">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <h3>{roadmap.title}</h3>
                      <p>{roadmap.description}</p>
                    </div>
                  </div>
                  <div className="roadmapLine"></div>
                  <ul>
                    {roadmap.steps.slice(0, 5).map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                  <div className="roadmapFooter">View Roadmap →</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================================= RESOURCES ================================= */}
        <section className="contentSection">
          <div className="container">
            <SectionHeading
              title="Resources"
              description="Useful templates, notes and downloadable materials."
              action={
                <Link href="/resources" className="button button-secondary">
                  Browse
                </Link>
              }
            />

            <div className="contentGrid">
              {resourceList.map((resource) => (
                <article key={resource.slug} className="contentCard">
                  <div className="cardTop">
                    <span className="cardCategory">{resource.tag}</span>
                  </div>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <div className="cardBottom">Download →</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================================= CTA ================================= */}
        <section className="cta">
          <div className="container">
            <div className="ctaBox">
              <span className="sectionTag">START LEARNING TODAY</span>
              <h2>
                Build Your Skills
                <br />
                One Step At A Time
              </h2>
              <p>
                Explore structured tutorials, projects,
                blogs and cheat sheets designed for
                aspiring developers.
              </p>
              <div className="ctaButtons">
                <Link href="/cheatsheets" className="button button-primary">
                  Start Learning
                </Link>
                <Link href="/projects" className="button button-secondary">
                  Explore Projects
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================================= NEWSLETTER ================================= */}
        <section className="newsletter">
          <div className="container newsletterBox">
            <div>
              <h2>Stay Updated</h2>
              <p>
                Get notified whenever new blogs,
                projects, cheat sheets and resources
                are published.
              </p>
            </div>
            <form className="newsletterForm">
              <input
                type="email"
                placeholder="Enter your email address"
              />
              <button type="submit" className="button button-primary">
                Subscribe
              </button>
            </form>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
