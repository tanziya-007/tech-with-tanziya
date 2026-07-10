'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { fetchCheatSheets } from "@/lib/api";
import { cheatSheets } from "@/data/content";

const styles = `
.cheats-page { 
  padding: 100px 0;
  background: linear-gradient(180deg, #ffffff 0%, #f9f7ff 100%);
}

.cheat-card { 
  display: flex; 
  flex-direction: column; 
  gap: 18px; 
  padding: 35px; 
  border-radius: 24px; 
  text-decoration: none; 
  color: inherit; 
  transition: 0.4s; 
  background: white; 
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08); 
  border: 1px solid #f0f0f0;
  position: relative;
}

.cheat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #7C3AED, #EC4899);
  border-radius: 24px 24px 0 0;
}

.cheat-card:hover { 
  transform: translateY(-12px); 
  box-shadow: 0 30px 70px rgba(124, 58, 237, 0.15); 
  border-color: #7C3AED;
}

.cheat-icon { 
  width: 70px; 
  height: 70px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-size: 34px; 
  background: linear-gradient(135deg, #7C3AED, #EC4899); 
  color: white; 
  border-radius: 18px; 
  margin-bottom: 10px;
  box-shadow: 0 10px 25px rgba(124, 58, 237, 0.3);
}

.cheat-card h3 { 
  font-size: 24px; 
  font-family: Poppins, sans-serif; 
  margin: 0;
  color: #111827;
}

.cheat-card p { 
  color: #666; 
  line-height: 1.7; 
  flex: 1;
  font-size: 15px;
}

.cheat-footer { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.category-pill { 
  background: linear-gradient(135deg, #F3E8FF, #FCE7F3);
  color: #7C3AED; 
  padding: 8px 18px; 
  border-radius: 50px; 
  font-size: 13px; 
  font-weight: 700;
  border: 1px solid #E9D5FF;
}

.category-pill.custom {
  background: linear-gradient(135deg, #DBEAFE, #E0E7FF);
  color: #06B6D4;
  border-color: #BFDBFE;
}

.read-link { 
  font-weight: 700; 
  color: #7C3AED; 
  transition: 0.3s;
}

.cheat-card:hover .read-link { 
  transform: translateX(6px);
}

.cards { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
  gap: 30px;
}

.feature-card { 
  background: white; 
  border-radius: 24px; 
  padding: 30px; 
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08); 
  transition: 0.35s; 
  display: flex; 
  flex-direction: column; 
  gap: 18px;
  border: 1px solid #f0f0f0;
}

.feature-card:hover { 
  transform: translateY(-10px);
  box-shadow: 0 25px 60px rgba(108, 59, 255, 0.12);
}

@media(max-width: 768px) {
  .cheats-page {
    padding: 80px 0;
  }

  .cheat-card { 
    padding: 25px; 
  }

  .cheat-card h3 { 
    font-size: 20px; 
  }

  .cards {
    grid-template-columns: 1fr;
  }
}
`;

const icons: Record<string, string> = {
  Java: "☕",
  Python: "🐍",
  SQL: "🗄️",
  HTML: "🌐",
  CSS: "🎨",
  JavaScript: "⚡",
  Git: "🌿",
  Linux: "🐧",
};

export default function CheatSheetsPage() {
  const [customSheets, setCustomSheets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiSheets = await fetchCheatSheets();
        setCustomSheets(apiSheets);
      } catch (error) {
        console.log('Using fallback data');
        setCustomSheets(cheatSheets);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getIcon = (title: string) => {
    return icons[title] || "📘";
  };

  const allSheets = customSheets.length > 0 ? customSheets : cheatSheets;

  return (
    <>
      <style>{styles}</style>
      <main>
        <Navigation />

        <section className="cheats-page">
          <div className="container">
            <SectionHeading
              title="Cheat Sheets"
              description="Master programming with quick, easy-to-understand reference guides."
            />

            <div className="cards">
              {allSheets.map((sheet) => (
                <Link
                  key={sheet.slug}
                  href={`/cheatsheets/${sheet.slug}`}
                  className="feature-card cheat-card"
                >
                  <div className="cheat-icon">
                    {getIcon(sheet.title)}
                  </div>
                  <h3>{sheet.title}</h3>
                  <p>{sheet.description}</p>
                  <div className="cheat-footer">
                    <span className={`category-pill`}>
                      {sheet.category}
                    </span>
                    <span className="read-link">
                      Read →
                    </span>
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
