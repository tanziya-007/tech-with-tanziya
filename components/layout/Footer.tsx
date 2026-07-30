import Link from "next/link";
import Image from "next/image";
import { FaLinkedin, FaInstagram, FaTwitter, FaFacebook, FaYoutube } from "react-icons/fa";

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
  gap: 10px;
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
  margin-bottom: 0 !important;
}

.social-link:hover {
  background: rgba(108,59,255,0.18);
  color: #fff;
  transform: translateY(-2px);
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
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/company/techwithtanziya/" target="_blank" rel="noreferrer" className="social-link">
                <FaLinkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>

              {/* Twitter / X */}
              <a href="https://x.com/TechwithTanziya" target="_blank" rel="noreferrer" className="social-link">
                <FaTwitter size={19} />
                <span className="sr-only">Twitter</span>
              </a>

              {/* Instagram */}
              <a href="https://www.instagram.com/techwithtanziya?igsh=ZDRld2w3eTdiM2Nu" target="_blank" rel="noreferrer" className="social-link">
                <FaInstagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>

              {/* Facebook */}
              <a href="https://www.facebook.com/share/1BrSDyPULU/" target="_blank" rel="noreferrer" className="social-link">
                <FaFacebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>

              {/* YouTube */}
              <a href="https://www.youtube.com/@techwithtanziya" target="_blank" rel="noreferrer" className="social-link">
                <FaYoutube size={20} />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

        </div>

        <div className="footer-bottom" suppressHydrationWarning>
          © 2026 Tech With Tanziya. All Rights Reserved.
        </div>

      </footer>
    </>
  );
}