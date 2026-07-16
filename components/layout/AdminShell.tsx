'use client';

import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

const navItems = [
  { title: 'Dashboard', href: '/admin' },
  { title: 'Cheat Sheets', href: '/admin/cheatsheet-upload' },
  { title: 'Blogs', href: '/admin/blog-upload' },
  { title: 'Projects', href: '/admin/project-upload' },
  { title: 'Resources', href: '/admin/resource-upload' },
  { title: 'Roadmaps', href: '/admin/roadmap-upload' },
];

const styles = `
.admin-layout-shell { display: grid; grid-template-columns: 280px 1fr; gap: 24px; max-width: 1400px; margin: 60px auto; padding: 0 20px; min-height: calc(100vh - 80px); }
.admin-sidebar { position: sticky; top: 24px; align-self: start; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 20px; padding: 24px 20px; box-shadow: 0 14px 32px rgba(15, 23, 42, 0.05); min-height: calc(100vh - 96px); }
.sidebar-title { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 18px; }
.sidebar-note { color: #6B7280; font-size: 13px; line-height: 1.6; margin-bottom: 18px; }
.sidebar-nav { display: flex; flex-direction: column; gap: 8px; }
.sidebar-link { display: block; padding: 14px 16px; border-radius: 14px; color: #111827; text-decoration: none; font-weight: 600; transition: background 0.2s, color 0.2s; }
.sidebar-link:hover { background: #eef2ff; }
.sidebar-link.active { background: #7C3AED; color: white; }
.admin-content { display: flex; flex-direction: column; gap: 24px; }
.admin-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb; }
.admin-top h1 { font-size: 32px; font-weight: 800; color: #111827; margin: 0; }
.admin-top p { max-width: 760px; color: #4B5563; line-height: 1.8; margin: 6px 0 0; }
.admin-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px; }
.button { padding: 12px 20px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; transition: transform 0.2s ease, background 0.2s ease; }
.secondary-btn { background: #f3f4f6; color: #111827; }
.secondary-btn:hover { transform: translateY(-1px); }
.logout-btn { background: #ef4444; color: white; }
.logout-btn:hover { transform: translateY(-1px); }
.admin-body { display: flex; flex-direction: column; gap: 24px; }
@media (max-width: 1080px) { .admin-layout-shell { grid-template-columns: 1fr; } .admin-sidebar { position: relative; top: 0; min-height: auto; } }
@media (max-width: 700px) { .admin-top { flex-direction: column; align-items: stretch; } }
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
          <aside className="admin-sidebar">
            <div className="sidebar-title">Admin Menu</div>
            <p className="sidebar-note">Quick links to the admin tools for content management and site updates.</p>
            <nav className="sidebar-nav">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </aside>

          <section className="admin-content">
            <div className="admin-top">
              <div>
                <h1>{title}</h1>
                {description && <p>{description}</p>}
              </div>
              <div className="admin-actions">
                {!isDashboard && (
                  <button className="button secondary-btn" onClick={() => router.push('/admin')}>
                    Admin Dashboard
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
