'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <>
      <style jsx>{`
        .site-footer {
          background-color: #f9fafb;
          border-top: 1px solid #e5e7eb;
          padding: 40px 20px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #6b7280;
          font-size: 14px;
          margin-top: 60px;
        }
        .footer-content {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 30px;
        }
        .footer-section {
          flex: 1;
          min-width: 200px;
        }
        .footer-logo {
          font-weight: bold;
          font-size: 18px;
          color: #111827;
          margin-bottom: 10px;
          display: block;
          text-decoration: none;
        }
        .footer-links a {
          display: block;
          color: #6b7280;
          text-decoration: none;
          margin-bottom: 8px;
          transition: color 0.2s;
        }
        .footer-links a:hover {
          color: #4f46e5;
        }
        .disclaimer-text {
          font-size: 12px;
          line-height: 1.5;
          color: #9ca3af;
          margin-top: 10px;
        }
        .copyright {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 13px;
        }
        .footer-section-title {
          font-weight: 600;
          color: #374151;
          margin-bottom: 12px;
        }
      `}</style>
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-section">
            <Link href="/" className="footer-logo">🎓 ColleTools</Link>
            <p>The essential digital toolkit for college students. Calculate grades, generate citations, and boost productivity.</p>
            <p className="text-xs text-gray-500 mt-2">
              <strong>No tracking. No data selling.</strong> Just a tool.
            </p>
          </div>

          <div className="footer-section">
            <div className="footer-section-title">Tools</div>
            <div className="footer-links">
              <Link href="/grade-calc">Final Grade Calculator</Link>
              <Link href="/email-gen">Email Templates</Link>
              <Link href="/citation">Citation Helper</Link>
              <Link href="/pomodoro">Study Room</Link>
            </div>
          </div>

          <div className="footer-section">
            <div className="footer-section-title">Legal</div>
            <div className="footer-links">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <a href="mailto:novemeber11@gmail.com">Contact Us</a>
            </div>
            <p className="disclaimer-text">
              <strong>Disclaimer:</strong> ColleTools is an educational tool. Results from calculators are estimates only. Please confirm official grades with your institution.
            </p>
          </div>
        </div>

        <div className="copyright">
          &copy; 2025 ColleTools.com. All rights reserved. Made for students, by students.
        </div>
      </footer>
    </>
  )
}
