import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { roadmaps } from "@/data/content";

const styles = `
@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
@keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }

.roadmaps-page { padding: 90px 0; position: relative; overflow: hidden; }
.roadmaps-page::before { content: ''; position: absolute; top: -30%; left: -8%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
.roadmaps-page::after { content: ''; position: absolute; bottom: -25%; right: -5%; width: 350px; height: 350px; background: radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }

.roadmap-grid { display: grid; gap: 30px; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); position: relative; z-index: 1; }

.roadmap-card { display: block; background: white; border-radius: 20px; padding: 30px; border: 1px solid #E5E7EB; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04); text-decoration: none; color: inherit; position: relative; overflow: hidden; animation: slideInUp 0.6s ease-out forwards; }
.roadmap-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #7C3AED, #EC4899); }
.roadmap-card::after { content: ''; position: absolute; top: -50%; right: -50%; width: 220px; height: 220px; background: radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%); border-radius: 50%; }

.roadmap-card:hover { transform: translateY(-12px); box-shadow: 0 25px 50px rgba(124, 58, 237, 0.15); }
.roadmap-card:hover .roadmap-number { animation: float 3s ease-in-out infinite; }

.roadmap-top { display: flex; gap: 20px; margin-bottom: 20px; }

.roadmap-number { font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #7C3AED, #EC4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; min-width: 50px; transition: 0.3s; }

.roadmap-top h2 { font-size: 20px; font-weight: 700; margin-bottom: 8px; background: linear-gradient(135deg, #7C3AED, #EC4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

.roadmap-top p { color: #6B7280; line-height: 1.6; font-size: 0.95rem; }

.roadmap-divider { height: 2px; background: linear-gradient(90deg, #7C3AED, #EC4899, transparent); margin: 20px 0; opacity: 0.4; }

.roadmap-steps { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }

.roadmap-step { display: flex; align-items: center; gap: 14px; transition: 0.3s; }
.roadmap-step:hover { transform: translateX(4px); }

.step-circle { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #7C3AED, #EC4899); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; flex-shrink: 0; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3); }

.roadmap-step span { color: #374151; font-size: 0.95rem; font-weight: 500; }

.roadmap-footer { padding-top: 15px; border-top: 1px solid #E5E7EB; }

.roadmap-view { color: #7C3AED; font-weight: 600; font-size: 0.95rem; transition: 0.3s; }
.roadmap-card:hover .roadmap-view { color: #EC4899; }

@media (max-width: 900px) { 
  .roadmap-grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
  .roadmaps-page::before { width: 300px; height: 300px; }
  .roadmaps-page::after { width: 280px; height: 280px; }
}

@media (max-width: 600px) { 
  .roadmaps-page { padding: 60px 0; }
  .roadmap-card { padding: 20px; }
  .roadmap-top { gap: 15px; }
  .roadmap-number { font-size: 24px; }
  .roadmap-top h2 { font-size: 18px; }
  .step-circle { width: 28px; height: 28px; font-size: 0.8rem; }
  .roadmap-step span { font-size: 0.9rem; }
}
`;

export default function RoadmapsPage() {
  return (
    <>
      <style>{styles}</style>
      <main>
        <Navigation />
        <section className="roadmaps-page">
          <div className="container">
            <SectionHeading
              title="Learning Roadmaps"
              description="Structured learning paths to help you master programming step by step."
            />
            <div className="roadmap-grid">
              {roadmaps.map((roadmap, index) => (
                <Link key={roadmap.slug} href={`/roadmaps/${roadmap.slug}`} className="roadmap-card">
                  <div className="roadmap-top">
                    <div className="roadmap-number">{String(index + 1).padStart(2, "0")}</div>
                    <div>
                      <h2>{roadmap.title}</h2>
                      <p>{roadmap.description}</p>
                    </div>
                  </div>
                  <div className="roadmap-divider"></div>
                  <div className="roadmap-steps">
                    {roadmap.steps.slice(0, 5).map((step, i) => (
                      <div className="roadmap-step" key={step}>
                        <div className="step-circle">{i + 1}</div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="roadmap-footer">
                    <span className="roadmap-view">View Complete Roadmap →</span>
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
