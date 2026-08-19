import React from 'react';

export function SaveAsTemplateModal({
  templateName,
  templateDescription,
  templateCategory,
  templateTags,
  templateFolderId,
  folderOptions,
  onClose,
  onChange,
  onSave
}) {
  return (
    <div className="modal modal--save-template is-open" role="dialog" aria-modal="true" aria-labelledby="save-template-title" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal__overlay" onClick={onClose}></div>
      <div className="modal__content">
        <header className="modal__header">
          <h2 id="save-template-title" className="modal__title">Save as Template</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </header>
        <div className="modal__body">
          <p style={{ margin: 0, color: '#7b8792', fontSize: '13px' }}>Save the current package structure as a reusable template.</p>
          <div className="form-group">
            <label htmlFor="template-name">Template Name *</label>
            <input
              type="text"
              id="template-name"
              value={templateName}
              onChange={e => onChange.setTemplateName(e.target.value)}
              placeholder="e.g., Beach Getaway Template"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="template-description">Description</label>
            <textarea
              id="template-description"
              value={templateDescription}
              onChange={e => onChange.setTemplateDescription(e.target.value)}
              placeholder="Brief description of this template..."
              rows="3"
            />
          </div>
          <div className="form-group">
            <label htmlFor="template-category">Category</label>
            <select
              id="template-category"
              value={templateCategory}
              onChange={e => onChange.setTemplateCategory(e.target.value)}
            >
              <option value="custom">Custom</option>
              <option value="classic">Classic</option>
              <option value="adventure">Adventure</option>
              <option value="luxury">Luxury</option>
              <option value="budget">Budget</option>
              <option value="family">Family</option>
              <option value="romantic">Romantic</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="template-folder">Folder</label>
            <select
              id="template-folder"
              value={templateFolderId || ''}
              onChange={e => onChange.setTemplateFolderId(e.target.value || null)}
            >
              <option value="">All templates (no folder)</option>
              {folderOptions.map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
            <small style={{ color: '#7b8792', fontSize: '12px' }}>Choose where to store this template in My Templates</small>
          </div>
          <div className="form-group">
            <label htmlFor="template-tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="template-tags"
              value={templateTags}
              onChange={e => onChange.setTemplateTags(e.target.value)}
              placeholder="e.g., beach, 7-days, family-friendly"
            />
            <small style={{ color: '#7b8792', fontSize: '12px' }}>Separate tags with commas</small>
          </div>
        </div>
        <footer className="modal__footer">
          <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn--primary" onClick={onSave} disabled={!templateName.trim()}>Save Template</button>
        </footer>
      </div>
    </div>
  );
}
