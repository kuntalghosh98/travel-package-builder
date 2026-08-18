/**
 * TemplatePreview Component (React)
 * Modal preview for template details
 */

import { useEffect } from 'react';

export function TemplatePreview({ template, onClose, onUse }) {
  if (!template) return null;
  
  const isProtected = template.isDefault || template.isProtected;
  
  useEffect(() => {
    // Handle escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };
  
  const renderStructureItems = (content) => {
    if (!content) return <li>No structure defined</li>;
    
    const items = [];
    if (content.general) items.push(<li key="general"><span className="structure-icon">📋</span> General Information</li>);
    if (content.cover) items.push(<li key="cover"><span className="structure-icon">🖼️</span> Cover Page</li>);
    if (content.journey) items.push(<li key="journey"><span className="structure-icon">🗺️</span> Journey Overview</li>);
    if (content.hotels) items.push(<li key="hotels"><span className="structure-icon">🏨</span> Stay Options</li>);
    if (content.itinerary) items.push(<li key="itinerary"><span className="structure-icon">📅</span> Day-by-day Itinerary</li>);
    if (content.inclusions) items.push(<li key="inclusions"><span className="structure-icon">✅</span> Inclusions & Exclusions</li>);
    if (content.pricing) items.push(<li key="pricing"><span className="structure-icon">💰</span> Package Pricing</li>);
    if (content.fineprint) items.push(<li key="fineprint"><span className="structure-icon">📝</span> Good to Know</li>);
    
    return items.length > 0 ? items : <li>No structure defined</li>;
  };
  
  return (
    <div className="modal modal--preview is-open" role="dialog" aria-modal="true" aria-labelledby="preview-title" onClick={handleOverlayClick}>
      <div className="modal__overlay" data-action="close"></div>
      <div className="modal__content modal__content--large">
        <header className="modal__header">
          <h2 id="preview-title" className="modal__title">{template.name}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close preview">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </header>
        <div className="modal__body">
          <div className="template-preview">
            {/* Thumbnail */}
            <div className="template-preview__thumbnail">
              {template.thumbnail ? (
                <img src={template.thumbnail} alt={template.name} />
              ) : (
                <div className="template-preview__placeholder">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                  </svg>
                </div>
              )}
              <div className="template-preview__badges">
                {isProtected && <span className="badge badge--default">Default Template</span>}
                {template.isProtected && !template.isDefault && <span className="badge badge--protected">Protected</span>}
                <span className="badge badge--category">{template.category}</span>
              </div>
            </div>
            
            {/* Details */}
            <div className="template-preview__details">
              {template.description && <p className="template-preview__description">{template.description}</p>}
              
              <div className="template-preview__meta">
                <div className="template-preview__meta-item">
                  <label>Category</label>
                  <span>{template.category}</span>
                </div>
                <div className="template-preview__meta-item">
                  <label>Created</label>
                  <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="template-preview__meta-item">
                  <label>Updated</label>
                  <span>{new Date(template.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="template-preview__meta-item">
                  <label>Type</label>
                  <span>{isProtected ? 'Default (Read-only)' : 'Custom'}</span>
                </div>
              </div>
              
              {template.tags && template.tags.length > 0 && (
                <div className="template-preview__tags">
                  <label>Tags</label>
                  <div className="template-preview__tags-list">
                    {template.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                  </div>
                </div>
              )}
              
              {/* Structure Preview */}
              <div className="template-preview__structure">
                <h4>Template Structure</h4>
                <ul className="template-preview__structure-list">
                  {renderStructureItems(template.content)}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <footer className="modal__footer">
          <button className="btn btn--secondary" onClick={onClose}>Close</button>
          <button 
            className="btn btn--primary template-preview__use-btn" 
            onClick={() => onUse?.(template.id)}
            disabled={!isProtected}
          >
            {isProtected ? 'Use This Template' : 'Use This Template'}
          </button>
        </footer>
      </div>
    </div>
  );
}