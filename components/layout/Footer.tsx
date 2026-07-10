import Link from "next/link";
import Image from "next/image";

const styles = `
.footer { 
  background: linear-gradient(135deg, #0f172a 0%, #1a1f3a 100%);
  color: white; 
  padding: 100px 0 40px;
  margin-top: 100px;
  position: relative;
  overflow: hidden;
}

.footer::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(108, 59, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.footer-grid { 
  display: grid; 
  grid-template-columns: 2fr 1fr 1fr 1fr; 
  gap: 60px;
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
}

.footer-desc { 
  margin-top: 20px; 
  line-height: 1.8; 
  max-width: 320px;
  color: #a0aec0;
  font-size: 14px;
}

.footer h3 { 
  margin-bottom: 25px;
  font-size: 16px;
  font-weight: 700;
  color: white;
}

.footer a { 
  display: block; 
  margin-bottom: 14px; 
  color: #cbd5e1; 
  transition: 0.3s;
  text-decoration: none;
  font-size: 15px;
}

.footer a:hover { 
  color: white;
  padding-left: 8px;
  color: #6C3BFF;
}

.footer-bottom { 
  text-align: center; 
  margin-top: 60px; 
  padding-top: 30px; 
  border-top: 1px solid rgba(255, 255, 255, 0.1); 
  color: #64748b;
  font-size: 14px;
  position: relative;
  z-index: 1;
}

@media(max-width: 900px) {
  .footer-grid { 
    grid-template-columns: 1fr; 
    text-align: center;
    gap: 40px;
  }

  .footer-desc { 
    margin: auto;
  }

  .footer a {
    display: inline-block;
    margin: 0 15px 14px 0;
  }

  .footer a:hover {
    padding-left: 0;
  }

  .footer {
    padding: 80px 0 30px;
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
            <a href="https://linkedin.com" target="_blank">LinkedIn</a>
            <a href="https://github.com" target="_blank">GitHub</a>
            <a href="https://instagram.com" target="_blank">Instagram</a>
            <a href="https://youtube.com" target="_blank">YouTube</a>
          </div>

        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Tech With Tanziya. All Rights Reserved.
        </div>

      </footer>
    </>
  );
}
