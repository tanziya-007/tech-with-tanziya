'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import AdminShell from '@/components/layout/AdminShell';

const styles = `
.admin-dashboard {
  max-width: 1200px;
  margin: 60px auto;
  padding: 40px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
}

.admin-title {
  font-size: 32px;
  font-weight: 800;
  color: #111827;
}

.admin-description {
  max-width: 760px;
  color: #4B5563;
  line-height: 1.8;
  margin-bottom: 30px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.card {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.05);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.1);
}

.card-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 14px;
}

.card-text {
  color: #6B7280;
  line-height: 1.75;
  margin-bottom: 24px;
}

.card-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 18px;
  border-radius: 999px;
  background: linear-gradient(135deg, #7C3AED, #EC4899);
  color: white;
  font-weight: 700;
  text-decoration: none;
}

.card-link:hover {
  opacity: 0.96;
}

.logout-btn {
  padding: 12px 24px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.25s ease, background 0.25s ease;
}

.logout-btn:hover {
  transform: translateY(-2px);
}

.note {
  margin-top: 16px;
  color: #6B7280;
  font-size: 14px;
}

@media (max-width: 800px) {
  .admin-header { flex-direction: column; align-items: flex-start; }
}
`;

export default function AdminDashboard() {
  const router = useRouter();
  const { isAdmin, mounted, logout } = useAdmin();

  useEffect(() => {
    if (mounted && !isAdmin) {
      router.push('/admin/login');
    }
  }, [mounted, isAdmin, router]);

  if (!mounted || !isAdmin) {
    return null;
  }

  return (
    <>
      <style>{styles}</style>
      <AdminShell
        title="Admin Dashboard"
        description="Use the sidebar menu to navigate between admin tools for Cheat Sheets, Blogs, Projects, Resources, and Roadmaps."
      >
        <div className="container admin-dashboard">
          <div className="admin-header">
            <div>
              <h1 className="admin-title">Admin Dashboard</h1>
              <p className="admin-description">
                This is your control center for creating and managing content across the site. Choose a section below or use the sidebar for deeper admin actions.
              </p>
            </div>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>

          <div className="cards-grid">
            <div className="card">
              <h2 className="card-title">Cheat Sheets</h2>
              <p className="card-text">
                Add and update cheat sheets so learners can quickly access essential study material.
              </p>
              <Link href="/admin/cheatsheet-upload" className="card-link">
                Manage Cheat Sheets
              </Link>
            </div>

            <div className="card">
              <h2 className="card-title">Blogs</h2>
              <p className="card-text">
                Publish new blog posts, edit existing articles, and keep your content library fresh.
              </p>
              <Link href="/admin/blog-upload" className="card-link">
                Manage Blogs
              </Link>
            </div>

            <div className="card">
              <h2 className="card-title">Projects</h2>
              <p className="card-text">
                Upload and maintain project showcases to highlight real work and student submissions.
              </p>
              <Link href="/admin/project-upload" className="card-link">
                Manage Projects
              </Link>
            </div>

            <div className="card">
              <h2 className="card-title">Resources</h2>
              <p className="card-text">
                Manage learning resources, links, and references that support your audience.
              </p>
              <Link href="/admin/resource-upload" className="card-link">
                Manage Resources
              </Link>
            </div>

            <div className="card">
              <h2 className="card-title">Roadmaps</h2>
              <p className="card-text">
                Create and update learning roadmaps to guide visitors through skills and topics.
              </p>
              <Link href="/admin/roadmap-upload" className="card-link">
                Manage Roadmaps
              </Link>
            </div>
          </div>

          <p className="note">
            Tip: The sidebar contains the same sections plus quick access for every admin page.
          </p>
        </div>
      </AdminShell>
    </>
  );
}
