import { FolderBrowser } from './FolderBrowser.jsx';

export function MyTemplatesPanel({
  folders = [],
  userTemplates = [],
  selectedFolderId = null,
  onUseTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onPreviewTemplate,
  onSelectFolder,
  onRenameFolder,
  onDeleteFolder,
  onCreateFolder,
  emptyStateMessage = 'No templates yet. Save a package as a template from the Builder!'
}) {
  return (
    <div className="my-templates-browser">
      <FolderBrowser
        folders={folders}
        userTemplates={userTemplates}
        selectedFolderId={selectedFolderId}
        onNavigate={onSelectFolder}
        onUseTemplate={onUseTemplate}
        onEditTemplate={onEditTemplate}
        onDeleteTemplate={onDeleteTemplate}
        onPreviewTemplate={onPreviewTemplate}
        onRenameFolder={onRenameFolder}
        onDeleteFolder={onDeleteFolder}
        onCreateFolder={onCreateFolder}
        emptyStateMessage={emptyStateMessage}
      />
    </div>
  );
}
