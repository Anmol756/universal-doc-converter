import { motion } from 'framer-motion';
import './HeroSection.css';

const FORMAT_CHIPS = [
  { label: 'PDF', icon: '📄', delay: 0 },
  { label: 'DOCX', icon: '📝', delay: 0.1 },
  { label: 'XLSX', icon: '📊', delay: 0.2 },
  { label: 'PPTX', icon: '📑', delay: 0.3 },
  { label: 'JPG', icon: '🖼️', delay: 0.4 },
  { label: 'PNG', icon: '🎨', delay: 0.5 },
];

function HeroSection({ onUploadClick, onDemoClick }) {
  return (
    <section className="hero" id="hero">
      {/* Ambient glow behind hero */}
      <div className="hero-glow" aria-hidden="true">
        <div className="hero-glow-orb hero-glow-1"></div>
        <div className="hero-glow-orb hero-glow-2"></div>
      </div>

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Status badge */}
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="hero-badge-dot"></span>
          <span>Open Source · Free Forever</span>
        </motion.div>

        {/* Heading */}
        <h1 className="hero-h1">
          <span className="hero-h1-line">Convert Anything.</span>
          <span className="hero-h1-line hero-h1-gradient">Instantly.</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtext">
          Transform documents between PDF, Word, Excel, PowerPoint, and image formats
          with a single click. Enterprise-grade quality, zero compromises.
        </p>

        {/* CTA Buttons */}
        <div className="hero-cta-group">
          <motion.button
            className="btn btn-primary hero-cta-primary"
            onClick={onUploadClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 14V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M5 8l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 16h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Upload File
          </motion.button>
          <motion.button
            className="btn btn-ghost hero-cta-ghost"
            onClick={onDemoClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <polygon points="6,3 15,9 6,15" fill="currentColor" opacity="0.8"/>
            </svg>
            Try Demo
          </motion.button>
        </div>

        {/* Floating Format Chips */}
        <div className="hero-chips">
          {FORMAT_CHIPS.map((chip) => (
            <motion.span
              key={chip.label}
              className="hero-chip"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + chip.delay, duration: 0.4 }}
            >
              <span className="hero-chip-icon">{chip.icon}</span>
              {chip.label}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Floating glass upload card preview */}
      <motion.div
        className="hero-upload-preview"
        initial={{ opacity: 0, y: 40, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="hero-preview-card glass-card">
          <div className="hero-preview-card-glow"></div>
          <div className="hero-preview-header">
            <div className="hero-preview-dots">
              <span></span><span></span><span></span>
            </div>
            <span className="hero-preview-label">Drop files here</span>
          </div>
          <div className="hero-preview-body">
            <div className="hero-waveform" aria-hidden="true">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="waveform-bar"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
            <div className="hero-preview-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <defs>
                  <linearGradient id="heroUpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed"/>
                    <stop offset="100%" stopColor="#06b6d4"/>
                  </linearGradient>
                </defs>
                <path d="M24 32V14" stroke="url(#heroUpGrad)" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M16 22l8-8 8 8" stroke="url(#heroUpGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 32a8 8 0 008 8h16a8 8 0 000-16 10 10 0 00-20 4 6 6 0 00-4 4z" stroke="url(#heroUpGrad)" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
              </svg>
            </div>
            <p className="hero-preview-text">Drag & drop or browse</p>
            <p className="hero-preview-subtext">PDF, DOCX, PPTX, XLSX, Images · Max 10 MB</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default HeroSection;
