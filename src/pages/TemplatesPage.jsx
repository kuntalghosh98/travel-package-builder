/**
 * TemplatesPage Component (React)
 * Main page for browsing and managing templates
 * Supports folder hierarchy for organizing user templates
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TemplateGrid } from '../components/TemplateGrid.jsx';
import { TemplatePreview } from '../components/TemplatePreview.jsx';
import { templateService } from '../services/templateService.js';
import { sameId } from '../utils/helpers.js';

export function TemplatesPage({ onNavigateToBuilder }) {
  const [defaultTemplates, setDefaultTemplates] = useState([]);
  const [userTemplates, setUserTemplates] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [expandedFolderIds, setExpandedFolderIds] = useState([]);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderForm, setFolderForm] = useState({
    name: '',
    parentId: null
  });
  const [folderFormMode, setFolderFormMode] = useState('create'); // 'create' or 'rename'
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [folderError, setFolderError] = useState('');

  // Load templates and folders on mount
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [defaults, users, folderList] = await Promise.all([
        templateService.getDefaultTemplates(),
        templateService.getUserTemplates(),
        templateService.getAllFolders()
      ]);
      setDefaultTemplates(defaults);
      setUserTemplates(users);
      setFolders(folderList);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      const [defaults, users] = await Promise.all([
        templateService.getDefaultTemplates(),
        templateService.getUserTemplates()
      ]);
      setDefaultTemplates(defaults);
      setUserTemplates(users);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const loadFolders = async () => {
    try {
      const folderList = await templateService.getAllFolders();
      setFolders(folderList);
    } catch (error) {
      console.error('Failed to load folders:', error);
    }
  };

  const handleUseTemplate = (templateId) => {
    const template = [...defaultTemplates, ...userTemplates].find(t => t.id === templateId);
    if (template && onNavigateToBuilder) {
      onNavigateToBuilder(template);
    }
    setPreviewTemplate(null);
  };

  const handlePreviewTemplate = (template) => {
    setPreviewTemplate(template);
  };

  const handleEditTemplate = (template) => {
    // For now, just close preview - edit functionality can be added later
    setPreviewTemplate(null);
    console.log('Edit template:', template);
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    try {
      await templateService.deleteTemplate(templateId);
      setUserTemplates(prev => prev.filter(t => t.id !== templateId));
      setPreviewTemplate(null);
    } catch (error) {
      console.error('Failed to delete template:', error);
      alert('Failed to delete template: ' + error.message);
    }
  };

  // Folder handlers
  const handleSelectFolder = useCallback((folderId) => {
    setSelectedFolderId(folderId);
    if (folderId) {
      setExpandedFolderIds(prev => {
        const next = new Set(prev);
        let currentId = folderId;
        while (currentId) {
          next.add(currentId);
          const folder = folders.find(f => sameId(f.id, currentId));
          currentId = folder?.parentId || null;
        }
        return [...next];
      });
    }
  }, [folders]);

  const handleToggleFolderExpand = useCallback((folderId) => {
    setExpandedFolderIds(prev =>
      prev.some(id => sameId(id, folderId))
        ? prev.filter(id => !sameId(id, folderId))
        : [...prev, folderId]
    );
  }, []);

  const handleCreateFolder = async (name, parentId = null) => {
    if (!name || !name.trim()) return;
    
    try {
      setFolderError('');
      await templateService.createFolder({ name: name.trim(), parentId });
      await loadFolders();
    } catch (error) {
      console.error('Failed to create folder:', error);
      setFolderError('Failed to create folder: ' + error.message);
    }
  };

  const handleRenameFolder = async (folderId, newName) => {
    if (!newName || !newName.trim()) return;
    
    try {
      setFolderError('');
      await templateService.updateFolder(folderId, { name: newName.trim() });
      await loadFolders();
    } catch (error) {
      console.error('Failed to rename folder:', error);
      setFolderError('Failed to rename folder: ' + error.message);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!confirm('Are you sure you want to delete this folder? Templates in this folder will be moved to the parent folder.')) return;

    const deletedFolder = folders.find(f => sameId(f.id, folderId));

    try {
      setFolderError('');
      await templateService.deleteFolder(folderId);
      if (sameId(selectedFolderId, folderId)) {
        setSelectedFolderId(deletedFolder?.parentId ?? null);
      }
      await loadAll();
    } catch (error) {
      console.error('Failed to delete folder:', error);
      setFolderError('Failed to delete folder: ' + error.message);
    }
  };

  const handleFolderFormSubmit = async (e) => {
    e.preventDefault();
    setFolderError('');

    if (!folderForm.name.trim()) {
      setFolderError('Folder name is required');
      return;
    }

    try {
      if (folderFormMode === 'create') {
        await templateService.createFolder({ 
          name: folderForm.name.trim(), 
          parentId: folderForm.parentId 
        });
      } else if (folderFormMode === 'rename' && editingFolderId) {
        await templateService.updateFolder(editingFolderId, { name: folderForm.name.trim() });
      }
      
      await loadFolders();
      setShowFolderModal(false);
      setFolderForm({ name: '', parentId: null });
      setFolderFormMode('create');
      setEditingFolderId(null);
    } catch (error) {
      console.error('Failed to save folder:', error);
      setFolderError('Failed to save folder: ' + error.message);
    }
  };

  const openCreateFolderModal = (parentId = null) => {
    setFolderForm({ name: '', parentId });
    setFolderFormMode('create');
    setEditingFolderId(null);
    setFolderError('');
    setShowFolderModal(true);
  };

  const openRenameFolderModal = (folder) => {
    setFolderForm({ name: folder.name, parentId: folder.parentId });
    setFolderFormMode('rename');
    setEditingFolderId(folder.id);
    setFolderError('');
    setShowFolderModal(true);
  };

  const handleFolderFormChange = (e) => {
    const { name, value } = e.target;
    setFolderForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="templates-page">
      <header className="templates-page__header">
        <div className="templates-page__title-section">
          <h1 className="templates-page__title">Templates</h1>
          <p className="templates-page__subtitle">Browse and manage your travel package templates</p>
        </div>
      </header>

      {folderError && (
        <div className="alert alert--error templates-page__folder-error">{folderError}</div>
      )}
      
      {/* Template Grid */}
      <div className="templates-page__grid" id="templates-grid">
        <TemplateGrid
          defaultTemplates={defaultTemplates}
          userTemplates={userTemplates}
          folders={folders}
          selectedFolderId={selectedFolderId}
          expandedFolderIds={expandedFolderIds}
          onUseTemplate={handleUseTemplate}
          onEditTemplate={handleEditTemplate}
          onDeleteTemplate={handleDeleteTemplate}
          onPreviewTemplate={handlePreviewTemplate}
          onSelectFolder={handleSelectFolder}
          onToggleFolderExpand={handleToggleFolderExpand}
          onCreateFolder={handleCreateFolder}
          onRenameFolder={handleRenameFolder}
          onDeleteFolder={handleDeleteFolder}
        />
      </div>
      
      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreview
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUse={handleUseTemplate}
        />
      )}
      
      {/* Folder Modal (Create/Rename) */}
      {showFolderModal && (
        <div className="modal modal--folder is-open" role="dialog" aria-modal="true" aria-labelledby="folder-modal-title" onClick={(e) => e.target === e.currentTarget && setShowFolderModal(false)}>
          <div className="modal__overlay" onClick={() => setShowFolderModal(false)}></div>
          <div className="modal__content modal__content--sm">
            <header className="modal__header">
              <h2 id="folder-modal-title" className="modal__title">
                {folderFormMode === 'create' ? 'Create Folder' : 'Rename Folder'}
              </h2>
              <button className="modal__close" onClick={() => setShowFolderModal(false)} aria-label="Close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </header>
            <form onSubmit={handleFolderFormSubmit}>
              <div className="modal__body">
                {folderError && <div className="alert alert--error">{folderError}</div>}
                
                <div className="form-group">
                  <label htmlFor="folder-name">Folder Name *</label>
                  <input
                    type="text"
                    id="folder-name"
                    name="name"
                    value={folderForm.name}
                    onChange={handleFolderFormChange}
                    placeholder="e.g., Europe Trips"
                    required
                    autoFocus
                  />
                </div>
                
                {folderFormMode === 'create' && (
                  <div className="form-group">
                    <label htmlFor="folder-parent">Parent Folder</label>
                    <select
                      id="folder-parent"
                      name="parentId"
                      value={folderForm.parentId || ''}
                      onChange={handleFolderFormChange}
                    >
                      <option value="">Root (no parent)</option>
                      {folders.map(folder => (
                        <option key={folder.id} value={folder.id}>
                          {folder.name}
                        </option>
                      ))}
                    </select>
                    <small className="form-hint">Leave empty for root level folder</small>
                  </div>
                )}
              </div>
              <footer className="modal__footer">
                <button type="button" className="btn btn--secondary" onClick={() => setShowFolderModal(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary">
                  {folderFormMode === 'create' ? 'Create Folder' : 'Rename Folder'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}