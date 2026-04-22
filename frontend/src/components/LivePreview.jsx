import { motion } from 'framer-motion';
import './LivePreview.css';

function LivePreview() {
  return (
    <section className="live-preview-section" id="live-preview">
      <div className="container">
        <motion.div
          className="live-preview-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">✨ Live Preview</span>
          <h2 className="section-title">See the Magic in Action</h2>
          <p className="section-subtitle">
            Watch your documents transform in real-time with pixel-perfect accuracy
          </p>
        </motion.div>

        <motion.div
          className="live-preview-container glass-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <div className="live-preview-glow-border"></div>

          {/* Source Pane */}
          <div className="preview-pane preview-source">
            <div className="preview-pane-header">
              <span className="preview-pane-badge source-badge">Source</span>
              <span className="preview-pane-format">document.pdf</span>
            </div>
            <div className="preview-pane-body">
              <div className="preview-file-mock">
                <div className="mock-icon-large">
                  <svg width="40" height="48" viewBox="0 0 40 48" fill="none">
                    <rect x="1" y="1" width="38" height="46" rx="4" stroke="#ef4444" strokeWidth="2" fill="rgba(239,68,68,0.08)"/>
                    <rect x="8" y="12" width="24" height="2" rx="1" fill="rgba(239,68,68,0.3)"/>
                    <rect x="8" y="18" width="20" height="2" rx="1" fill="rgba(239,68,68,0.2)"/>
                    <rect x="8" y="24" width="22" height="2" rx="1" fill="rgba(239,68,68,0.2)"/>
                    <rect x="8" y="30" width="16" height="2" rx="1" fill="rgba(239,68,68,0.15)"/>
                    <rect x="8" y="36" width="24" height="2" rx="1" fill="rgba(239,68,68,0.15)"/>
                    <text x="20" y="9" textAnchor="middle" fill="#ef4444" fontSize="6" fontWeight="700" fontFamily="Inter">PDF</text>
                  </svg>
                </div>
                <div className="mock-lines">
                  <div className="mock-line" style={{width: '85%'}}></div>
                  <div className="mock-line" style={{width: '70%'}}></div>
                  <div className="mock-line" style={{width: '90%'}}></div>
                  <div className="mock-line" style={{width: '60%'}}></div>
                  <div className="mock-line" style={{width: '75%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Transform Arrow */}
          <div className="preview-transform">
            <div className="transform-arrow-wrapper">
              <div className="transform-ring"></div>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="transform-icon">
                <defs>
                  <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed"/>
                    <stop offset="100%" stopColor="#06b6d4"/>
                  </linearGradient>
                </defs>
                <path d="M6 14h16M18 8l4 6-4 6" stroke="url(#arrowGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="transform-label">Converting...</span>
          </div>

          {/* Output Pane */}
          <div className="preview-pane preview-output">
            <div className="preview-pane-header">
              <span className="preview-pane-badge output-badge">Output</span>
              <span className="preview-pane-format">document.docx</span>
            </div>
            <div className="preview-pane-body">
              <div className="preview-file-mock">
                <div className="mock-icon-large">
                  <svg width="40" height="48" viewBox="0 0 40 48" fill="none">
                    <rect x="1" y="1" width="38" height="46" rx="4" stroke="#3b82f6" strokeWidth="2" fill="rgba(59,130,246,0.08)"/>
                    <rect x="8" y="12" width="24" height="2" rx="1" fill="rgba(59,130,246,0.3)"/>
                    <rect x="8" y="18" width="20" height="2" rx="1" fill="rgba(59,130,246,0.2)"/>
                    <rect x="8" y="24" width="22" height="2" rx="1" fill="rgba(59,130,246,0.2)"/>
                    <rect x="8" y="30" width="16" height="2" rx="1" fill="rgba(59,130,246,0.15)"/>
                    <rect x="8" y="36" width="24" height="2" rx="1" fill="rgba(59,130,246,0.15)"/>
                    <text x="20" y="9" textAnchor="middle" fill="#3b82f6" fontSize="5.5" fontWeight="700" fontFamily="Inter">DOCX</text>
                  </svg>
                </div>
                <div className="mock-lines output-lines">
                  <div className="mock-line" style={{width: '85%'}}></div>
                  <div className="mock-line" style={{width: '70%'}}></div>
                  <div className="mock-line" style={{width: '90%'}}></div>
                  <div className="mock-line" style={{width: '60%'}}></div>
                  <div className="mock-line" style={{width: '75%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default LivePreview;
