/**
 * FolderBrowser - File-explorer style main panel for My Templates
 */

import { TemplateCard } from "./TemplateCard.jsx";
import { sameId } from "../utils/helpers.js";

function getFolderPath(folderId, folders) {
  if (!folderId) return [];
  const path = [];
  let currentId = folderId;
  while (currentId) {
    const folder = folders.find(f => sameId(f.id, currentId));
    if (!folder) break;
    path.unshift(folder);
    currentId = folder.parentId;
  }
  return path;
}

function FolderBreadcrumb({ folders, selectedFolderId, onNavigate }) {
  const path = getFolderPath(selectedFolderId, folders);
  const parentId = path.length > 1 ? path[path.length - 2].id : path.length === 1 ? null : undefined;

  return (
    <nav className="folder-breadcrumb" aria-label="Folder path">
      {selectedFolderId && (
        <button
          type="button"
          className="folder-breadcrumb__back-btn"
          onClick={() => onNavigate(parentId ?? null)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      )}
      <ol className="folder-breadcrumb__list">
        <li className="folder-breadcrumb__item">
          <button
            type="button"
            className={`folder-breadcrumb__link ${selectedFolderId === null ? "folder-breadcrumb__link--active" : ""}`}
            onClick={() => onNavigate(null)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            All templates
          </button>
        </li>
        {path.map((folder, index) => (
          <li key={folder.id} className="folder-breadcrumb__item">
            <span className="folder-breadcrumb__separator" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
            <button
              type="button"
              className={`folder-breadcrumb__link ${index === path.length - 1 ? "folder-breadcrumb__link--active" : ""}`}
              onClick={() => onNavigate(folder.id)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              {folder.name}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function FolderTile({ folder, templateCount, subfolderCount, onOpen }) {
  return (
    <button type="button" className="folder-tile" onClick={() => onOpen(folder.id)}>
      <span className="folder-tile__icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      </span>
      <span className="folder-tile__name">{folder.name}</span>
      <span className="folder-tile__meta">
        {subfolderCount > 0 && `${subfolderCount} folder${subfolderCount !== 1 ? "s" : ""}`}
        {subfolderCount > 0 && templateCount > 0 && " · "}
        {templateCount > 0 && `${templateCount} template${templateCount !== 1 ? "s" : ""}`}
        {subfolderCount === 0 && templateCount === 0 && "Empty folder"}
      </span>
    </button>
  );
}

export function FolderBrowser({
  folders = [],
  userTemplates = [],
  selectedFolderId = null,
  onNavigate,
  onUseTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onPreviewTemplate,
  emptyStateMessage = "This folder is empty."
}) {
  const childFolders = folders.filter(f => sameId(f.parentId, selectedFolderId));
  const templatesInFolder = userTemplates.filter(t => sameId(t.folderId, selectedFolderId));
  const currentFolder = selectedFolderId ? folders.find(f => sameId(f.id, selectedFolderId)) : null;

  const getCounts = (folderId) => ({
    templates: userTemplates.filter(t => sameId(t.folderId, folderId)).length,
    subfolders: folders.filter(f => sameId(f.parentId, folderId)).length
  });

  const isEmpty = childFolders.length === 0 && templatesInFolder.length === 0;

  return (
    <div className="folder-browser">
      <FolderBreadcrumb
        folders={folders}
        selectedFolderId={selectedFolderId}
        onNavigate={onNavigate}
      />

      {currentFolder && (
        <h3 className="folder-browser__heading">{currentFolder.name}</h3>
      )}

      {childFolders.length > 0 && (
        <div className="folder-browser__folders">
          {childFolders.map(folder => {
            const { templates, subfolders } = getCounts(folder.id);
            return (
              <FolderTile
                key={folder.id}
                folder={folder}
                templateCount={templates}
                subfolderCount={subfolders}
                onOpen={onNavigate}
              />
            );
          })}
        </div>
      )}

      {templatesInFolder.length > 0 && (
        <div className="template-section__grid template-section__grid--user folder-browser__templates" data-section="user">
          {templatesInFolder.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              isDefault={false}
              onUse={onUseTemplate}
              onEdit={onEditTemplate}
              onDelete={onDeleteTemplate}
              onPreview={onPreviewTemplate}
            />
          ))}
        </div>
      )}

      {isEmpty && (
        <div className="folder-browser__empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <p>{emptyStateMessage}</p>
        </div>
      )}
    </div>
  );
}
