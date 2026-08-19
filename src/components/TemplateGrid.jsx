/**
 * TemplateGrid Component (React)
 * Displays default template cards.
 */

import { TemplateCard } from './TemplateCard.jsx';

export function TemplateGrid({
  defaultTemplates = [],
  onUseTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onPreviewTemplate
}) {
  return (
    <div className="template-grid">
      <section className="template-section template-section--default">
        <header className="template-section__header">
          <h2 className="template-section__title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Default Templates
          </h2>
          <p className="template-section__description">Curated templates to get you started quickly</p>
        </header>
        <div className="template-section__grid" data-section="default">
          {defaultTemplates.length > 0
            ? defaultTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isDefault={true}
                  onUse={onUseTemplate}
                  onEdit={onEditTemplate}
                  onDelete={onDeleteTemplate}
                  onPreview={onPreviewTemplate}
                />
              ))
            : (
              <div className="template-section__empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                </svg>
                <p>No default templates available</p>
              </div>
            )
          }
        </div>
      </section>
    </div>
  );
}
