/**
 * TemplateGrid Component (React)
 * Displays a grid of templates with sections for Default and My Templates
 */

import { TemplateCard } from './TemplateCard.jsx';
import { FolderTreeRoot } from './FolderTree.jsx';
import { FolderBrowser } from './FolderBrowser.jsx';

export function TemplateGrid({ 
  defaultTemplates = [], 
  userTemplates = [], 
  folders = [],
  selectedFolderId = null,
  expandedFolderIds = [],
  onUseTemplate, 
  onEditTemplate, 
  onDeleteTemplate, 
  onPreviewTemplate,
  onSelectFolder,
  onToggleFolderExpand,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  emptyStateMessage = 'No templates yet. Save a package as a template from the Builder!'
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

      <section className="template-section template-section--user">
        <header className="template-section__header">
          <h2 className="template-section__title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            My Templates
          </h2>
          <p className="template-section__description">Browse folders and open templates like a file explorer</p>
        </header>

        <div className="my-templates-browser">
          <aside className="my-templates-browser__sidebar">
            <div className="my-templates-browser__sidebar-label">Folders</div>
            <FolderTreeRoot
              folders={folders}
              selectedFolderId={selectedFolderId}
              expandedFolderIds={expandedFolderIds}
              onSelectFolder={onSelectFolder}
              onToggleFolderExpand={onToggleFolderExpand}
              onCreateFolder={onCreateFolder}
              onRenameFolder={onRenameFolder}
              onDeleteFolder={onDeleteFolder}
            />
          </aside>

          <main className="my-templates-browser__main">
            <FolderBrowser
              folders={folders}
              userTemplates={userTemplates}
              selectedFolderId={selectedFolderId}
              onNavigate={onSelectFolder}
              onUseTemplate={onUseTemplate}
              onEditTemplate={onEditTemplate}
              onDeleteTemplate={onDeleteTemplate}
              onPreviewTemplate={onPreviewTemplate}
              emptyStateMessage={emptyStateMessage}
            />
          </main>
        </div>
      </section>
    </div>
  );
}
