/**
 * Template Service - Business logic for template operations
 * Uses the Node/MongoDB REST API as the data store
 */

import { apiService } from "./apiService.js";
import { defaultTemplates } from "../templates/registry.js";
import { deepClone, generateId, sameId } from "../utils/helpers.js";

/**
 * Get all templates (default + user-created)
 */
export async function getAllTemplates() {
  const userTemplates = await apiService.templates.getAll();
  return [...defaultTemplates, ...userTemplates];
}

/**
 * Get only default (system) templates
 */
export function getDefaultTemplates() {
  return [...defaultTemplates];
}

/**
 * Get only user-created templates
 */
export async function getUserTemplates() {
  return apiService.templates.getAll();
}

/**
 * Get a template by ID (checks both default and user templates)
 */
export async function getTemplateById(templateId) {
  const defaultTemplate = defaultTemplates.find(t => t.id === templateId);
  if (defaultTemplate) {
    return { ...defaultTemplate, isDefault: true };
  }

  const userTemplate = await apiService.templates.getById(templateId);
  if (userTemplate) {
    return { ...userTemplate, isDefault: false };
  }

  return null;
}

/**
 * Create a new user template
 */
export async function createTemplate(templateData) {
  const now = new Date().toISOString();
  const newTemplate = {
    ...templateData,
    id: templateData.id || generateId("template"),
    isDefault: false,
    isProtected: false,
    createdAt: now,
    updatedAt: now
  };

  return apiService.templates.create(newTemplate);
}

/**
 * Update an existing user template
 */
export async function updateTemplate(templateId, updates) {
  const defaultTemplate = defaultTemplates.find(t => t.id === templateId);
  if (defaultTemplate) {
    console.warn("Cannot update default template:", templateId);
    return null;
  }

  const existing = await apiService.templates.getById(templateId);
  if (!existing) {
    return null;
  }

  return apiService.templates.update(templateId, { ...updates, updatedAt: new Date().toISOString() });
}

/**
 * Delete a user template
 */
export async function deleteTemplate(templateId) {
  const defaultTemplate = defaultTemplates.find(t => t.id === templateId);
  if (defaultTemplate) {
    console.warn("Cannot delete default template:", templateId);
    return false;
  }

  const existing = await apiService.templates.getById(templateId);
  if (!existing) {
    return false;
  }

  await apiService.templates.delete(templateId);
  return true;
}

/**
 * Duplicate a template (creates a new user template from any template)
 */
export async function duplicateTemplate(templateId, newName) {
  const source = await getTemplateById(templateId);
  if (!source) {
    return null;
  }

  const { id, isDefault, createdAt, updatedAt, ...templateData } = source;

  return createTemplate({
    ...templateData,
    name: newName || `${source.name} (Copy)`,
    description: source.description
  });
}

/**
 * Save current package as a new template
 */
export async function saveAsTemplate(pkg, options = {}) {
  const templateData = {
    name: options.name || "Untitled Template",
    description: options.description || "",
    category: options.category || "custom",
    tags: options.tags || [],
    thumbnail: pkg.heroImage || "",
    folderId: options.folderId ?? null,
    structure: {
      company: pkg.company || "",
      consultant: pkg.consultant || "",
      phone: pkg.phone || "",
      website: pkg.website || "",
      destination: pkg.destination || "",
      title: pkg.title || "",
      subtitle: pkg.subtitle || "",
      heroImage: pkg.heroImage || "",
      route: pkg.route || [],
      inclusions: pkg.inclusions || [],
      exclusions: pkg.exclusions || [],
      hotels: (pkg.hotels || []).map(h => ({
        option: h.option,
        label: h.label,
        city1: h.city1,
        hotel1: h.hotel1,
        room1: h.room1,
        nights1: h.nights1,
        city2: h.city2,
        hotel2: h.hotel2,
        room2: h.room2,
        nights2: h.nights2,
        vehicle: h.vehicle
      })),
      itinerary: (pkg.itinerary || []).map(d => ({
        day: d.day,
        date: "",
        route: d.route,
        title: d.title,
        description: d.description,
        distance: d.distance,
        activities: d.activities || []
      })),
      notes: pkg.notes || [],
      validity: pkg.validity || ""
    }
  };

  return createTemplate(templateData);
}

/**
 * Apply a template to create a new package
 */
export async function applyTemplate(templateId, overrides = {}) {
  const template = await getTemplateById(templateId);
  if (!template) {
    return null;
  }

  const structure = template.structure || template.content || {};
  const newPackage = deepClone(structure);

  Object.assign(newPackage, overrides);

  if (!newPackage.startDate) {
    const today = new Date();
    newPackage.startDate = today.toISOString().split("T")[0];
  }
  if (!newPackage.endDate) {
    const end = new Date(newPackage.startDate);
    end.setDate(end.getDate() + (newPackage.nights || 3));
    newPackage.endDate = end.toISOString().split("T")[0];
  }

  return newPackage;
}

/**
 * Check if a template is a default (system) template
 */
export function isDefaultTemplate(templateId) {
  return defaultTemplates.some(t => t.id === templateId);
}

/**
 * Get template count statistics
 */
export async function getTemplateStats() {
  const userTemplates = await apiService.templates.getAll();
  return {
    default: defaultTemplates.length,
    user: userTemplates.length,
    total: defaultTemplates.length + userTemplates.length
  };
}

/**
 * Get all folders
 */
export async function getAllFolders() {
  return apiService.folders.getAll();
}

/**
 * Get a folder by ID
 */
export async function getFolderById(folderId) {
  return apiService.folders.getById(folderId);
}

export const MAX_FOLDER_DEPTH = 3;

function getFolderDepth(folderId, folders) {
  if (!folderId) return 0;
  let depth = 0;
  let currentId = folderId;
  while (currentId) {
    const folder = folders.find(f => sameId(f.id, currentId));
    if (!folder) break;
    depth++;
    currentId = folder.parentId;
  }
  return depth;
}

/**
 * Create a new folder
 */
export async function createFolder(folderData) {
  const allFolders = await apiService.folders.getAll();
  const parentId = folderData.parentId ?? null;
  const parentDepth = parentId ? getFolderDepth(parentId, allFolders) : 0;

  if (parentDepth >= MAX_FOLDER_DEPTH) {
    throw new Error(`Folders cannot be nested deeper than ${MAX_FOLDER_DEPTH} levels.`);
  }

  return apiService.folders.create({
    name: folderData.name,
    parentId
  });
}

/**
 * Update a folder
 */
export async function updateFolder(folderId, updates) {
  return apiService.folders.update(folderId, updates);
}

/**
 * Delete a folder and move its contents to the parent folder
 */
export async function deleteFolder(folderId, moveContentsToParent = true) {
  const folder = await apiService.folders.getById(folderId);
  if (!folder) {
    return false;
  }

  if (moveContentsToParent) {
    const parentId = folder.parentId || null;

    const templates = await apiService.templates.getByFolder(folderId);
    for (const template of templates) {
      await apiService.templates.moveToFolder(template.id, parentId);
    }

    const subfolders = await apiService.folders.getSubfolders(folderId);
    for (const subfolder of subfolders) {
      await apiService.folders.update(subfolder.id, { parentId });
    }
  }

  await apiService.folders.delete(folderId);
  return true;
}

/**
 * Get folder path (breadcrumb)
 */
export async function getFolderPath(folderId) {
  return apiService.folders.getFolderPath(folderId);
}

/**
 * Get subfolders of a folder
 */
export async function getSubfolders(folderId) {
  return apiService.folders.getSubfolders(folderId);
}

/**
 * Get templates in a specific folder
 */
export async function getTemplatesInFolder(folderId) {
  return apiService.templates.getByFolder(folderId);
}

/**
 * Move a template to a folder
 */
export async function moveTemplateToFolder(templateId, folderId) {
  if (isDefaultTemplate(templateId)) {
    console.warn("Cannot move default template:", templateId);
    return null;
  }

  const existing = await apiService.templates.getById(templateId);
  if (!existing) {
    return null;
  }

  return apiService.templates.moveToFolder(templateId, folderId);
}

/**
 * Move a folder to another parent folder
 */
export async function moveFolder(folderId, newParentId) {
  if (sameId(folderId, newParentId)) {
    return null;
  }

  const folders = await apiService.folders.getAll();
  let currentId = newParentId;
  while (currentId) {
    if (sameId(currentId, folderId)) {
      return null;
    }
    const current = folders.find(f => sameId(f.id, currentId));
    currentId = current ? current.parentId : null;
  }

  return updateFolder(folderId, { parentId: newParentId });
}

export const templateService = {
  getAllTemplates,
  getDefaultTemplates,
  getUserTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  duplicateTemplate,
  saveAsTemplate,
  applyTemplate,
  isDefaultTemplate,
  getTemplateStats,
  getAllFolders,
  getFolderById,
  createFolder,
  updateFolder,
  deleteFolder,
  getFolderPath,
  getSubfolders,
  getTemplatesInFolder,
  moveTemplateToFolder,
  moveFolder
};
