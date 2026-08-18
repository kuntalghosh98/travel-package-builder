import { useState, useRef, useEffect } from "react";
import { sameId } from "../utils/helpers.js";

export const MAX_FOLDER_DEPTH = 3;

function CreateFolderInput({
  inputRef,
  value,
  onChange,
  onConfirm,
  onCancel,
  onKeyDown,
  level
}) {
  return (
    <div className="folder-tree__item folder-tree__item--creating" style={{ "--level": level }}>
      <div className="folder-tree__node folder-tree__node--creating">
        <span className="folder-tree__indent" aria-hidden="true" />
        <span className="folder-tree__icon folder-tree__icon--creating">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
        <input
          ref={inputRef}
          type="text"
          className="folder-tree__create-input"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={onConfirm}
          placeholder="New folder name"
          aria-label="New folder name"
          autoFocus
        />
        <button
          type="button"
          className="folder-tree__create-btn folder-tree__create-btn--confirm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onConfirm}
          aria-label="Create folder"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
        <button
          type="button"
          className="folder-tree__create-btn folder-tree__create-btn--cancel"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onCancel}
          aria-label="Cancel"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function FolderActions({ folder, canCreateSubfolder, onCreateSubfolder, onRenameFolder, onDeleteFolder }) {
  return (
    <div className="folder-tree__actions">
      <button
        type="button"
        className="folder-tree__action-btn"
        onClick={(e) => {
          e.stopPropagation();
          onRenameFolder?.(folder);
        }}
        aria-label={`Rename ${folder.name}`}
        title="Rename folder"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </button>
      {canCreateSubfolder && (
        <button
          type="button"
          className="folder-tree__action-btn"
          onClick={(e) => {
            e.stopPropagation();
            onCreateSubfolder(folder.id);
          }}
          aria-label={`Create subfolder in ${folder.name}`}
          title="Create subfolder"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      )}
      <button
        type="button"
        className="folder-tree__action-btn folder-tree__action-btn--danger"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteFolder?.(folder.id);
        }}
        aria-label={`Delete ${folder.name}`}
        title="Delete folder"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </button>
    </div>
  );
}

/**
 * FolderTree - Hierarchical folder navigation component
 */
export function FolderTree({
  folders,
  selectedFolderId,
  expandedFolderIds,
  onSelectFolder,
  onToggleExpand,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  parentId = null,
  level = 0
}) {
  const childFolders = folders.filter(f => sameId(f.parentId, parentId));

  const [creatingUnderId, setCreatingUnderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [renamingFolderId, setRenamingFolderId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const inputRef = useRef(null);
  const renameInputRef = useRef(null);

  const canCreateSubfolder = level < MAX_FOLDER_DEPTH - 1;

  useEffect(() => {
    if (creatingUnderId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [creatingUnderId]);

  useEffect(() => {
    if (renamingFolderId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingFolderId]);

  const handleCreateSubfolder = (parentFolderId) => {
    setRenamingFolderId(null);
    if (!expandedFolderIds.includes(parentFolderId)) {
      onToggleExpand?.(parentFolderId);
    }
    setCreatingUnderId(parentFolderId);
    setNewFolderName("");
  };

  const handleConfirmCreate = (targetParentId) => {
    if (newFolderName.trim() && onCreateFolder) {
      onCreateFolder(newFolderName.trim(), targetParentId);
    }
    setCreatingUnderId(null);
    setNewFolderName("");
  };

  const handleCancelCreate = () => {
    setCreatingUnderId(null);
    setNewFolderName("");
  };

  const handleStartRename = (folder) => {
    setCreatingUnderId(null);
    setRenamingFolderId(folder.id);
    setRenameValue(folder.name);
  };

  const handleConfirmRename = (folderId) => {
    const trimmed = renameValue.trim();
    if (trimmed && onRenameFolder) {
      onRenameFolder(folderId, trimmed);
    }
    setRenamingFolderId(null);
    setRenameValue("");
  };

  const handleCancelRename = () => {
    setRenamingFolderId(null);
    setRenameValue("");
  };

  const handleOpenFolder = (folderId) => {
    onSelectFolder?.(folderId);
    if (folderId && !expandedFolderIds.some(id => sameId(id, folderId))) {
      onToggleExpand?.(folderId);
    }
  };

  const handleKeyDown = (e, folder) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        handleOpenFolder(folder.id);
        break;
      case "ArrowRight":
        e.preventDefault();
        if (!expandedFolderIds.some(id => sameId(id, folder.id))) {
          onToggleExpand?.(folder.id);
        }
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (expandedFolderIds.some(id => sameId(id, folder.id))) {
          onToggleExpand?.(folder.id);
        } else if (folder.parentId !== null) {
          onSelectFolder?.(folder.parentId);
        }
        break;
      case "Escape":
        if (creatingUnderId) {
          handleCancelCreate();
        } else if (renamingFolderId) {
          handleCancelRename();
        }
        break;
      default:
        break;
    }
  };

  const handleInputKeyDown = (e, targetParentId) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirmCreate(targetParentId);
    } else if (e.key === "Escape") {
      handleCancelCreate();
    }
  };

  const handleRenameKeyDown = (e, folderId) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirmRename(folderId);
    } else if (e.key === "Escape") {
      handleCancelRename();
    }
  };

  if (childFolders.length === 0 && !creatingUnderId) {
    return null;
  }

  return (
    <ul className="folder-tree" role="tree" aria-label="Template folders">
      {childFolders.map(folder => {
        const isExpanded = expandedFolderIds.some(id => sameId(id, folder.id));
        const isSelected = sameId(selectedFolderId, folder.id);
        const hasChildren = folders.some(f => sameId(f.parentId, folder.id));
        const isRenaming = renamingFolderId === folder.id;
        const isCreatingHere = creatingUnderId === folder.id;

        return (
          <li key={folder.id} className="folder-tree__item">
            <div
              className={`folder-tree__node ${isSelected ? "folder-tree__node--selected" : ""}`}
              style={{ "--level": level }}
              onClick={(e) => {
                if (isRenaming) return;
                e.stopPropagation();
                handleOpenFolder(folder.id);
              }}
              onKeyDown={(e) => handleKeyDown(e, folder)}
              role="treeitem"
              aria-selected={isSelected}
              aria-expanded={hasChildren || isCreatingHere ? isExpanded : undefined}
              tabIndex={0}
            >
              <span className="folder-tree__indent" aria-hidden="true" />

              {hasChildren || isCreatingHere ? (
                <button
                  type="button"
                  className={`folder-tree__expand ${isExpanded ? "folder-tree__expand--open" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpand?.(folder.id);
                  }}
                  aria-label={isExpanded ? `Collapse ${folder.name}` : `Expand ${folder.name}`}
                  aria-expanded={isExpanded}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                </button>
              ) : (
                <span className="folder-tree__expand folder-tree__expand--spacer" aria-hidden="true" />
              )}

              <span className={`folder-tree__icon ${isExpanded ? "folder-tree__icon--open" : ""} ${isSelected ? "folder-tree__icon--selected" : ""}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </span>

              {isRenaming ? (
                <input
                  ref={renameInputRef}
                  type="text"
                  className="folder-tree__create-input folder-tree__rename-input"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => handleRenameKeyDown(e, folder.id)}
                  onBlur={() => handleConfirmRename(folder.id)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Rename folder"
                />
              ) : (
                <span className="folder-tree__name">{folder.name}</span>
              )}

              {!isRenaming && (
                <FolderActions
                  folder={folder}
                  canCreateSubfolder={canCreateSubfolder}
                  onCreateSubfolder={handleCreateSubfolder}
                  onRenameFolder={handleStartRename}
                  onDeleteFolder={onDeleteFolder}
                />
              )}
            </div>

            {(isExpanded || isCreatingHere) && (
              <>
                {isCreatingHere && (
                  <CreateFolderInput
                    inputRef={inputRef}
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onConfirm={() => handleConfirmCreate(folder.id)}
                    onCancel={handleCancelCreate}
                    onKeyDown={(e) => handleInputKeyDown(e, folder.id)}
                    level={level + 1}
                  />
                )}
                <FolderTree
                  folders={folders}
                  selectedFolderId={selectedFolderId}
                  expandedFolderIds={expandedFolderIds}
                  onSelectFolder={onSelectFolder}
                  onToggleExpand={onToggleExpand}
                  onCreateFolder={onCreateFolder}
                  onRenameFolder={onRenameFolder}
                  onDeleteFolder={onDeleteFolder}
                  parentId={folder.id}
                  level={level + 1}
                />
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * FolderTreeRoot - Root-level folder navigation (all templates + folder tree)
 */
export function FolderTreeRoot({
  folders,
  selectedFolderId,
  expandedFolderIds,
  onSelectFolder,
  onToggleExpand,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder
}) {
  const [creatingRootFolder, setCreatingRootFolder] = useState(false);
  const [newRootFolderName, setNewRootFolderName] = useState("");
  const rootInputRef = useRef(null);

  useEffect(() => {
    if (creatingRootFolder && rootInputRef.current) {
      rootInputRef.current.focus();
    }
  }, [creatingRootFolder]);

  const handleCreateRootFolder = () => {
    setCreatingRootFolder(true);
    setNewRootFolderName("");
  };

  const handleConfirmRootCreate = () => {
    if (newRootFolderName.trim() && onCreateFolder) {
      onCreateFolder(newRootFolderName.trim(), null);
    }
    setCreatingRootFolder(false);
    setNewRootFolderName("");
  };

  const handleCancelRootCreate = () => {
    setCreatingRootFolder(false);
    setNewRootFolderName("");
  };

  const handleRootInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirmRootCreate();
    } else if (e.key === "Escape") {
      handleCancelRootCreate();
    }
  };

  return (
    <div className="folder-tree-root">
      <div
        className={`folder-tree__root-node ${selectedFolderId === null ? "folder-tree__node--selected" : ""}`}
        onClick={() => onSelectFolder?.(null)}
        role="treeitem"
        aria-selected={selectedFolderId === null}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectFolder?.(null);
          }
        }}
      >
        <span className="folder-tree__icon folder-tree__icon--root">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </span>
        <span className="folder-tree__name">All templates</span>

        <button
          type="button"
          className="folder-tree__action-btn folder-tree__action-btn--root"
          onClick={(e) => {
            e.stopPropagation();
            handleCreateRootFolder();
          }}
          aria-label="Create new folder at root level"
          title="Create new folder"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {creatingRootFolder && (
        <CreateFolderInput
          inputRef={rootInputRef}
          value={newRootFolderName}
          onChange={(e) => setNewRootFolderName(e.target.value)}
          onConfirm={handleConfirmRootCreate}
          onCancel={handleCancelRootCreate}
          onKeyDown={handleRootInputKeyDown}
          level={0}
        />
      )}

      <FolderTree
        folders={folders}
        selectedFolderId={selectedFolderId}
        expandedFolderIds={expandedFolderIds}
        onSelectFolder={onSelectFolder}
        onToggleExpand={onToggleExpand}
        onCreateFolder={onCreateFolder}
        onRenameFolder={onRenameFolder}
        onDeleteFolder={onDeleteFolder}
        parentId={null}
        level={0}
      />
    </div>
  );
}
