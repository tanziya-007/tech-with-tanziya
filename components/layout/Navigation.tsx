"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const styles = `
.navbar { 
  position: sticky; 
  top: 0; 
  z-index: 999; 
  background: rgba(255, 255, 255, 0.95); 
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.navbar-container { 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  height: 70px;
}

.logo { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  text-decoration: none; 
  color: inherit;
  transition: 0.3s;
}

.logo:hover {
  opacity: 0.8;
}

.logo h2 { 
  font-size: 20px; 
  margin: 0; 
  font-family: Poppins, sans-serif;
  font-weight: 700;
  background: linear-gradient(135deg, #7C3AED, #EC4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

nav { 
  display: flex; 
  gap: 28px; 
  align-items: center;
}

nav a { 
  color: #555; 
  font-weight: 500; 
  transition: 0.3s; 
  position: relative; 
  text-decoration: none;
  font-size: 14px;
}

nav a:hover { 
  color: #7C3AED;
}

.active-link { 
  color: #7C3AED;
  font-weight: 600;
}

.active-link::after { 
  content: ""; 
  position: absolute; 
  left: 0; 
  bottom: -8px; 
  width: 100%; 
  height: 2px; 
  background: linear-gradient(90deg, #7C3AED, #EC4899);
  border-radius: 20px;
}

.nav-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
  position: relative;
}

.admin-btn { 
  padding: 10px 20px; 
  border-radius: 10px; 
  color: white; 
  font-weight: 600; 
  transition: 0.3s;
  text-decoration: none;
  font-size: 13px;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  position: relative;
}

.admin-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
}

.start-btn {
  padding: 10px 24px; 
  border-radius: 10px; 
  color: white; 
  font-weight: 600; 
  transition: 0.3s;
  text-decoration: none;
  font-size: 13px;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #7C3AED, #EC4899);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
}

.start-btn:hover { 
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.3);
}

.admin-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  min-width: 180px;
  margin-top: 8px;
  z-index: 1000;
  overflow: hidden;
}

.admin-dropdown a,
.admin-dropdown button {
  display: block;
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  color: #555;
  text-decoration: none;
  border: none;
  background: none;
  cursor: pointer;
  transition: 0.2s;
  font-size: 13px;
  font-weight: 500;
}

.admin-dropdown a:hover,
.admin-dropdown button:hover {
  background: #f3f4f6;
  color: #7C3AED;
}

.admin-dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 4px 0;
}

@media(max-width: 900px) {
  nav {
    gap: 20px;
  }

  nav a {
    font-size: 13px;
  }

  .navbar-container {
    height: 65px;
  }
}

@media(max-width: 768px) {
  nav {
    display: none;
  }

  .navbar-container {
    height: 60px;
  }

  .logo h2 {
    font-size: 18px;
  }

  .admin-btn, .start-btn {
    padding: 8px 16px;
    font-size: 12px;
  }
}
`;

const links = [
  { name: "Home", href: "/" },
  { name: "Cheat Sheets", href: "/cheatsheets" },
  { name: "Blogs", href: "/blog" },
  { name: "Projects", href: "/projects" },
  { name: "Roadmaps", href: "/roadmaps" },
  { name: "Resources", href: "/resources" },
];

const adminLinks = [
  { name: "📊 Cheat Sheets", href: "/admin/cheatsheet-upload" },
  { name: "📝 Blogs", href: "/admin/blog-upload" },
  { name: "🚀 Projects", href: "/admin/project-upload" },
  { name: "📚 Resources", href: "/admin/resource-upload" },
  { name: "🗺️ Roadmaps", href: "/admin/roadmap-upload" },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const adminAuth = localStorage.getItem('adminAuth');
    setIsAdmin(adminAuth === 'true');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAdmin(false);
    setShowDropdown(false);
    router.push("/");
  };

  return (
    <>
      <style>{styles}</style>
      <header className="navbar">
        <div className="container navbar-container">

          <Link href="/" className="logo">
            <Image
              src="/logo.png"
              alt="TechWithTanziya"
              width={45}
              height={45}
            />
            <h2>TechWithTanziya</h2>
          </Link>

          <nav>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? "active-link" : ""}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="nav-buttons">
            <div style={{ position: "relative" }}>
              <button
                className="admin-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                🔐 Admin
              </button>
              {showDropdown && (
                <div className="admin-dropdown">
                  {isAdmin ? (
                    <>
                      {adminLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setShowDropdown(false)}
                        >
                          {link.name}
                        </Link>
                      ))}
                      <div className="admin-dropdown-divider"></div>
                      <button onClick={handleLogout}>
                        🚪 Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/admin/login"
                      onClick={() => setShowDropdown(false)}
                    >
                      🔑 Login
                    </Link>
                  )}
                </div>
              )}
            </div>
            <Link href="/cheatsheets" className="start-btn">
              Start Learning
            </Link>
          </div>

        </div>
      </header>
    </>
  );
}
