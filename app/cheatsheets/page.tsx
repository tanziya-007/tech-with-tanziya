'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { fetchCheatSheets } from "@/lib/api";
import { getTechLogo } from "@/lib/techLogos";

const styles = `
@keyframes slideInUp { 
  from { opacity: 0; transform: translateY(30px); } 
  to { opacity: 1; transform: translateY(0); } 
}

.cheats-page { 
  padding: 100px 0;
  background: var(--bg);
  min-height: 100vh;
  transition: background 0.5s ease;
}

/* --- Premium Search & Filter Controls --- */
.controls-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 50px;
  /* Adaptive glass effect for both light/dark modes */
  background: color-mix(in srgb, var(--surface) 80%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 24px;
  border-radius: 24px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.search-wrapper {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 18px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 18px 20px 18px 52px;
  border-radius: 18px;
  border: 1px solid var(--border);
  font-size: 16px;
  font-family: inherit;
  transition: all 0.3s ease;
  background: var(--surface);
  color: var(--text);
  box-sizing: border-box;
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.15);
}

.filter-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 22px;
  border-radius: 50px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-family: inherit;
}

.filter-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--surface-alt);
  transform: translateY(-2px);
}

.filter-btn.active {
  background: var(--gradient);
  color: white;
  border-color: transparent;
  box-shadow: var(--shadow-hover);
}

/* --- Premium Cards --- */
.cheat-card { 
  display: flex; 
  flex-direction: column; 
  gap: 18px; 
  padding: 35px; 
  border-radius: 24px; 
  text-decoration: none; 
  color: inherit; 
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
  background: var(--surface); 
  box-shadow: var(--shadow); 
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
  animation: slideInUp 0.6s ease-out backwards;
}

/* Staggered load effect */
.cheat-card:nth-child(2) { animation-delay: 0.1s; }
.cheat-card:nth-child(3) { animation-delay: 0.2s; }
.cheat-card:nth-child(4) { animation-delay: 0.3s; }
.cheat-card:nth-child(5) { animation-delay: 0.4s; }
.cheat-card:nth-child(6) { animation-delay: 0.5s; }

.cheat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient);
  opacity: 0.8;
  transition: 0.4s;
}

.cheat-card:hover { 
  transform: translateY(-12px); 
  box-shadow: var(--shadow-hover); 
  border-color: var(--primary);
}

.cheat-card:hover::before {
  opacity: 1;
}

.cheat-icon { 
  width: 70px; 
  height: 70px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  background: var(--tag-bg); 
  border-radius: 20px; 
  margin-bottom: 10px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  overflow: hidden;
  padding: 14px;
  transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.cheat-card:hover .cheat-icon {
  transform: scale(1.1) rotate(-5deg);
  border-color: var(--primary-light);
}

.cheat-icon img { width: 100%; height: 100%; object-fit: contain; }
.cheat-icon span { font-size: 34px; }

.cheat-card h3 { 
  font-size: 24px; 
  font-family: 'Poppins', sans-serif; 
  margin: 0;
  color: var(--text);
  font-weight: 700;
  letter-spacing: -0.02em;
  transition: color 0.3s ease;
}

.cheat-card p { 
  color: var(--text-secondary); 
  line-height: 1.7; 
  flex: 1;
  font-size: 15px;
  transition: color 0.3s ease;
}

.cheat-footer { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-top: 15px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
  transition: border-color 0.3s ease;
}

.category-pill { 
  background: var(--tag-bg);
  color: var(--tag-text); 
  padding: 6px 16px; 
  border-radius: 50px; 
  font-size: 12px; 
  font-weight: 700;
  border: 1px solid var(--border);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.cheat-card:hover .category-pill {
  border-color: var(--primary);
}

.read-link { 
  font-weight: 700; 
  color: var(--primary); 
  transition: 0.3s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.cheat-card:hover .read-link { 
  transform: translateX(6px);
  color: var(--secondary);
}

.cards { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); 
  gap: 32px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: var(--surface);
  border-radius: 24px;
  border: 1px dashed var(--border);
  color: var(--text-secondary);
}

@media(max-width: 768px) {
  .cheats-page {
    padding: 80px 0;
  }
  .controls-container {
    padding: 16px;
  }
  .cheat-card { 
    padding: 25px; 
  }
  .cheat-card h3 { 
    font-size: 22px; 
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
  MySQL: "🐬",
  HTML: "🌐",
  CSS: "🎨",
  JavaScript: "⚡",
  Git: "🌿",
  Linux: "🐧",
};

export default function CheatSheetsPage() {
  const [sheets, setSheets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchCheatSheets()
      .then(data => setSheets(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getIcon = (title: string) => icons[title] || "📘";

  const renderIcon = (title: string, slug: string) => {
    const logo = getTechLogo(title) || getTechLogo(slug);
    if (logo) return <img src={logo} alt={title} />;
    return <span>{getIcon(title)}</span>;
  };

  // Get unique categories for the filter buttons
  const categories = ["All", ...Array.from(new Set(sheets.map(sheet => sheet.category).filter(Boolean)))];

  // 1. Sort sheets based on existing logic
  const sortedSheets = [...sheets].sort((a, b) => {
    const aNum = parseInt((a.title || "").match(/^\d+/)?.[0] || "0");
    const bNum = parseInt((b.title || "").match(/^\d+/)?.[0] || "0");
    return aNum - bNum;
  });

  // 2. Filter sheets based on search query and category (with undefined fallbacks)
  const filteredSheets = sortedSheets.filter((sheet) => {
    const searchLower = searchQuery.toLowerCase();
    
    const titleMatches = (sheet.title || "").toLowerCase().includes(searchLower);
    const descMatches = (sheet.description || "").toLowerCase().includes(searchLower);
    
    const matchesSearch = titleMatches || descMatches;
      
    const matchesCategory = selectedCategory === "All" || sheet.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <style>{styles}</style>
      <main>
        <Navigation />

        <section className="cheats-page">
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <SectionHeading
              title="Cheat Sheets"
              description="Master programming with quick, easy-to-understand reference guides."
            />

            {/* Premium Search and Filter Controls */}
            {!loading && sheets.length > 0 && (
              <div className="controls-container">
                <div className="search-wrapper">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search for a cheat sheet (e.g., Python, Git, HTML)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {categories.length > 1 && (
                  <div className="filter-group">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category as string)}
                        className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {loading && <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</p>}
            
            {!loading && sheets.length === 0 && (
              <div className="empty-state">
                <h3>No cheat sheets uploaded yet.</h3>
                <p>Check back later for awesome programming resources!</p>
              </div>
            )}

            {!loading && sheets.length > 0 && filteredSheets.length === 0 && (
              <div className="empty-state">
                <h3>No results found</h3>
                <p>We couldn't find any cheat sheets matching your search criteria.</p>
                <button 
                  onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                  style={{ marginTop: '15px', color: 'var(--primary)', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Clear Filters
                </button>
              </div>
            )}

            <div className="cards">
              {filteredSheets.map((sheet) => (
                <Link
                  key={sheet.slug}
                  href={`/cheatsheets/${sheet.slug}`}
                  className="cheat-card"
                >
                  <div className="cheat-icon">
                    {renderIcon(sheet.title || "", sheet.slug || "")}
                  </div>
                  <h3>{sheet.title}</h3>
                  <p>{sheet.description}</p>
                  <div className="cheat-footer">
                    {sheet.category && (
                      <span className="category-pill">
                        {sheet.category}
                      </span>
                    )}
                    <span className="read-link">
                      Read <span>→</span>
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