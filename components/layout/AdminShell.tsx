'use client';

import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

const navItems = [
  { title: 'Dashboard', href: '/admin', icon: '📊' },
  { title: 'Cheat Sheets', href: '/admin/cheatsheet-upload', icon: '📄' },
  { title: 'Blogs', href: '/admin/blog-upload', icon: '✍️' },
  { title: 'Projects', href: '/admin/project-upload', icon: '💻' },
  { title: 'Resources', href: '/admin/resource-upload', icon: '📦' },
  { title: 'Roadmaps', href: '/admin/roadmap-upload', icon: '🗺️' },
];

const styles = `
.admin-layout-shell { 
  display: grid; 
  grid-template-columns: 280px 1fr; 
  gap: 32px; 
  max-width: 1400px; 
  margin: 50px auto; 
  padding: 0 24px; 
  min-height: calc(100vh - 80px); 
}

.admin-sidebar { 
  position: sticky; 
  top: 96px; 
  align-self: start; 
  background: var(--surface); 
  border: 1px solid var(--border); 
  border-radius: 24px; 
  padding: 28px 20px; 
  box-shadow: var(--shadow); 
  transition: background 0.5s ease, border-color 0.5s ease;
}

.sidebar-header {
  padding-bottom: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.sidebar-title { 
  font-size: 16px; 
  font-weight: 700; 
  color: var(--text); 
  font-family: 'Poppins', sans-serif;
  letter-spacing: 0.5px;
}

.sidebar-note { 
  color: var(--text-secondary); 
  font-size: 13px; 
  line-height: 1.5; 
  margin-top: 4px;
}

.sidebar-nav { 
  display: flex; 
  flex-direction: column; 
  gap: 6px; 
}

.sidebar-link { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  padding: 12px 16px; 
  border-radius: 14px; 
  color: var(--text-secondary); 
  text-decoration: none; 
  font-weight: 600; 
  font-size: 14px;
  transition: all 0.25s ease; 
}

.sidebar-link:hover { 
  background: var(--surface-alt); 
  color: var(--primary); 
  transform: translateX(4px);
}

.sidebar-link.active { 
  background: var(--gradient); 
  color: white; 
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.25);
}

.admin-content { 
  display: flex; 
  flex-direction: column; 
  gap: 28px; 
}

.admin-top { 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start; 
  gap: 20px; 
  padding-bottom: 20px; 
  border-bottom: 1px solid var(--border); 
}

.admin-top h1 { 
  font-size: 28px; 
  font-weight: 800; 
  color: var(--text); 
  font-family: 'Poppins', sans-serif;
  margin: 0; 
}

.admin-top p { 
  max-width: 700px; 
  color: var(--text-secondary); 
  font-size: 15px;
  line-height: 1.6; 
  margin: 6px 0 0; 
}

.admin-actions { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 12px; 
}

.button { 
  padding: 10px 18px; 
  border-radius: 12px; 
  border: none; 
  font-weight: 600; 
  font-size: 13px;
  cursor: pointer; 
  transition: all 0.25s ease; 
}

.secondary-btn { 
  background: var(--surface-alt); 
  color: var(--text); 
  border: 1px solid var(--border);
}

.secondary-btn:hover { 
  background: var(--border);
  transform: translateY(-2px); 
}

.logout-btn { 
  background: linear-gradient(135deg, #ef4444, #dc2626); 
  color: white; 
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.logout-btn:hover { 
  transform: translateY(-2px); 
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3);
}

.admin-body { 
  display: flex; 
  flex-direction: column; 
  gap: 24px; 
}

@media (max-width: 1080px) { 
  .admin-layout-shell { grid-template-columns: 1fr; } 
  .admin-sidebar { position: relative; top: 0; } 
}

@media (max-width: 700px) { 
  .admin-top { flex-direction: column; align-items: stretch; } 
  .admin-actions { justify-content: flex-start; }
}
`;

interface AdminShellProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function AdminShell({ title, description, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { mounted, isAdmin, logout } = useAdmin();

  useEffect(() => {
    if (mounted && !isAdmin) {
      router.push('/admin/login');
    }
  }, [mounted, isAdmin, router]);

  if (!mounted || !isAdmin) {
    return null;
  }

  const isDashboard = pathname === '/admin' || pathname === '/admin/';

  return (
    <>
      <style>{styles}</style>
      <main>
        <Navigation />
        <div className="admin-layout-shell">
          
          {/* Sidebar */}
          <aside className="admin-sidebar">
            <div className="sidebar-header">
              <div className="sidebar-title">Admin Control Panel</div>
              <p className="sidebar-note">Manage platform content and updates securely.</p>
            </div>
            <nav className="sidebar-nav">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                  >
                    <span style={{ fontSize: '16px' }}>{item.icon}</span>
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Content Area */}
          <section className="admin-content">
            <div className="admin-top">
              <div>
                <h1>{title}</h1>
                {description && <p>{description}</p>}
              </div>
              <div className="admin-actions">
                {!isDashboard && (
                  <button className="button secondary-btn" onClick={() => router.push('/admin')}>
                    ← Dashboard
                  </button>
                )}
                <button className="button logout-btn" onClick={() => {
                  logout();
                  router.push('/');
                }}>
                  Logout
                </button>
              </div>
            </div>
            <div className="admin-body">{children}</div>
          </section>

        </div>
        <Footer />
      </main>
    </>
  );
}