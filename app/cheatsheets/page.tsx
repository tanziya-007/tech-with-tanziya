'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { fetchCheatSheets } from "@/lib/api";
import { getTechLogo } from "@/lib/techLogos";

const styles = `
.cheats-page { 
  padding: 100px 0;
  background: linear-gradient(180deg, #fdfcff 0%, #f3f0fa 100%);
  min-height: 100vh;
}

/* --- Premium Search & Filter Controls --- */
.controls-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 50px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 24px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
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
  color: #9CA3AF;
  font-size: 18px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 18px 20px 18px 52px;
  border-radius: 18px;
  border: 1px solid #E5E7EB;
  font-size: 16px;
  font-family: inherit;
  transition: all 0.3s ease;
  background: white;
  color: #111827;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: #9CA3AF;
}

.search-input:focus {
  outline: none;
  border-color: #7C3AED;
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
}

.filter-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 22px;
  border-radius: 50px;
  border: 1px solid #E5E7EB;
  background: white;
  color: #4B5563;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.filter-btn:hover {
  border-color: #7C3AED;
  color: #7C3AED;
  transform: translateY(-2px);
}

.filter-btn.active {
  background: linear-gradient(135deg, #7C3AED, #EC4899);
  color: white;
  border-color: transparent;
  box-shadow: 0 8px 20px rgba(124, 58, 237, 0.25);
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
  background: white; 
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.04); 
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
}

.cheat-card::before {
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

.cheat-card:hover { 
  transform: translateY(-12px); 
  box-shadow: 0 30px 60px rgba(124, 58, 237, 0.12); 
  border-color: #E9D5FF;
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
  background: linear-gradient(135deg, #f3e8ff, #fce7f3); 
  border-radius: 20px; 
  margin-bottom: 10px;
  box-shadow: 0 10px 25px rgba(124, 58, 237, 0.1);
  overflow: hidden;
  padding: 14px;
  transition: 0.4s;
}

.cheat-card:hover .cheat-icon {
  transform: scale(1.05) rotate(3deg);
}

.cheat-icon img { width: 100%; height: 100%; object-fit: contain; }
.cheat-icon span { font-size: 34px; }

.cheat-card h3 { 
  font-size: 24px; 
  font-family: Poppins, sans-serif; 
  margin: 0;
  color: #111827;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.cheat-card p { 
  color: #6B7280; 
  line-height: 1.7; 
  flex: 1;
  font-size: 15px;
}

.cheat-footer { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-top: 15px;
  padding-top: 20px;
  border-top: 1px solid #F3F4F6;
}

.category-pill { 
  background: linear-gradient(135deg, #F3E8FF, #FCE7F3);
  color: #7C3AED; 
  padding: 6px 16px; 
  border-radius: 50px; 
  font-size: 12px; 
  font-weight: 700;
  border: 1px solid #E9D5FF;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.read-link { 
  font-weight: 700; 
  color: #7C3AED; 
  transition: 0.3s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.cheat-card:hover .read-link { 
  transform: translateX(6px);
  color: #EC4899;
}

.cards { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); 
  gap: 32px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 24px;
  border: 1px dashed #D1D5DB;
  color: #6B7280;
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

            {loading && <p style={{ textAlign: 'center', color: '#9CA3AF' }}>Loading...</p>}
            
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
                  style={{ marginTop: '15px', color: '#7C3AED', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
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