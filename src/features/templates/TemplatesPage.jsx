import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TemplateGrid } from '../../components/TemplateGrid.jsx';
import { TemplatePreview } from '../../components/TemplatePreview.jsx';
import { useToast } from '../../components/Toast.jsx';
import { useConfirm } from '../../components/ConfirmDialog.jsx';
import {
  useDefaultTemplates,
  useDeleteTemplate
} from './hooks/useTemplateQueries.js';
import { useCreatePackageFromTemplate } from '../builder/hooks/usePackageQueries.js';

export function TemplatesPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { confirm, dialog: confirmDialog } = useConfirm();

  const defaultTemplates = useDefaultTemplates();
  const deleteTemplate = useDeleteTemplate();
  const createPackage = useCreatePackageFromTemplate();

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

  return (
    <div className="templates-page">
      <header className="templates-page__header">
        <div className="templates-page__title-section">
          <h1 className="templates-page__title">Templates</h1>
          <p className="templates-page__subtitle">Browse and manage your travel package templates</p>
        </div>
      </header>

      <div className="templates-page__grid" id="templates-grid">
        <TemplateGrid
          defaultTemplates={defaultTemplates}
          onUseTemplate={handleUseTemplate}
          onEditTemplate={template => { setPreviewTemplate(null); console.log('Edit template:', template); }}
          onDeleteTemplate={handleDeleteTemplate}
          onPreviewTemplate={setPreviewTemplate}
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
