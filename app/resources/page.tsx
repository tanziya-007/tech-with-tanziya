import Link from 'next/link';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/SectionHeading';
import { resources } from '@/data/content';

const styles = `
@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
@keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }

.resources-page { padding: 90px 0; position: relative; overflow: hidden; }
.resources-page::before { content: ''; position: absolute; top: -40%; left: -5%; width: 350px; height: 350px; background: radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
.resources-page::after { content: ''; position: absolute; bottom: -20%; right: -8%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }

.resources-grid { display: grid; gap: 25px; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); position: relative; z-index: 1; }

.resource-card { background: white; border-radius: 20px; padding: 25px; border: 1px solid #E5E7EB; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04); position: relative; overflow: hidden; animation: slideInUp 0.6s ease-out forwards; text-decoration: none; color: inherit; display: block; }
.resource-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #7C3AED, #EC4899); }
.resource-card::after { content: ''; position: absolute; top: -40%; right: -40%; width: 180px; height: 180px; background: radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%); border-radius: 50%; }

.resource-card:hover { transform: translateY(-10px); box-shadow: 0 20px 45px rgba(124, 58, 237, 0.12); }
.resource-card:hover .resource-title { animation: float 3s ease-in-out infinite; }

.resource-title { font-size: 18px; font-weight: 600; margin-bottom: 12px; background: linear-gradient(135deg, #7C3AED, #EC4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; transition: 0.3s; }

.resource-description { color: #6B7280; line-height: 1.8; font-size: 0.95rem; }

.resource-tag { margin-top: 18px; display: inline-flex; background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.1)); color: #7C3AED; border-radius: 999px; padding: 8px 14px; font-size: 0.9rem; font-weight: 500; border: 1px solid rgba(124, 58, 237, 0.2); transition: 0.3s; }
.resource-tag:hover { background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(236, 72, 153, 0.2)); }

.resource-button { margin-top: 22px; }
.resource-button .button { padding: 14px 26px; border-radius: 12px; font-weight: 600; transition: all 0.3s; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; background: linear-gradient(135deg, #7C3AED, #EC4899); color: white; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3); border: none; cursor: pointer; width: 100%; }
.resource-button .button:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4); }

@media (max-width: 900px) { 
  .resources-grid { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
  .resources-page::before { width: 280px; height: 280px; }
  .resources-page::after { width: 240px; height: 240px; }
}

@media (max-width: 600px) { 
  .resources-page { padding: 60px 0; }
  .resource-card { padding: 20px; }
  .resource-title { font-size: 16px; }
  .resource-button .button { padding: 12px 20px; font-size: 0.9rem; }
}
`;

export default function ResourcesPage() {
  return (
    <>
      <style>{styles}</style>
      <main>
        <Navigation />
        <section className="resources-page">
          <div className="container">
            <SectionHeading title="Resources" description="Helpful files, guides, and study tools for the learning journey." />
            <div className="resources-grid">
              {resources.map((resource) => (
                <Link key={resource.slug} href={`/resources/${resource.slug}`}>
                  <article className="resource-card">
                    <p className="resource-title">{resource.title}</p>
                    <p className="resource-description">{resource.description}</p>
                    <span className="resource-tag">{resource.tag}</span>
                    <div className="resource-button">
                      <button className="button">View Resource →</button>
                    </div>
                  </article>
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
