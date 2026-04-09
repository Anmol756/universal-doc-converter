import './Footer.css';

function Footer() {
  const formats = [
    { label: 'PDF', icon: '📄' },
    { label: 'DOCX', icon: '📝' },
    { label: 'PPTX', icon: '📊' },
    { label: 'XLSX', icon: '📗' },
    { label: 'JPG', icon: '🖼️' },
    { label: 'PNG', icon: '🎨' },
    { label: 'BMP', icon: '🖌️' },
    { label: 'WebP', icon: '🌐' },
  ];

  return (
    <footer className="footer" id="app-footer">
      <div className="footer-inner container">
        <div className="footer-formats">
          <span className="footer-label">Supported Formats</span>
          <div className="footer-format-list">
            {formats.map((fmt) => (
              <span key={fmt.label} className="format-chip">
                <span className="format-chip-icon">{fmt.icon}</span>
                {fmt.label}
              </span>
            ))}
          </div>
        </div>
        <div className="footer-credits">
          <p>Built with FastAPI + React · Universal Document Converter</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
