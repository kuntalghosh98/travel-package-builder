import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { templateService } from '../../services/templateService.js';
import { packageService } from '../../services/packageService.js';
import { sameId } from '../../utils/helpers.js';
import { useToast } from '../../components/Toast.jsx';
import { useConfirm } from '../../components/ConfirmDialog.jsx';
import { packageToTemplateStructure } from '../../shared/lib/templateSchema.js';
import { usePackage, useSavePackage } from './hooks/usePackageQueries.js';
import { useFolders } from '../templates/hooks/useTemplateQueries.js';
import {
  SectionTitle,
  General,
  Cover,
  Journey,
  Hotels,
  Itinerary,
  Lists,
  Pricing,
  FinePrint
} from './components/BuilderSections.jsx';
import { Preview } from './components/BuilderPreview.jsx';
import { SaveAsTemplateModal } from './components/SaveAsTemplateModal.jsx';

function buildFolderSelectOptions(folders, parentId = null, depth = 0) {
  const options = [];
  folders
    .filter(f => sameId(f.parentId, parentId))
    .forEach(folder => {
      options.push({
        id: folder.id,
        label: `${'\u00A0\u00A0'.repeat(depth)}${folder.name}`
      });
      options.push(...buildFolderSelectOptions(folders, folder.id, depth + 1));
    });
  return options;
}

export function BuilderPage() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { confirm, dialog: confirmDialog } = useConfirm();
  const { data: pkg, isLoading, error: loadError } = usePackage(packageId);
  const savePackage = useSavePackage();
  const { data: folders = [] } = useFolders();

  const [localPkg, setLocalPkg] = useState(null);
  const [section, setSection] = useState('general');
  const [previewPage, setPreviewPage] = useState(1);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [showSaveAsTemplate, setShowSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateCategory, setTemplateCategory] = useState('custom');
  const [templateTags, setTemplateTags] = useState('');
  const [templateFolderId, setTemplateFolderId] = useState(null);
  const [isDefaultTemplate, setIsDefaultTemplate] = useState(false);

  const templateId = localPkg?.templateId;

  useEffect(() => {
    if (pkg) {
      setLocalPkg(pkg);
    }
  }, [pkg]);

  useEffect(() => {
    if (!templateId) return;
    templateService.getTemplateById(templateId).then(template => {
      setIsDefaultTemplate(template?.isDefault === true);
    });
  }, [templateId]);

  useEffect(() => {
    if (!localPkg?.id) return;
    const timer = setTimeout(async () => {
      try {
        await savePackage.mutateAsync(localPkg);
        setSaved(true);
        setTimeout(() => setSaved(false), 1600);
      } catch (err) {
        setError(err.message);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localPkg]);

  const update = (key, value) => setLocalPkg(p => ({ ...p, [key]: value }));

  const handleSave = async () => {
    if (!localPkg) return;
    try {
      await savePackage.mutateAsync(localPkg);
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateTemplate = async () => {
    if (!localPkg || !templateId || isDefaultTemplate) return;
    try {
      const updated = await templateService.updateTemplate(templateId, {
        name: localPkg.title || localPkg.destination || 'Untitled Template',
        description: localPkg.subtitle || '',
        category: localPkg.category || 'custom',
        tags: localPkg.tags || [],
        thumbnail: localPkg.heroImage || '',
        structure: packageToTemplateStructure(localPkg),
        content: packageToTemplateStructure(localPkg)
      });

      if (!updated) {
        setError('Failed to update template (may be a default template)');
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset = async () => {
    const ok = await confirm({
      title: 'Reset package',
      message: 'Reset the package to the template default? Unsaved changes will be lost.',
      confirmLabel: 'Reset',
      danger: true
    });
    if (!ok || !templateId) return;

    try {
      const newPkg = await packageService.createPackage(templateId);
      setLocalPkg(newPkg);
      navigate(`/builder/${newPkg.id}`, { replace: true });
      setPreviewPage(1);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePrint = () => {
    setPreviewPage(1);
    setTimeout(() => window.print(), 100);
  };

  const handleOpenSaveAsTemplate = async () => {
    if (templateId && !isDefaultTemplate) {
      const currentTemplate = await templateService.getTemplateById(templateId);
      setTemplateFolderId(currentTemplate?.folderId ?? null);
    } else {
      setTemplateFolderId(null);
    }
    setShowSaveAsTemplate(true);
  };

  const handleSaveAsTemplate = async () => {
    if (!localPkg || !templateName.trim()) return;
    try {
      await templateService.saveAsTemplate(localPkg, {
        name: templateName.trim(),
        description: templateDescription.trim(),
        category: templateCategory,
        tags: templateTags.split(',').map(t => t.trim()).filter(Boolean),
        folderId: templateFolderId
      });
      setShowSaveAsTemplate(false);
      setTemplateName('');
      setTemplateDescription('');
      setTemplateCategory('custom');
      setTemplateTags('');
      setTemplateFolderId(null);
      toast.success('Template saved successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const saveTemplateFolderOptions = useMemo(
    () => buildFolderSelectOptions(folders),
    [folders]
  );

  if (isLoading || !localPkg) {
    return <div className="app"><div className="loading">Loading package...</div></div>;
  }

  if (loadError) {
    return <div className="app"><div className="loading">{loadError.message}</div></div>;
  }

  return (
    <div className="app">
      <header className="topbar builder-toolbar">
        <div className="builder-toolbar__start">
          <button className="topbar__back" onClick={() => navigate('/templates')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Templates
          </button>
          <div className="builder-toolbar__meta">
            <strong>{localPkg.title || localPkg.destination || 'Untitled package'}</strong>
            <small>{localPkg.company}</small>
          </div>
        </div>
        <div className="topActions">
          {saved && <span className="saved">Saved</span>}
          {error && <span className="error">{error}</span>}
          <button className="ghost" onClick={handleReset}>Reset</button>
          {!templateId && (
            <button className="ghost" onClick={handleSave} disabled={savePackage.isPending}>
              {savePackage.isPending ? 'Saving...' : 'Save'}
            </button>
          )}
          {templateId && !isDefaultTemplate && (
            <button className="ghost" onClick={handleUpdateTemplate} disabled={savePackage.isPending}>
              {savePackage.isPending ? 'Updating...' : 'Update'}
            </button>
          )}
          <button className="ghost" onClick={handleOpenSaveAsTemplate}>Save as Template</button>
          <button className="primary" onClick={handlePrint}>Export PDF</button>
        </div>
      </header>

      <main className="workspace">
        <aside className="sidebar">
          <div className="sideTitle">PACKAGE</div>
          {[
            ['general', 'General'], ['cover', 'Cover'], ['journey', 'Journey'], ['hotels', 'Hotels'],
            ['itinerary', 'Itinerary'], ['inclusions', 'Inclusions'], ['pricing', 'Pricing'], ['fineprint', 'Fine print']
          ].map(([id, name]) => (
            <button key={id} className={section === id ? 'nav active' : 'nav'} onClick={() => setSection(id)}>
              <span className="dot"></span>{name}
            </button>
          ))}
          <div className="sideTitle design">DESIGN</div>
          <button className="nav" onClick={() => toast.info('Template system is prepared for the next iteration.')}><span className="dot"></span>Templates</button>
          <button className="nav" onClick={() => toast.info('Brand settings are prepared for the next iteration.')}><span className="dot"></span>Brand settings</button>
          <div className="sideBottom"><small>Autosave enabled</small><small>Synced to cloud</small></div>
        </aside>

        <section className="editor">
          <div className="editorHead">
            <div>
              <h1>{SectionTitle({ section })}</h1>
              <p>Edit structured content; the client preview updates instantly.</p>
            </div>
          </div>
          {section === 'general' && <General pkg={localPkg} update={update} />}
          {section === 'cover' && <Cover pkg={localPkg} update={update} />}
          {section === 'journey' && <Journey pkg={localPkg} update={update} />}
          {section === 'hotels' && <Hotels pkg={localPkg} setPkg={setLocalPkg} />}
          {section === 'itinerary' && <Itinerary pkg={localPkg} setPkg={setLocalPkg} />}
          {section === 'inclusions' && <Lists pkg={localPkg} setPkg={setLocalPkg} />}
          {section === 'pricing' && <Pricing pkg={localPkg} update={update} />}
          {section === 'fineprint' && <FinePrint pkg={localPkg} setPkg={setLocalPkg} />}
        </section>

        <section className="previewPane">
          <div className="previewToolbar">
            <span>LIVE PREVIEW</span>
            <div className="pageNav">
              <button onClick={() => setPreviewPage(Math.max(1, previewPage - 1))}>‹</button>
              <b>{previewPage}</b>
              <span>/ 5</span>
              <button onClick={() => setPreviewPage(Math.min(5, previewPage + 1))}>›</button>
            </div>
          </div>
          <div className="screenPreview">
            <Preview pkg={localPkg} page={previewPage} />
          </div>
          <div className="printPreview">
            {[1, 2, 3, 4, 5].map(page => (
              <Preview key={page} pkg={localPkg} page={page} />
            ))}
          </div>
        </section>
      </main>

      {showSaveAsTemplate && (
        <SaveAsTemplateModal
          templateName={templateName}
          templateDescription={templateDescription}
          templateCategory={templateCategory}
          templateTags={templateTags}
          templateFolderId={templateFolderId}
          folderOptions={saveTemplateFolderOptions}
          onClose={() => setShowSaveAsTemplate(false)}
          onChange={{
            setTemplateName,
            setTemplateDescription,
            setTemplateCategory,
            setTemplateTags,
            setTemplateFolderId
          }}
          onSave={handleSaveAsTemplate}
        />
      )}
      {confirmDialog}
    </div>
  );
}
