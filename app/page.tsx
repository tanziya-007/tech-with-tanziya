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
    color: var(--text);
}

.sectionTag {
    display: inline-flex;
    padding: 10px 18px;
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.1));
    color: #7C3AED;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1px;
    border: 1px solid rgba(124, 58, 237, 0.2);
}

.featureGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
}

.featureCard {
    background: var(--surface);
    border-radius: 24px;
    padding: 35px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.featureCard:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 25px 50px rgba(124, 58, 237, 0.15);
    border-color: #7C3AED;
}

.featureNumber {
    width: 55px;
    height: 55px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #7C3AED, #EC4899);
    color: #fff;
    font-weight: 700;
    margin-bottom: 25px;
}

.featureCard h3 {
    margin-bottom: 18px;
    font-size: 24px;
    color: var(--text);
}

.featureCard p {
    color: var(--text-secondary);
    line-height: 1.7;
}

/* ===========================
   GENERIC CONTENT SECTIONS
=========================== */
.contentSection {
    padding: 60px 0;
    background: var(--bg);
    transition: background 0.5s ease;
}

.alternate {
    background: var(--surface-alt);
}

.contentGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 35px;
}

.contentCard {
    background: var(--surface);
    border-radius: 24px;
    border: 1px solid var(--border);
    padding: 32px;
    box-shadow: var(--shadow);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    position: relative;
    overflow: hidden;
}

.contentCard::before, .blogCard::before, .projectCard::before, .roadmapCard::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #7C3AED, #EC4899);
    opacity: 0.8;
    transition: 0.4s;
}

.contentCard:hover, .blogCard:hover, .projectCard:hover, .roadmapCard:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 25px 50px rgba(124, 58, 237, 0.15);
    border-color: #7C3AED;
}

.cardTop {
    margin-bottom: 25px;
}

.cardCategory {
    display: inline-flex;
    padding: 8px 18px;
    border-radius: 50px;
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.1));
    color: #7C3AED;
    font-size: 13px;
    font-weight: 600;
    border: 1px solid rgba(124, 58, 237, 0.2);
}

.contentCard h3, .blogContent h3, .projectContent h3 {
    font-size: 22px;
    margin-bottom: 15px;
    font-family: 'Poppins', sans-serif;
    color: var(--text);
    line-height: 1.4;
}

.contentCard p, .blogContent p, .projectContent p {
    flex: 1;
    color: var(--text-secondary);
    line-height: 1.7;
    font-size: 15px;
}

.cardBottom, .blogFooter, .projectFooter, .roadmapFooter {
    margin-top: 35px;
    color: #7C3AED;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* ===========================
   BLOG CARDS
=========================== */
.blogCard {
    overflow: hidden;
    border-radius: 24px;
    background: var(--surface);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    position: relative;
}

.blogContent {
    padding: 35px;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.blogFooter {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    padding-top: 20px;
    border-top: 1px solid var(--border);
}

.blogFooter span {
    color: #7C3AED;
    font-weight: 700;
}

/* ===========================
   PROJECT CARDS
=========================== */
.projectCard {
    background: var(--surface);
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    position: relative;
}

.projectContent {
    padding: 35px;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.techList {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 20px;
}

.techList span {
    padding: 6px 14px;
    border-radius: 30px;
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.1));
    color: #7C3AED;
    font-size: 12px;
    font-weight: 600;
    border: 1px solid rgba(124, 58, 237, 0.2);
}

/* ===========================
   ROADMAP CARDS
=========================== */
.roadmapGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 30px;
}

.roadmapCard {
    background: var(--surface);
    border-radius: 24px;
    padding: 35px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    position: relative;
}

.roadmapHead {
    display: flex;
    gap: 20px;
    align-items: flex-start;
}

.roadmapIndex {
    width: 55px;
    height: 55px;
    background: linear-gradient(135deg, #7C3AED, #EC4899);
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
    margin-bottom: 6px;
    color: var(--text);
}

.roadmapHead p {
    color: var(--text-secondary);
    font-size: 0.95rem;
    line-height: 1.6;
}

.roadmapLine {
    height: 1px;
    background: var(--border);
    margin: 25px 0;
}

.roadmapCard ul {
    margin: 0;
    padding-left: 18px;
    flex: 1;
    list-style: none;
}

.roadmapCard li {
    margin-bottom: 12px;
    color: var(--text-secondary);
    font-size: 14px;
    position: relative;
    padding-left: 12px;
}

.roadmapCard li::before {
    content: '•';
    color: #7C3AED;
    position: absolute;
    left: -12px;
    font-weight: bold;
}

/* ===========================
   CTA SECTION
=========================== */
.cta {
    padding: 40px 0;
    background: var(--bg);
}

.ctaBox {
    background: linear-gradient(135deg, #7C3AED, #EC4899);
    border-radius: 24px;
    padding: 45px 30px;
    color: white;
    text-align: center;
    box-shadow: 0 25px 50px rgba(124, 58, 237, 0.25);
}

.ctaBox h2 {
    font-size: 2.2rem;
    margin: 15px 0;
    color: white;
    font-family: 'Poppins', sans-serif;
}

.ctaBox p {
    max-width: 550px;
    margin: auto;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.95rem;
    line-height: 1.6;
}

.ctaButtons {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 25px;
}

/* ===========================
   NEWSLETTER SECTION
=========================== */
.newsletter {
    padding-bottom: 80px;
    background: var(--bg);
}

.newsletterBox {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 40px;
    box-shadow: var(--shadow);
}

.newsletterBox h2 {
    font-size: 2.2rem;
    margin-bottom: 12px;
    font-family: 'Poppins', sans-serif;
    color: var(--text);
}

.newsletterBox p {
    color: var(--text-secondary);
    line-height: 1.6;
}

.newsletterForm {
    display: flex;
    gap: 12px;
}

.newsletterForm input {
    width: 320px;
    padding: 15px 20px;
    border-radius: 14px;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--text);
    outline: none;
    font-size: 15px;
    transition: all 0.3s ease;
}

.newsletterForm input:focus {
    border-color: #7C3AED;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
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
        padding: 30px;
    }
    .newsletterForm {
        width: 100%;
        flex-direction: column;
    }
    .newsletterForm input {
        width: 100%;
    }
    .ctaBox {
        padding: 40px 20px;
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

  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('');

  useEffect(() => {
    fetchCheatSheets()
      .then(data => setSheets(data.filter((s: any) => s.googleDriveId)))
      .catch(() => {});
    fetchBlogs().then(setBlogPosts).catch(() => {});
    fetchProjects().then(setProjectList).catch(() => {});
    fetchRoadmaps().then(setRoadmapList).catch(() => {});
    fetchResources().then(setResourceList).catch(() => {});
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeStatus('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubscribeStatus('Please enter a valid email address.');
      return;
    }

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubscribeStatus('Successfully subscribed!');
        setEmail('');
      } else {
        setSubscribeStatus('This Email is Already Registered!!');
      }
    } catch (error) {
      setSubscribeStatus('An error occurred. Try Again Later ');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const parsedDate = new Date(dateString);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
    } catch (e) {}
    return dateString;
  };

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
              <p style={{ color: 'var(--text-secondary)' }}>
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
              {[...sheets]
                .sort((a, b) => {
                  const aNum = parseInt(a.title.match(/^\d+/)?.[0] || "0", 10);
                  const bNum = parseInt(b.title.match(/^\d+/)?.[0] || "0", 10);
                  return aNum - bNum;
                })
                .slice(0, 6)
                .map((sheet) => {
                  const logo = getTechLogo(sheet.title) || getTechLogo(sheet.slug);

                  return (
                    <Link
                      key={sheet.slug}
                      href={`/cheatsheets/${sheet.slug}`}
                      className="contentCard"
                    >
                      <div
                        className="cardTop"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                        }}
                      >
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: "linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.1))",
                            border: "1px solid rgba(124, 58, 237, 0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 10,
                            flexShrink: 0,
                          }}
                        >
                          {logo ? (
                            <img
                              src={logo}
                              alt={sheet.title}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                            />
                          ) : (
                            <span style={{ fontSize: 24 }}>📘</span>
                          )}
                        </div>

                        {sheet.category && (
                          <span className="cardCategory">
                            {sheet.category}
                          </span>
                        )}
                      </div>

                      <h3>{sheet.title.replace(/^\d+\.\s*/, "")}</h3>
                      <p>{sheet.description}</p>

                      <div className="cardBottom">
                        <span>Read Guide →</span>
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
              {blogPosts.slice(0, 6).map((blog) => (
                <Link
                  key={blog.slug}
                  href={`/blog/${blog.slug}`}
                  className="blogCard"
                >
                  <div className="blogContent">
                    <span className="cardCategory" style={{ marginBottom: '18px', width: 'fit-content' }}>
                      {blog.category}
                    </span>
                    <h3>{blog.title}</h3>
                    <p>{blog.description}</p>
                    <div className="blogFooter">
                      <span>{formatDate(blog.date)}</span>
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
              {projectList.slice(0, 6).map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="projectCard"
                >
                  <div className="projectContent">
                    <div className="cardTop">
                      {project.tech && project.tech[0] && (
                        <span className="cardCategory">
                          {project.tech[0]}
                        </span>
                      )}
                    </div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="techList">
                      {project.tech.map((tech: string) => (
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
                    {roadmap.steps.slice(0, 5).map((step: string) => (
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
              {resourceList.slice(0, 6).map((resource) => (
                <Link key={resource.slug} href={`/resources/${resource.slug}`} className="contentCard">
                  <div className="cardTop">
                    <span className="cardCategory">{resource.tag}</span>
                  </div>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <div className="cardBottom">View Resource →</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================================= CTA ================================= */}
        <section className="cta">
          <div className="container">
            <div className="ctaBox">
              <span className="sectionTag" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)' }}>
                START LEARNING TODAY
              </span>
              <h2>
                Build Your Skills One Step At A Time
              </h2>
              <p>
                Explore structured tutorials, projects, blogs and cheat sheets designed for aspiring developers.
              </p>
              <div className="ctaButtons">
                <Link href="/cheatsheets" className="button" style={{ background: 'white', color: '#7C3AED', fontWeight: '700' }}>
                  Start Learning
                </Link>
                <Link href="/projects" className="button" style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'white', border: '2px solid white', fontWeight: '700' }}>
                  Explore Projects
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================================= NEWSLETTER ================================= */}
        <section className="newsletter">
          <div className="container">
            <div className="newsletterBox">
              <div>
                <h2>Stay Updated</h2>
                <p>
                  Get notified whenever new blogs,
                  projects, cheat sheets and resources
                  are published.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <form className="newsletterForm" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    suppressHydrationWarning
                    required
                  />
                  <button type="submit" className="button button-primary">
                    Subscribe
                  </button>
                </form>
                {subscribeStatus && (
                  <p style={{ fontSize: '14px', fontWeight: '600', color: subscribeStatus.includes('Successfully') ? '#25D366' : '#EF4444' }}>
                    {subscribeStatus}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}