import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyTemplatesPanel } from '../../components/MyTemplatesPanel.jsx';
import { TemplatePreview } from '../../components/TemplatePreview.jsx';
import { sameId } from '../../utils/helpers.js';
import { useToast } from '../../components/Toast.jsx';
import { useConfirm } from '../../components/ConfirmDialog.jsx';
import {
  useFolders,
  useUserTemplates,
  useDeleteTemplate,
  useCreateFolder,
  useUpdateFolder,
  useDeleteFolder
} from './hooks/useTemplateQueries.js';
import { useCreatePackageFromTemplate } from '../builder/hooks/usePackageQueries.js';

export function MyTemplatesPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { confirm, dialog: confirmDialog } = useConfirm();

  const { data: userTemplates = [], isLoading: templatesLoading } = useUserTemplates();
  const { data: folders = [], isLoading: foldersLoading } = useFolders();

  const deleteTemplate = useDeleteTemplate();
  const createFolder = useCreateFolder();
  const updateFolder = useUpdateFolder();
  const deleteFolder = useDeleteFolder();
  const createPackage = useCreatePackageFromTemplate();

  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const handleUseTemplate = async (templateId) => {
    try {
      const pkg = await createPackage.mutateAsync(templateId);
      setPreviewTemplate(null);
      navigate(`/builder/${pkg.id}`);
    } catch (error) {
      toast.error(`Failed to open template: ${error.message}`);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    const ok = await confirm({
      title: 'Delete template',
      message: 'Are you sure you want to delete this template? This action cannot be undone.',
      confirmLabel: 'Delete',
      danger: true
    });
    if (!ok) return;

    try {
      await deleteTemplate.mutateAsync(templateId);
      setPreviewTemplate(null);
    } catch (error) {
      toast.error(`Failed to delete template: ${error.message}`);
    }
  };

  const handleSelectFolder = useCallback((folderId) => {
    setSelectedFolderId(folderId);
  }, []);

  const handleRenameFolder = async (folderId, newName) => {
    if (!newName?.trim()) return;

    try {
      await updateFolder.mutateAsync({ folderId, updates: { name: newName.trim() } });
    } catch (error) {
      toast.error(`Failed to rename folder: ${error.message}`);
    }
  };

  const handleCreateFolder = async (name, parentId = null) => {
    if (!name?.trim()) return;

    try {
      await createFolder.mutateAsync({ name: name.trim(), parentId });
    } catch (error) {
      toast.error(`Failed to create folder: ${error.message}`);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    const ok = await confirm({
      title: 'Delete folder',
      message: 'Are you sure you want to delete this folder? Templates in this folder will be moved to the parent folder.',
      confirmLabel: 'Delete',
      danger: true
    });
    if (!ok) return;

    const deletedFolder = folders.find(f => sameId(f.id, folderId));
    try {
      await deleteFolder.mutateAsync(folderId);
      if (sameId(selectedFolderId, folderId)) {
        setSelectedFolderId(deletedFolder?.parentId ?? null);
      }
    } catch (error) {
      toast.error(`Failed to delete folder: ${error.message}`);
    }
  };

  if (templatesLoading || foldersLoading) {
    return <div className="app"><div className="loading">Loading templates...</div></div>;
  }

  return (
    <div className="templates-page">
      <header className="templates-page__header">
        <div className="templates-page__title-section">
          <h1 className="templates-page__title">My Templates</h1>
          <p className="templates-page__subtitle">Browse folders and open templates like a file explorer</p>
        </div>
      </header>

      <div className="templates-page__grid">
        <MyTemplatesPanel
          folders={folders}
          userTemplates={userTemplates}
          selectedFolderId={selectedFolderId}
          onUseTemplate={handleUseTemplate}
          onEditTemplate={template => { setPreviewTemplate(null); console.log('Edit template:', template); }}
          onDeleteTemplate={handleDeleteTemplate}
          onPreviewTemplate={setPreviewTemplate}
          onSelectFolder={handleSelectFolder}
          onRenameFolder={handleRenameFolder}
          onDeleteFolder={handleDeleteFolder}
          onCreateFolder={handleCreateFolder}
        />
      </div>

      {previewTemplate && (
        <TemplatePreview
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUse={handleUseTemplate}
        />
      )}
      {confirmDialog}
    </div>
  );
}
