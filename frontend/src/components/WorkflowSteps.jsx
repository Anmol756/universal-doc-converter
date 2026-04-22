import { motion } from 'framer-motion';
import './WorkflowSteps.css';

const STEPS = [
  {
    number: '01',
    title: 'Upload',
    desc: 'Drag & drop or browse to select your file',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <defs>
          <linearGradient id="wf1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed"/>
            <stop offset="100%" stopColor="#a78bfa"/>
          </linearGradient>
        </defs>
        <path d="M16 22V8" stroke="url(#wf1)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M10 14l6-6 6 6" stroke="url(#wf1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 22h20" stroke="url(#wf1)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <path d="M4 26h24" stroke="url(#wf1)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Convert',
    desc: 'Choose your target format and hit convert',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <defs>
          <linearGradient id="wf2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4"/>
            <stop offset="100%" stopColor="#22d3ee"/>
          </linearGradient>
        </defs>
        <path d="M8 12h16M20 8l4 4-4 4" stroke="url(#wf2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24 20H8M12 16l-4 4 4 4" stroke="url(#wf2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Download',
    desc: 'Get your converted file instantly',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <defs>
          <linearGradient id="wf3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981"/>
            <stop offset="100%" stopColor="#34d399"/>
          </linearGradient>
        </defs>
        <path d="M16 6v16" stroke="url(#wf3)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M10 16l6 6 6-6" stroke="url(#wf3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 26h20" stroke="url(#wf3)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
  },
];

const stepVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.15, duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  }),
};

function WorkflowSteps() {
  return (
    <section className="workflow-section" id="workflow">
      <div className="container">
        <motion.div
          className="workflow-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">🚀 How It Works</span>
          <h2 className="section-title">Three Simple Steps</h2>
          <p className="section-subtitle">
            From upload to download in under 30 seconds
          </p>
        </motion.div>

        <div className="workflow-steps">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              className="workflow-step"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stepVariants}
            >
              <div className="workflow-step-card glass-card">
                <span className="workflow-step-number">{step.number}</span>
                <div className="workflow-step-icon">{step.icon}</div>
                <h3 className="workflow-step-title">{step.title}</h3>
                <p className="workflow-step-desc">{step.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="workflow-connector" aria-hidden="true">
                  <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
                    <defs>
                      <linearGradient id={`conn${i}`} x1="0%" y1="50%" x2="100%" y2="50%">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.6"/>
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6"/>
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 10h48M44 4l6 6-6 6"
                      stroke={`url(#conn${i})`}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="4 4"
                    />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WorkflowSteps;
