import Link from "next/link";
import Image from "next/image";

const styles = `
.footer {
  background: linear-gradient(135deg, #0f172a 0%, #151d34 100%);
  color: white;
  padding: 60px 0 30px;
  margin-top: 60px;
  position: relative;
  overflow: hidden;
}

.footer::before {
  content: '';
  position: absolute;
  top: -30%;
  right: -10%;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgba(108, 59, 255, 0.08) 0%, transparent 72%);
  border-radius: 50%;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.7fr 1fr 1fr 1fr;
  gap: 40px;
  position: relative;
  z-index: 1;
}

.footer-brand h2 {
  margin: 20px 0 8px;
  font-family: Poppins, sans-serif;
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #6C3BFF, #2D7DFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-brand p {
  color: #cbd5e1;
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
}

.footer-desc {
  margin-top: 18px;
  line-height: 1.7;
  max-width: 300px;
  color: #a0aec0;
  font-size: 14px;
}

.footer h3 {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 700;
  color: #f8fafc;
}

.footer a {
  display: block;
  margin-bottom: 12px;
  color: #cbd5e1;
  transition: color 0.2s ease, transform 0.2s ease;
  text-decoration: none;
  font-size: 15px;
}

.footer a:hover {
  color: #6C3BFF;
  transform: translateX(3px);
}

.social-links {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255,255,255,0.08);
  color: #cbd5e1;
  transition: background 0.25s ease, transform 0.25s ease, color 0.25s ease;
}

.social-link:hover {
  background: rgba(108,59,255,0.18);
  color: #fff;
  transform: translateY(-2px);
}

.social-link svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.footer-bottom {
  text-align: center;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid rgba(255,255,255,0.08);
  color: #94a3b8;
  font-size: 14px;
}

@media(max-width: 900px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 32px;
    text-align: center;
  }

  .footer-brand {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .footer-desc {
    margin: 18px auto 0;
  }

  .footer a {
    display: inline-block;
    margin: 0 10px 10px 0;
  }

  .social-links {
    justify-content: center;
    margin-top: 14px;
  }
}
`;

export function Footer() {
  return (
    <>
      <style>{styles}</style>
      <footer className="footer">
        <div className="container footer-grid">

          <div className="footer-brand">
            <Image
              src="/logo.png"
              alt="TechWithTanziya"
              width={80}
              height={80}
            />
            <h2>TechWithTanziya</h2>
            <p>Learn • Code • Grow</p>
            <p className="footer-desc">
              Helping students master programming through
              cheat sheets, blogs, projects and roadmaps.
            </p>
          </div>

          <div>
            <h3>Quick Links</h3>
            <Link href="/">Home</Link>
            <Link href="/cheatsheets">Cheat Sheets</Link>
            <Link href="/blog">Blogs</Link>
            <Link href="/projects">Projects</Link>
          </div>

          <div>
            <h3>Resources</h3>
            <Link href="/roadmaps">Roadmaps</Link>
            <Link href="/resources">Resources</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>

          <div>
            <h3>Connect</h3>
            <div className="social-links">
              <a href="https://www.linkedin.com/company/techwithtanziya/" target="_blank" rel="noreferrer" className="social-link">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5C4.98 5 3.87 6.15 2.39 6.15 0.9 6.15 0 5 0 3.5 0 2 0.9 0.85 2.39 0.85 3.87 0.85 4.98 2 4.98 3.5ZM0.47 8.48H3.75V24H0.47V8.48ZM8.79 8.48H12V10.35H12.06C12.65 9.42 14.07 8.4 15.92 8.4 20.16 8.4 20.86 11.1 20.86 15.21V24H17.59V15.96C17.59 13.68 17.54 10.95 14.78 10.95 12 10.95 11.6 13.38 11.6 15.81V24H8.33V8.48H8.79Z"/></svg>
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="https://github.com/tanziya-007" target="_blank" rel="noreferrer" className="social-link">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0.5C5.37 0.5 0 5.87 0 12.5 0 17.79 3.44 22.2 8.21 23.74 8.82 23.84 9.05 23.48 9.05 23.17 9.05 22.89 9.04 22.09 9.04 21.05 5.67 21.82 4.97 19.61 4.97 19.61 4.43 18.27 3.68 17.89 3.68 17.89 2.68 17.16 3.75 17.18 3.75 17.18 4.86 17.25 5.42 18.31 5.42 18.31 6.38 20.06 8.03 19.52 8.7 19.24 8.82 18.5 9.17 17.98 9.55 17.69 6.84 17.39 4 16.36 4 11.6 4 10.27 4.42 9.18 5.17 8.33 5.05 8.05 4.65 6.82 5.28 5.19 5.28 5.19 6.31 4.86 9.04 6.31 9.04 6.31 9.96 6.14 10.92 6.06 11.88 6.06 12.84 6.06 13.8 6.14 14.72 6.31 14.72 6.31 17.44 4.86 18.47 5.19 18.47 5.19 19.11 6.82 18.71 8.05 18.6 8.33 19.36 9.18 19.77 10.27 19.77 11.6 19.77 16.37 16.92 17.39 14.2 17.69 14.7 18.15 15.16 18.97 15.16 20.11 15.16 21.75 15.15 22.88 15.15 23.17 15.15 23.48 15.39 23.85 16.01 23.74 20.78 22.2 24.22 17.79 24.22 12.5 24.22 5.87 18.85 0.5 12 0.5Z"/></svg>
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://www.instagram.com/techwithtanziya?igsh=ZDRld2w3eTdiM2Nu" target="_blank" rel="noreferrer" className="social-link">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.16c3.19 0 3.58 0.01 4.84 0.07 1.17 0.05 1.8 0.24 2.22 0.41 0.55 0.23 0.94 0.51 1.35 0.92 0.41 0.41 0.69 0.8 0.92 1.35 0.17 0.42 0.36 1.05 0.41 2.22 0.06 1.26 0.07 1.65 0.07 4.84s-0.01 3.58-0.07 4.84c-0.05 1.17-0.24 1.8-0.41 2.22-0.23 0.55-0.51 0.94-0.92 1.35-0.41 0.41-0.8 0.69-1.35 0.92-0.42 0.17-1.05 0.36-2.22 0.41-1.26 0.06-1.65 0.07-4.84 0.07s-3.58-0.01-4.84-0.07c-1.17-0.05-1.8-0.24-2.22-0.41-0.55-0.23-0.94-0.51-1.35-0.92-0.41-0.41-0.69-0.8-0.92-1.35-0.17-0.42-0.36-1.05-0.41-2.22-0.06-1.26-0.07-1.65-0.07-4.84s0.01-3.58 0.07-4.84c0.05-1.17 0.24-1.8 0.41-2.22 0.23-0.55 0.51-0.94 0.92-1.35 0.41-0.41 0.8-0.69 1.35-0.92 0.42-0.17 1.05-0.36 2.22-0.41 1.26-0.06 1.65-0.07 4.84-0.07zm0-2.16C8.74 0 8.3 0.01 7.05 0.07 5.79 0.13 4.81 0.34 4.05 0.65 3.23 0.99 2.53 1.45 1.86 2.12 1.19 2.79 0.74 3.48 0.4 4.3 0.09 5.06-0.13 6.04-0.19 7.3-0.25 8.55-0.26 9 0 12s0.01 3.45 0.07 4.7c0.06 1.26 0.27 2.24 0.58 3 0.34 0.82 0.79 1.51 1.46 2.18 0.67 0.67 1.36 1.12 2.18 1.46 0.76 0.31 1.74 0.52 3 0.58 1.25 0.06 1.7 0.07 4.7 0.07s3.45-0.01 4.7-0.07c1.26-0.06 2.24-0.27 3-0.58 0.82-0.34 1.51-0.79 2.18-1.46 0.67-0.67 1.12-1.36 1.46-2.18 0.31-0.76 0.52-1.74 0.58-3 0.06-1.25 0.07-1.7 0.07-4.7s-0.01-3.45-0.07-4.7c-0.06-1.26-0.27-2.24-0.58-3-0.34-0.82-0.79-1.51-1.46-2.18C21.7 1.45 21.02 1 20.2 0.65 19.44 0.34 18.46 0.13 17.2 0.07 15.95 0.01 15.51 0 12 0z"/><path d="M12 5.84A6.16 6.16 0 1 0 18.16 12 6.17 6.17 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.4-11.65a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z"/></svg>
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Tech With Tanziya. All Rights Reserved.
        </div>

      </footer>
    </>
  );
}
