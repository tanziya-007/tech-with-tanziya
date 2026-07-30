'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import AdminShell from '@/components/layout/AdminShell';

const styles = `
.dashboard-overview {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.welcome-banner {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.1));
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 24px;
  padding: 35px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.welcome-banner h2 {
  font-size: 24px;
  font-family: 'Poppins', sans-serif;
  color: var(--text);
  margin-bottom: 8px;
  font-weight: 700;
}

.welcome-banner p {
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  max-width: 600px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 32px;
  box-shadow: var(--shadow);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient);
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.card:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 0 25px 50px rgba(124, 58, 237, 0.15);
  border-color: var(--primary);
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.1));
  border: 1px solid rgba(124, 58, 237, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 20px;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  font-family: 'Poppins', sans-serif;
  margin-bottom: 10px;
}

.card-text {
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 14px;
  margin-bottom: 24px;
  flex: 1;
}

.card-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--primary);
  font-weight: 700;
  font-size: 14px;
  transition: gap 0.3s ease;
}

.card:hover .card-link {
  gap: 12px;
}

@media (max-width: 768px) {
  .welcome-banner {
    flex-direction: column;
    align-items: flex-start;
    padding: 25px;
  }
}
`;

const adminModules = [
  {
    title: 'Cheat Sheets',
    description: 'Create and publish concise technical cheat sheets and quick guides.',
    href: '/admin/cheatsheet-upload',
    icon: '📄',
  },
  {
    title: 'Blogs',
    description: 'Write and share programming tutorials, articles, and updates.',
    href: '/admin/blog-upload',
    icon: '✍️',
  },
  {
    title: 'Projects',
    description: 'Add real-world projects with source code, tech stacks, and live links.',
    href: '/admin/project-upload',
    icon: '💻',
  },
  {
    title: 'Resources',
    description: 'Upload downloadable learning materials, assets, and templates.',
    href: '/admin/resource-upload',
    icon: '📦',
  },
  {
    title: 'Roadmaps',
    description: 'Structure step-by-step learning paths for students and developers.',
    href: '/admin/roadmap-upload',
    icon: '🗺️',
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { isAdmin, mounted } = useAdmin();

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
        description="Welcome back! Select a module below or use the sidebar to manage platform content."
      >
        <div className="dashboard-overview">
          
          <div className="welcome-banner">
            <div>
              <h2>Control Center Active ✨</h2>
              <p>All content management modules are ready. Changes published here update live across the entire TechWithTanziya ecosystem.</p>
            </div>
          </div>

          <div className="cards-grid">
            {adminModules.map((mod) => (
              <Link key={mod.href} href={mod.href} className="card">
                <div>
                  <div className="card-icon">{mod.icon}</div>
                  <div className="card-title">{mod.title}</div>
                  <div className="card-text">{mod.description}</div>
                </div>
                <div className="card-link">
                  Manage {mod.title} →
                </div>
              </Link>
            ))}
          </div>

        </div>
      </AdminShell>
    </>
  );
}