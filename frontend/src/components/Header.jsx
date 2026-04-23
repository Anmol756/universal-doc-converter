import { useState } from 'react';
import './Header.css';

const TOOL_CATEGORIES = {
  conversion: ['excel_to_pdf', 'image_to_pdf', 'pdf_to_excel', 'pdf_to_ppt', 'pdf_to_word', 'ppt_to_pdf', 'word_to_pdf'],
  mergesplit: ['pdf_merge', 'pdf_split'],
  compression: ['compress_pdf', 'compress_image'],
};

function Header({ onSelectTool, activeTool }) {
  const [openMenu, setOpenMenu] = useState(null);

  const handleSelect = (tool) => {
    onSelectTool?.(tool);
    setOpenMenu(null);
  };

  // Determine which nav category the active tool belongs to
  const activeCategory = activeTool
    ? Object.entries(TOOL_CATEGORIES).find(([, tools]) => tools.includes(activeTool))?.[0] || null
    : null;

  return (
    <header className="header" id="app-header">
      <div className="header-inner container">
        <div className="header-brand" onClick={() => handleSelect(null)} style={{cursor: 'pointer'}}>
          <div className="header-logo">
            <img src="/logo.png" alt="DocConvert Logo" width="42" height="42" />
          </div>
          <div>
            <h1 className="header-title">
              <span className="gradient-text">DocConvert</span>
            </h1>
            <p className="header-subtitle">Universal Document Converter</p>
          </div>
        </div>

        <nav className="header-nav">
          <div 
            className="nav-item"
            onMouseEnter={() => setOpenMenu('conversion')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div className={`nav-link ${activeCategory === 'conversion' ? 'nav-active' : ''}`}>
              Conversion
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{marginLeft: '2px'}}>
                <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={`dropdown-menu ${openMenu === 'conversion' ? 'show' : ''}`}>
              <div className={`dropdown-item ${activeTool === 'excel_to_pdf' ? 'active' : ''}`} onClick={() => handleSelect('excel_to_pdf')}>Excel to PDF</div>
              <div className={`dropdown-item ${activeTool === 'image_to_pdf' ? 'active' : ''}`} onClick={() => handleSelect('image_to_pdf')}>Image to PDF</div>
              <div className={`dropdown-item ${activeTool === 'pdf_to_excel' ? 'active' : ''}`} onClick={() => handleSelect('pdf_to_excel')}>PDF to Excel</div>
              <div className={`dropdown-item ${activeTool === 'pdf_to_ppt' ? 'active' : ''}`} onClick={() => handleSelect('pdf_to_ppt')}>PDF to PPT</div>
              <div className={`dropdown-item ${activeTool === 'pdf_to_word' ? 'active' : ''}`} onClick={() => handleSelect('pdf_to_word')}>PDF to Word</div>
              <div className={`dropdown-item ${activeTool === 'ppt_to_pdf' ? 'active' : ''}`} onClick={() => handleSelect('ppt_to_pdf')}>PPT to PDF</div>
              <div className={`dropdown-item ${activeTool === 'word_to_pdf' ? 'active' : ''}`} onClick={() => handleSelect('word_to_pdf')}>Word to PDF</div>
            </div>
          </div>
          <div 
            className="nav-item"
            onMouseEnter={() => setOpenMenu('mergesplit')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div className={`nav-link ${activeCategory === 'mergesplit' ? 'nav-active' : ''}`}>
              Merge/Split
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{marginLeft: '2px'}}>
                <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={`dropdown-menu ${openMenu === 'mergesplit' ? 'show' : ''}`}>
              <div className={`dropdown-item ${activeTool === 'pdf_merge' ? 'active' : ''}`} onClick={() => handleSelect('pdf_merge')}>PDF Merge</div>
              <div className={`dropdown-item ${activeTool === 'pdf_split' ? 'active' : ''}`} onClick={() => handleSelect('pdf_split')}>PDF Split</div>
            </div>
          </div>
          <div 
            className="nav-item"
            onMouseEnter={() => setOpenMenu('compression')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div className={`nav-link ${activeCategory === 'compression' ? 'nav-active' : ''}`}>
              Compression
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{marginLeft: '2px'}}>
                <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={`dropdown-menu ${openMenu === 'compression' ? 'show' : ''}`}>
              <div className={`dropdown-item ${activeTool === 'compress_pdf' ? 'active' : ''}`} onClick={() => handleSelect('compress_pdf')}>Compress PDF</div>
              <div className={`dropdown-item ${activeTool === 'compress_image' ? 'active' : ''}`} onClick={() => handleSelect('compress_image')}>Compress Image</div>
            </div>
          </div>
        </nav>

        <div className="header-badge">
          <span className="badge-dot"></span>
          Beta
        </div>
      </div>
    </header>
  );
}

export default Header;
