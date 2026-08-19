/**
 * FolderBrowser - File-explorer style main panel for My Templates
 */

import { useEffect, useRef, useState } from "react";
import { TemplateCard } from "./TemplateCard.jsx";
import { sameId } from "../utils/helpers.js";

const MAX_FOLDER_DEPTH = 3;
const DEFAULT_NEW_FOLDER_NAME = "new folder";

function getFolderDepth(folderId, folders) {
  if (!folderId) return 0;

  let depth = 0;
  let currentId = folderId;
  while (currentId) {
    depth += 1;
    const folder = folders.find(f => sameId(f.id, currentId));
    currentId = folder?.parentId || null;
  }

  return depth;
}

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
    <nav className="folder-breadcrumb folder-breadcrumb--compact" aria-label="Folder path">
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

function FolderTile({
  folder,
  templateCount,
  subfolderCount,
  onOpen,
  onStartRename,
  onDelete,
  isRenaming,
  renameValue,
  onRenameChange,
  onRenameConfirm,
  onRenameCancel
}) {
  const renameInputRef = useRef(null);
  const tileRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isRenaming]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (tileRef.current && !tileRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const handleRenameKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onRenameConfirm();
    } else if (event.key === "Escape") {
      event.preventDefault();
      onRenameCancel();
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div
      ref={tileRef}
      className={`folder-tile${menuOpen ? " folder-tile--menu-open" : ""}`}
    >
      <div className={`folder-tile__menu-wrap${menuOpen ? " folder-tile__menu-wrap--open" : ""}`}>
        <button
          type="button"
          className="folder-tile__menu-btn"
          aria-label={`Folder actions for ${folder.name}`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={(event) => {
            event.stopPropagation();
            setMenuOpen(open => !open);
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="5" r="1.75" />
            <circle cx="12" cy="12" r="1.75" />
            <circle cx="12" cy="19" r="1.75" />
          </svg>
        </button>

        {menuOpen && (
          <div className="folder-tile__menu" role="menu">
            <button
              type="button"
              className="folder-tile__menu-item"
              role="menuitem"
              onClick={(event) => {
                event.stopPropagation();
                closeMenu();
                onStartRename(folder);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              Edit
            </button>
            <button
              type="button"
              className="folder-tile__menu-item folder-tile__menu-item--danger"
              role="menuitem"
              onClick={(event) => {
                event.stopPropagation();
                closeMenu();
                onDelete(folder.id);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        className="folder-tile__body"
        onClick={() => onOpen(folder.id)}
        disabled={isRenaming}
        aria-label={`Open ${folder.name}`}
      >
        <span className="folder-tile__icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        </span>

        {isRenaming ? (
          <input
            ref={renameInputRef}
            type="text"
            className="folder-tile__rename-input"
            value={renameValue}
            onChange={(event) => onRenameChange(event.target.value)}
            onKeyDown={handleRenameKeyDown}
            onBlur={onRenameConfirm}
            onClick={(event) => event.stopPropagation()}
            aria-label="Rename folder"
          />
        ) : (
          <span className="folder-tile__name">{folder.name}</span>
        )}

        <span className="folder-tile__meta">
          {subfolderCount > 0 && `${subfolderCount} folder${subfolderCount !== 1 ? "s" : ""}`}
          {subfolderCount > 0 && templateCount > 0 && " · "}
          {templateCount > 0 && `${templateCount} template${templateCount !== 1 ? "s" : ""}`}
          {subfolderCount === 0 && templateCount === 0 && "Empty folder"}
        </span>
      </button>
    </div>
  );
}

function NewFolderTile({ folderName, onChange, onConfirm, onCancel }) {
  const inputRef = useRef(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onConfirm();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancelledRef.current = true;
      onCancel();
    }
  };

  const handleBlur = () => {
    if (cancelledRef.current) {
      cancelledRef.current = false;
      return;
    }
    onConfirm();
  };

  return (
    <div className="folder-tile folder-tile--creating">
      <div className="folder-tile__body folder-tile__body--static">
        <span className="folder-tile__icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        </span>

        <input
          ref={inputRef}
          type="text"
          className="folder-tile__rename-input"
          value={folderName}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          aria-label="New folder name"
        />

        <span className="folder-tile__meta">Empty folder</span>
      </div>
    </div>
  );
}

function FolderBrowserToolbar({
  folders,
  selectedFolderId,
  onNavigate,
  onAddFolder,
  canCreateFolder
}) {
  return (
    <div className="folder-browser__toolbar">
      <div className="folder-browser__nav-box">
        <FolderBreadcrumb
          folders={folders}
          selectedFolderId={selectedFolderId}
          onNavigate={onNavigate}
        />
      </div>

      <button
        type="button"
        className="btn btn--primary folder-browser__add-btn"
        onClick={onAddFolder}
        disabled={!canCreateFolder}
        title={
          canCreateFolder
            ? "Create a folder in the current location"
            : `Folders cannot be nested deeper than ${MAX_FOLDER_DEPTH} levels`
        }
      >
        Add folder
      </button>
    </div>
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
  onRenameFolder,
  onDeleteFolder,
  onCreateFolder,
  emptyStateMessage = "This folder is empty."
}) {
  const [renamingFolderId, setRenamingFolderId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState(DEFAULT_NEW_FOLDER_NAME);

  const parentDepth = getFolderDepth(selectedFolderId, folders);
  const canCreateFolder = parentDepth < MAX_FOLDER_DEPTH;

  useEffect(() => {
    setIsCreatingFolder(false);
    setNewFolderName(DEFAULT_NEW_FOLDER_NAME);
  }, [selectedFolderId]);

  const childFolders = folders.filter(f => sameId(f.parentId, selectedFolderId));
  const templatesInFolder = userTemplates.filter(t => sameId(t.folderId, selectedFolderId));
  const currentFolder = selectedFolderId ? folders.find(f => sameId(f.id, selectedFolderId)) : null;

  const getCounts = (folderId) => ({
    templates: userTemplates.filter(t => sameId(t.folderId, folderId)).length,
    subfolders: folders.filter(f => sameId(f.parentId, folderId)).length
  });

  const isEmpty = childFolders.length === 0 && templatesInFolder.length === 0 && !isCreatingFolder;

  const handleStartRename = (folder) => {
    setRenamingFolderId(folder.id);
    setRenameValue(folder.name);
  };

  const handleCancelRename = () => {
    setRenamingFolderId(null);
    setRenameValue("");
  };

  const handleConfirmRename = () => {
    const trimmed = renameValue.trim();
    if (trimmed && renamingFolderId && onRenameFolder) {
      onRenameFolder(renamingFolderId, trimmed);
    }
    handleCancelRename();
  };

  const handleStartCreateFolder = () => {
    handleCancelRename();
    setIsCreatingFolder(true);
    setNewFolderName(DEFAULT_NEW_FOLDER_NAME);
  };

  const handleCancelCreateFolder = () => {
    setIsCreatingFolder(false);
    setNewFolderName(DEFAULT_NEW_FOLDER_NAME);
  };

  const handleConfirmCreateFolder = () => {
    const trimmed = newFolderName.trim() || DEFAULT_NEW_FOLDER_NAME;
    if (onCreateFolder) {
      onCreateFolder(trimmed, selectedFolderId);
    }
    handleCancelCreateFolder();
  };

  return (
    <div className="folder-browser">
      <FolderBrowserToolbar
        folders={folders}
        selectedFolderId={selectedFolderId}
        onNavigate={onNavigate}
        onAddFolder={handleStartCreateFolder}
        canCreateFolder={canCreateFolder && !isCreatingFolder}
      />

      {currentFolder && (
        <h3 className="folder-browser__heading">{currentFolder.name}</h3>
      )}

      {(isCreatingFolder || childFolders.length > 0) && (
        <div className="folder-browser__folders">
          {isCreatingFolder && (
            <NewFolderTile
              folderName={newFolderName}
              onChange={setNewFolderName}
              onConfirm={handleConfirmCreateFolder}
              onCancel={handleCancelCreateFolder}
            />
          )}
          {childFolders.map(folder => {
            const { templates, subfolders } = getCounts(folder.id);
            return (
              <FolderTile
                key={folder.id}
                folder={folder}
                templateCount={templates}
                subfolderCount={subfolders}
                onOpen={onNavigate}
                onStartRename={handleStartRename}
                onDelete={onDeleteFolder}
                isRenaming={sameId(renamingFolderId, folder.id)}
                renameValue={renameValue}
                onRenameChange={setRenameValue}
                onRenameConfirm={handleConfirmRename}
                onRenameCancel={handleCancelRename}
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
