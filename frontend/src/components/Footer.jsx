import './Footer.css';

function Footer() {
  return (
    <footer className="footer" id="app-footer">
      <div className="footer-inner container">
        {/* Footer Top — Links */}
        <div className="footer-grid">
          <div className="footer-col footer-brand-col">
            <div className="footer-logo-row">
              <svg width="24" height="24" viewBox="0 0 34 34" fill="none">
                <defs>
                  <linearGradient id="footLogoG" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed"/>
                    <stop offset="100%" stopColor="#06b6d4"/>
                  </linearGradient>
                </defs>
                <rect x="2" y="4" width="18" height="24" rx="3" stroke="url(#footLogoG)" strokeWidth="2" fill="none"/>
                <rect x="12" y="4" width="18" height="24" rx="3" stroke="url(#footLogoG)" strokeWidth="2" fill="rgba(124,58,237,0.12)"/>
                <path d="M18 12l3 3-3 3" stroke="url(#footLogoG)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="footer-brand-name gradient-text">DocConvert</span>
            </div>
            <p className="footer-tagline">Universal Document Converter. Fast, secure, and free.</p>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Product</h4>
            <a href="#features" className="footer-link">Features</a>
            <a href="#formats" className="footer-link">Supported Formats</a>
            <a href="#workflow" className="footer-link">How It Works</a>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Resources</h4>
            <a href="#" className="footer-link">Documentation</a>
            <a href="#" className="footer-link">API Reference</a>
            <a href="#" className="footer-link">Changelog</a>
          </div>


        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-credits">
            © 2026 DocConvert. Built with FastAPI + React.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
