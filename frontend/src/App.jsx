import { useState, useEffect, useRef } from 'react';
import { useConverter, STATUS } from './hooks/useConverter';
import { useToast } from './components/Toast';
import Header from './components/Header';
import Footer from './components/Footer';
import FileUpload from './components/FileUpload';
import FileCard from './components/FileCard';
import ConversionSelector from './components/ConversionSelector';
import ConversionStatus from './components/ConversionStatus';
import './App.css';

const TOOL_TITLES = {
  excel_to_pdf: 'Excel to PDF',
  image_to_pdf: 'Image to PDF',
  pdf_to_excel: 'PDF to Excel',
  pdf_to_ppt: 'PDF to PowerPoint',
  pdf_to_word: 'PDF to Word',
  ppt_to_pdf: 'PowerPoint to PDF',
  word_to_pdf: 'Word to PDF',
  pdf_merge: 'Merge PDF',
  pdf_split: 'Split PDF',
  compress_pdf: 'Compress PDF',
  compress_image: 'Compress Image',
};

function App() {
  const [activeTool, setActiveTool] = useState(null);
  const [panelKey, setPanelKey] = useState(0); // drives re-mount for tab animation
  const prevStatusRef = useRef(null);
  const { addToast } = useToast();

  const {
    files,
    status,
    uploadProgress,
    uploadData,
    downloadUrl,
    error,
    conversionType,
    upload,
    addFiles,
    convert,
    reset,
    setConversionType,
  } = useConverter();

  useEffect(() => {
    // Automatically select the active tool's conversion type if files are uploaded
    if (activeTool && status === STATUS.UPLOADED) {
      setConversionType(activeTool);
    }
  }, [activeTool, status, setConversionType]);

  // Toast on conversion complete or error
  useEffect(() => {
    const prev = prevStatusRef.current;
    prevStatusRef.current = status;

    if (prev === STATUS.CONVERTING && status === STATUS.DONE) {
      const toolName = TOOL_TITLES[activeTool || conversionType] || 'Conversion';
      addToast(`${toolName} completed successfully`, { type: 'success' });
    }

    if (prev === STATUS.UPLOADING && status === STATUS.UPLOADED) {
      addToast('File uploaded — ready to convert', { type: 'info', icon: '📤', duration: 2500 });
    }

    if (status === STATUS.ERROR && error && prev !== STATUS.ERROR) {
      addToast(error, { type: 'error', duration: 5000 });
    }
  }, [status, error, activeTool, conversionType, addToast]);

  const handleToolSelect = (tool) => {
    setActiveTool(tool);
    setPanelKey((k) => k + 1); // trigger re-mount for tab animation
    reset(); // reset any ongoing conversions when switching tools
  };

  const showUploadZone = status === STATUS.IDLE || status === STATUS.ERROR;
  const showFileCard = files && files.length > 0 && status !== STATUS.IDLE;
  const showSelector = status === STATUS.UPLOADED && !activeTool;
  const isProcessing = status === STATUS.UPLOADING || status === STATUS.CONVERTING;
  const isMultiFileTool = activeTool === 'pdf_merge' || activeTool === 'image_to_pdf';
  const showAddMore = status === STATUS.UPLOADED && isMultiFileTool;

  return (
    <>
      <Header onSelectTool={handleToolSelect} activeTool={activeTool} />

      <main className="main-content">
        {/* Background Ambient Effects */}
        <div className="ambient-bg" aria-hidden="true">
          <div className="ambient-orb orb-1"></div>
          <div className="ambient-orb orb-2"></div>
          <div className="ambient-orb orb-3"></div>
        </div>

        <div className="container">
          {/* Hero Section — animates on tool switch */}
          <section className="hero-section animate-tab-enter" key={`hero-${panelKey}`} id="hero">
            <h2 className="hero-title">
              {activeTool ? (
                <>{TOOL_TITLES[activeTool]} <span className="gradient-text">Tool</span></>
              ) : (
                <>Convert Your Documents <span className="gradient-text">Instantly</span></>
              )}
            </h2>
            <p className="hero-subtitle">
              {activeTool 
                ? `Upload your file(s) below to start using the ${TOOL_TITLES[activeTool]} service.`
                : 'Transform files between PDF, Word, and Image formats with a single click. Fast, secure, and free.'}
            </p>
          </section>

          {/* Converter Panel — animates on tool switch */}
          <section className="converter-panel glass-card animate-tab-enter" key={`panel-${panelKey}`} id="converter-panel">
            {/* Upload Zone */}
            {showUploadZone && (
              <FileUpload onFileSelect={upload} disabled={isProcessing} />
            )}

            {/* File Cards */}
            {showFileCard && (
               <div className="file-cards-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  {files.map((file, idx) => (
                      <FileCard
                        key={idx}
                        file={file}
                        uploadData={uploadData && uploadData.length > idx ? uploadData[idx] : null}
                        onRemove={status !== STATUS.CONVERTING ? reset : undefined}
                      />
                  ))}
               </div>
            )}

            {/* Add More Files Zone */}
            {showAddMore && (
              <div style={{ marginTop: '16px' }}>
                <FileUpload onFileSelect={addFiles} disabled={isProcessing} />
              </div>
            )}

            {/* Conversion Selector */}
            {showSelector && (
              <ConversionSelector
                allowedConversions={uploadData?.allowed_conversions}
                selectedType={conversionType}
                onSelect={setConversionType}
                disabled={isProcessing}
              />
            )}

            {/* Status / Progress / Actions */}
            <ConversionStatus
              status={status}
              uploadProgress={uploadProgress}
              error={error}
              downloadUrl={downloadUrl}
              conversionType={activeTool || conversionType}
              onConvert={() => convert()}
              onDownload={() => { }}
              onReset={reset}
            />
          </section>

          {/* Features Section */}
          <section className="features-section" id="features">
            <div className="features-grid">
              <div className="feature-card glass-card animate-fade-in">
                <div className="feature-icon">⚡</div>
                <h3 className="feature-title">Lightning Fast</h3>
                <p className="feature-desc">Conversions complete in seconds, powered by optimized Python libraries</p>
              </div>
              <div className="feature-card glass-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="feature-icon">🔒</div>
                <h3 className="feature-title">Secure & Private</h3>
                <p className="feature-desc">Files are auto-deleted after processing. No data stored permanently</p>
              </div>
              <div className="feature-card glass-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="feature-icon">🎯</div>
                <h3 className="feature-title">High Fidelity</h3>
                <p className="feature-desc">Preserves formatting, images, and structure during conversion</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default App;
