'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const styles = `
.navbar { 
  position: sticky; 
  top: 0; 
  z-index: 999; 
  /* Uses color-mix to keep the glass-blur effect in both light and dark modes */
  background: var(--surface);
  background: color-mix(in srgb, var(--surface) 85%, transparent); 
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
  transition: background-color 0.5s ease, border-color 0.5s ease;
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
  font-size: 18px; 
  white-space: nowrap;
  margin: 0; 
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  /* Adapts to light/dark mode gradient automatically */
  background: var(--gradient);
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
  color: var(--text-secondary); 
  font-weight: 500; 
  transition: 0.3s; 
  position: relative; 
  text-decoration: none;
  font-size: 14px;
}

nav a:hover { 
  color: var(--primary);
}

.active-link { 
  color: var(--primary) !important;
  font-weight: 600;
}

.active-link::after { 
  content: ""; 
  position: absolute; 
  left: 0; 
  bottom: -8px; 
  width: 100%; 
  height: 2px; 
  background: var(--gradient);
  border-radius: 20px;
}

.nav-buttons {
  display: flex;
  gap: 15px;
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
  padding: 10px 18px; 
  white-space: nowrap;
  border-radius: 10px; 
  color: white; 
  font-weight: 600; 
  transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-decoration: none;
  font-size: 13px;
  border: none;
  cursor: pointer;
  background: var(--gradient);
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.2);
}

.start-btn:hover { 
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--shadow-hover);
}

.admin-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--surface);
  border-radius: 12px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  min-width: 180px;
  margin-top: 8px;
  z-index: 1000;
  overflow: hidden;
  animation: slideDown 0.2s ease-out;
}

.admin-dropdown a,
.admin-dropdown button {
  display: block;
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  color: var(--text-secondary);
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
  background: var(--surface-alt);
  color: var(--primary);
}

.admin-dropdown-divider {
  height: 1px;
  background: var(--border);
  margin: 4px 0;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  color: var(--text);
  transition: color 0.3s;
}

.mobile-menu-btn:hover {
  color: var(--primary);
}

.mobile-nav {
  display: none;
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

@media (max-width: 768px) {
  .navbar-container {
    height: 70px;
    padding: 0 15px;
  }
  
  .logo h2 {
    display: none;
  }

  nav {
    display: none;
  }

  .start-btn {
    padding: 8px 16px;
    font-size: 12px;
  }

  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-nav {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background: var(--surface);
    padding: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    gap: 18px;
    animation: slideDown 0.25s ease;
    border-bottom: 1px solid var(--border);
  }

  .mobile-nav a {
    text-decoration: none;
    font-weight: 600;
    color: var(--text);
  }

  .mobile-nav a:hover {
    color: var(--primary);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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
  { name: "Contact", href: "/contact" },
];

const adminLinks = [
  { name: "Cheat Sheets", href: "/admin/cheatsheet-upload" },
  { name: "Blogs", href: "/admin/blog-upload" },
  { name: "Projects", href: "/admin/project-upload" },
  { name: "Resources", href: "/admin/resource-upload" },
  { name: "Roadmaps", href: "/admin/roadmap-upload" },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
    const adminToken = localStorage.getItem('adminToken');
    setIsAdmin(Boolean(adminToken));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
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
              priority
           />
            <h2>TechWithTanziya</h2>
          </Link>

          {/* Desktop Navigation */}
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
             <ThemeToggle />

            <div style={{ position: "relative" }}>
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
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/admin/login"
                      onClick={() => setShowDropdown(false)}
                    >
                      Login
                    </Link>
                  )}
                </div>
              )}
            </div>
            
           

            {/* Mobile Hamburger Button */}
            <button 
              className="mobile-menu-btn" 
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Toggle menu"
            >
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenu && (
          <div className="mobile-nav">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenu(false)}
                className={pathname === link.href ? "active-link" : ""}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}