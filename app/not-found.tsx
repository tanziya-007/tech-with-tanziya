import Link from 'next/link';
import { Navigation } from '../components/layout/Navigation';
import { Footer } from '../components/layout/Footer';

export default function NotFound() {
  return (
    <main>
      <Navigation />
      <section>
        <div className="container" style={{ textAlign: 'center', padding: '120px 24px' }}>
          <p className="badge">404</p>
          <h1 style={{ margin: '20px 0', fontSize: '3rem', fontFamily: 'Poppins, sans-serif' }}>Page not found</h1>
          <p style={{ color: 'var(--muted)', maxWidth: '640px', margin: '0 auto 28px' }}>The page you’re looking for doesn’t exist yet. Head back to the homepage and keep exploring the learning content.</p>
          <Link href="/" className="button button-primary">Back to Home</Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
