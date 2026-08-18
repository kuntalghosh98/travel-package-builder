/**
 * TemplateCard Component (React)
 * Displays a single template in the template grid
 */

import { formatDate } from '../utils/helpers.js';

export function TemplateCard({ template, onUse, onEdit, onDelete, onPreview, isDefault = false }) {
  const isProtected = template.isDefault || template.isProtected;
  
  return (
    <div className={`template-card ${isProtected ? 'template-card--protected' : ''}`} data-template-id={template.id}>
      <div className="template-card__thumbnail">
        {template.thumbnail ? (
          <img src={template.thumbnail} alt={template.name} loading="lazy" />
        ) : (
          <div className="template-card__placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
            </svg>
          </div>
        )}
        {isProtected && <span className="template-card__badge template-card__badge--default">Default</span>}
        {template.isProtected && !template.isDefault && <span className="template-card__badge template-card__badge--protected">Protected</span>}
      </div>
      <div className="template-card__content">
        <h3 className="template-card__name">{template.name}</h3>
        {template.description && <p className="template-card__description">{template.description}</p>}
        <div className="template-card__meta">
          <span className="template-card__category">{template.category}</span>
          <span className="template-card__updated">Updated {formatDate(template.updatedAt)}</span>
        </div>
        {template.tags && template.tags.length > 0 && (
          <div className="template-card__tags">
            {template.tags.map(tag => <span key={tag} className="template-card__tag">{tag}</span>)}
          </div>
        )}
      </div>
      <div className="template-card__actions">
        <button 
          className="btn btn--primary btn--sm template-card__btn-use" 
          data-action="use" 
          onClick={() => onUse?.(template.id)}
        >
          Use Template
        </button>
        <button 
          className="btn btn--secondary btn--sm template-card__btn-preview" 
          data-action="preview"
          onClick={() => onPreview?.(template)}
        >
          Preview
        </button>
        {!isProtected && (
          <>
            <button 
              className="btn btn--ghost btn--sm template-card__btn-edit" 
              data-action="edit"
              onClick={() => onEdit?.(template)}
            >
              Edit
            </button>
            <button 
              className="btn btn--danger btn--sm template-card__btn-delete" 
              data-action="delete"
              onClick={() => onDelete?.(template.id)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}