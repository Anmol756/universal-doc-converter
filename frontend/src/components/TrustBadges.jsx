import { motion } from 'framer-motion';
import './TrustBadges.css';

const BADGES = [
  {
    title: 'No Data Stored',
    desc: 'Your files are never saved on our servers',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <defs>
          <linearGradient id="trust1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981"/>
            <stop offset="100%" stopColor="#06b6d4"/>
          </linearGradient>
        </defs>
        <path d="M14 3L4 8v6c0 6 4.5 11.5 10 13 5.5-1.5 10-7 10-13V8L14 3z" stroke="url(#trust1)" strokeWidth="1.5" fill="rgba(16,185,129,0.1)"/>
        <path d="M10 14l3 3 5-6" stroke="url(#trust1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Auto-Delete in 1 Hour',
    desc: 'All uploaded files are permanently erased',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <defs>
          <linearGradient id="trust2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed"/>
            <stop offset="100%" stopColor="#a78bfa"/>
          </linearGradient>
        </defs>
        <circle cx="14" cy="14" r="11" stroke="url(#trust2)" strokeWidth="1.5" fill="rgba(124,58,237,0.08)"/>
        <path d="M14 8v6l4 3" stroke="url(#trust2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: '256-bit Encrypted',
    desc: 'Bank-level encryption for all transfers',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <defs>
          <linearGradient id="trust3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4"/>
            <stop offset="100%" stopColor="#22d3ee"/>
          </linearGradient>
        </defs>
        <rect x="5" y="12" width="18" height="12" rx="3" stroke="url(#trust3)" strokeWidth="1.5" fill="rgba(6,182,212,0.08)"/>
        <path d="M9 12V9a5 5 0 0110 0v3" stroke="url(#trust3)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="14" cy="18.5" r="2" fill="url(#trust3)"/>
        <path d="M14 20.5V22" stroke="url(#trust3)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const badgeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

function TrustBadges() {
  return (
    <section className="trust-section" id="trust">
      <div className="container">
        <motion.div
          className="trust-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">🔐 Security</span>
          <h2 className="section-title">Your Privacy, Our Priority</h2>
          <p className="section-subtitle">
            Enterprise-grade security with zero-knowledge architecture
          </p>
        </motion.div>

        <div className="trust-badges-grid">
          {BADGES.map((badge, i) => (
            <motion.div
              key={badge.title}
              className="trust-badge glass-card"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={badgeVariants}
            >
              <div className="trust-badge-icon">{badge.icon}</div>
              <div className="trust-badge-text">
                <h3 className="trust-badge-title">{badge.title}</h3>
                <p className="trust-badge-desc">{badge.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustBadges;
