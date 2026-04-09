import './ConversionSelector.css';

const CONVERSION_INFO = {
  pdf_to_word: {
    label: 'PDF → Word',
    description: 'Convert PDF to editable DOCX',
    icon: '📄',
    arrow: '→',
    outputIcon: '📝',
    color: '#ef4444',
    outputColor: '#3b82f6',
  },
  word_to_pdf: {
    label: 'Word → PDF',
    description: 'Convert DOCX to PDF format',
    icon: '📝',
    arrow: '→',
    outputIcon: '📄',
    color: '#3b82f6',
    outputColor: '#ef4444',
  },
  image_to_pdf: {
    label: 'Image → PDF',
    description: 'Convert image to PDF document',
    icon: '🖼️',
    arrow: '→',
    outputIcon: '📄',
    color: '#10b981',
    outputColor: '#ef4444',
  },
  pdf_to_ppt: {
    label: 'PDF → PowerPoint',
    description: 'Convert PDF pages to PPTX slides',
    icon: '📄',
    arrow: '→',
    outputIcon: '📊',
    color: '#ef4444',
    outputColor: '#f97316',
  },
  ppt_to_pdf: {
    label: 'PowerPoint → PDF',
    description: 'Convert PPTX presentation to PDF',
    icon: '📊',
    arrow: '→',
    outputIcon: '📄',
    color: '#f97316',
    outputColor: '#ef4444',
  },
  pdf_to_excel: {
    label: 'PDF → Excel',
    description: 'Extract tables from PDF to XLSX',
    icon: '📄',
    arrow: '→',
    outputIcon: '📗',
    color: '#ef4444',
    outputColor: '#22c55e',
  },
  excel_to_pdf: {
    label: 'Excel → PDF',
    description: 'Convert XLSX spreadsheet to PDF',
    icon: '📗',
    arrow: '→',
    outputIcon: '📄',
    color: '#22c55e',
    outputColor: '#ef4444',
  },
};

function ConversionSelector({ allowedConversions, selectedType, onSelect, disabled }) {
  if (!allowedConversions || allowedConversions.length === 0) return null;

  return (
    <div className="conversion-selector animate-slide-up" id="conversion-selector">
      <h3 className="selector-title">Choose Conversion</h3>
      <div className="selector-grid">
        {allowedConversions.map((type) => {
          const info = CONVERSION_INFO[type];
          if (!info) return null;

          const isSelected = selectedType === type;

          return (
            <button
              key={type}
              className={`selector-card glass-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect(type)}
              disabled={disabled}
              id={`conversion-option-${type}`}
              aria-pressed={isSelected}
            >
              <div className="selector-card-icons">
                <span className="selector-icon" style={{ background: `${info.color}15`, borderColor: `${info.color}30` }}>
                  {info.icon}
                </span>
                <span className="selector-arrow">→</span>
                <span className="selector-icon" style={{ background: `${info.outputColor}15`, borderColor: `${info.outputColor}30` }}>
                  {info.outputIcon}
                </span>
              </div>
              <div className="selector-card-text">
                <span className="selector-label">{info.label}</span>
                <span className="selector-desc">{info.description}</span>
              </div>
              {isSelected && <div className="selector-check">✓</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ConversionSelector;
