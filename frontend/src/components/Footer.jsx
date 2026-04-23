import './Footer.css';

function Footer() {
  return (
    <footer className="footer" id="app-footer">
      <div className="footer-inner container">
        {/* Footer Top — Links */}
        <div className="footer-grid">
          <div className="footer-col footer-brand-col">
            <div className="footer-logo-row">
              <img src="/logo.png" alt="DocConvert Logo" width="32" height="32" style={{borderRadius: '6px'}} />
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
