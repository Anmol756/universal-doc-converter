import { motion } from 'framer-motion';
import './FeaturesGrid.css';

const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <defs>
          <linearGradient id="feat1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b"/>
            <stop offset="100%" stopColor="#f97316"/>
          </linearGradient>
        </defs>
        <path d="M14 3l2.5 6H22l-5 4 2 6.5L14 16l-5 3.5 2-6.5-5-4h5.5L14 3z" stroke="url(#feat1)" strokeWidth="1.5" fill="rgba(245,158,11,0.15)" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Lightning Fast',
    desc: 'Conversions complete in seconds powered by optimized engines',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(249,115,22,0.08))',
    borderColor: 'rgba(245,158,11,0.2)',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <defs>
          <linearGradient id="feat2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981"/>
            <stop offset="100%" stopColor="#06b6d4"/>
          </linearGradient>
        </defs>
        <rect x="5" y="11" width="18" height="13" rx="3" stroke="url(#feat2)" strokeWidth="1.5" fill="rgba(16,185,129,0.1)"/>
        <path d="M9 11V8a5 5 0 0110 0v3" stroke="url(#feat2)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="14" cy="18" r="2" fill="url(#feat2)"/>
      </svg>
    ),
    title: 'Secure & Private',
    desc: 'Files auto-deleted after processing. No data stored permanently',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.08))',
    borderColor: 'rgba(16,185,129,0.2)',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <defs>
          <linearGradient id="feat3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed"/>
            <stop offset="100%" stopColor="#a78bfa"/>
          </linearGradient>
        </defs>
        <circle cx="14" cy="14" r="10" stroke="url(#feat3)" strokeWidth="1.5" fill="rgba(124,58,237,0.08)"/>
        <circle cx="14" cy="14" r="3" fill="url(#feat3)"/>
        <path d="M14 6v3M14 19v3M6 14h3M19 14h3" stroke="url(#feat3)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'High Fidelity',
    desc: 'Preserves formatting, images, and structure during conversion',
    gradient: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(167,139,250,0.08))',
    borderColor: 'rgba(124,58,237,0.2)',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <defs>
          <linearGradient id="feat4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4"/>
            <stop offset="100%" stopColor="#22d3ee"/>
          </linearGradient>
        </defs>
        <path d="M7 10a7 7 0 0114 0" stroke="url(#feat4)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7 18a7 7 0 0014 0" stroke="url(#feat4)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M21 10v8M7 10v8" stroke="url(#feat4)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="14" cy="14" r="2.5" stroke="url(#feat4)" strokeWidth="1.5" fill="rgba(6,182,212,0.15)"/>
      </svg>
    ),
    title: 'Multi-format Support',
    desc: 'PDF, Word, Excel, PowerPoint, and image formats supported',
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(34,211,238,0.08))',
    borderColor: 'rgba(6,182,212,0.2)',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

function FeaturesGrid() {
  return (
    <section className="features-section" id="features">
      <div className="container">
        <motion.div
          className="features-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">⚡ Features</span>
          <h2 className="section-title">Built for Speed & Precision</h2>
          <p className="section-subtitle">
            Every feature designed to make document conversion effortless
          </p>
        </motion.div>

        <div className="features-grid-v2">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="feature-card-v2 glass-card"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={cardVariants}
            >
              <div
                className="feature-icon-v2"
                style={{
                  background: feature.gradient,
                  borderColor: feature.borderColor,
                }}
              >
                {feature.icon}
              </div>
              <h3 className="feature-title-v2">{feature.title}</h3>
              <p className="feature-desc-v2">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesGrid;
