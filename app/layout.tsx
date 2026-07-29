import type { Metadata } from 'next';
import './globals.css';
import { AdminProvider } from '@/context/AdminContext';
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  metadataBase: new URL('https://techwithtanziya.com'),
  title: 'TechWithTanziya | Learn • Code • Grow',
  description:
    'TechWithTanziya is a content-first learning platform for cheat sheets, blogs, projects, and roadmaps.',
  keywords: [
    'learn',
    'programming',
    'cheat sheets',
    'blog',
    'Java',
    'Python',
    'web development',
    'TechWithTanziya',
  ],
  openGraph: {
    title: 'TechWithTanziya',
    description: 'Learn • Code • Grow',
    type: 'website',
    url: 'https://techwithtanziya.com',
    images: ['/logo.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TechWithTanziya',
    description: 'Learn • Code • Grow',
    creator: '@techwithtanziya',
  },
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   <html lang="en" data-scroll-behavior="smooth">
  <body>
    <ThemeProvider>
      <AdminProvider>
        {children}
      </AdminProvider>
    </ThemeProvider>
  </body>
</html>
  );
}