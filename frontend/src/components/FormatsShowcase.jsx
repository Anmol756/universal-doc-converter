import { motion } from 'framer-motion';
import './FormatsShowcase.css';

const FORMAT_GROUPS = [
  {
    label: 'Documents',
    color: '#ef4444',
    formats: [
      { name: 'PDF', icon: '📄' },
      { name: 'DOCX', icon: '📝' },
      { name: 'DOC', icon: '📃' },
    ],
  },
  {
    label: 'Presentations',
    color: '#f97316',
    formats: [
      { name: 'PPTX', icon: '📊' },
      { name: 'PPT', icon: '📑' },
    ],
  },
  {
    label: 'Spreadsheets',
    color: '#22c55e',
    formats: [
      { name: 'XLSX', icon: '📗' },
      { name: 'XLS', icon: '📈' },
    ],
  },
  {
    label: 'Images',
    color: '#06b6d4',
    formats: [
      { name: 'JPG', icon: '🖼️' },
      { name: 'PNG', icon: '🎨' },
      { name: 'WebP', icon: '🌐' },
      { name: 'BMP', icon: '🖌️' },
      { name: 'TIFF', icon: '🏞️' },
    ],
  },
];

const groupVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

function FormatsShowcase() {
  return (
    <section className="formats-section" id="formats">
      <div className="container">
        <motion.div
          className="formats-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">🔄 Formats</span>
          <h2 className="section-title">Every Format You Need</h2>
          <p className="section-subtitle">
            Seamless conversion between all major document and image formats
          </p>
        </motion.div>

        <div className="formats-groups">
          {FORMAT_GROUPS.map((group, gi) => (
            <motion.div
              key={group.label}
              className="format-group"
              custom={gi}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={groupVariants}
            >
              <div
                className="format-group-label"
                style={{ color: group.color }}
              >
                <span
                  className="format-group-dot"
                  style={{ background: group.color, boxShadow: `0 0 8px ${group.color}40` }}
                ></span>
                {group.label}
              </div>
              <div className="format-chips-row">
                {group.formats.map((fmt) => (
                  <span
                    key={fmt.name}
                    className="format-badge"
                    style={{
                      '--badge-color': group.color,
                    }}
                  >
                    <span className="format-badge-icon">{fmt.icon}</span>
                    <span className="format-badge-name">{fmt.name}</span>
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FormatsShowcase;
