import './FileCard.css';

function FileCard({ file, uploadData, onRemove }) {
  if (!file) return null;

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return { emoji: '📄', color: '#ef4444' };
    if (['docx', 'doc'].includes(ext)) return { emoji: '📝', color: '#3b82f6' };
    if (['pptx', 'ppt'].includes(ext)) return { emoji: '📊', color: '#f97316' };
    if (['xlsx', 'xls'].includes(ext)) return { emoji: '📗', color: '#22c55e' };
    if (['jpg', 'jpeg', 'png', 'bmp', 'webp', 'tiff', 'tif'].includes(ext)) return { emoji: '🖼️', color: '#10b981' };
    return { emoji: '📎', color: '#8b5cf6' };
  };

  const icon = getFileIcon(file.type);
  const ext = file.name.split('.').pop().toUpperCase();

  return (
    <div className="file-card glass-card animate-slide-up" id="uploaded-file-card">
      <div className="file-card-icon" style={{ background: `${icon.color}15`, borderColor: `${icon.color}30` }}>
        <span className="file-card-emoji">{icon.emoji}</span>
        <span className="file-card-ext" style={{ color: icon.color }}>{ext}</span>
      </div>

      <div className="file-card-info">
        <p className="file-card-name truncate" title={file.name}>{file.name}</p>
        <div className="file-card-meta">
          <span>{formatSize(file.size)}</span>
          {uploadData && (
            <>
              <span className="meta-sep">•</span>
              <span className="file-card-type">{uploadData.file_type.toUpperCase()}</span>
            </>
          )}
        </div>
      </div>

      {onRemove && (
        <button className="file-card-remove btn btn-icon" onClick={onRemove} title="Remove file" aria-label="Remove uploaded file">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M5 5l8 8M13 5l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}

export default FileCard;
