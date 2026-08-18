/**
 * API Service - REST client for json-server mock backend
 * Provides CRUD operations for folders and templates
 * Uses fetch API to communicate with the mock backend
 */

import { sameId } from '../utils/helpers.js';

const API_BASE = '/api';

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error (${response.status}): ${errorText || response.statusText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/**
 * Folders API
 */
export const foldersApi = {
  /**
   * Get all folders
   * @returns {Promise<Object[]>} Array of all folders
   */
  async getAll() {
    return apiFetch('/folders');
  },

  /**
   * Get a folder by ID
   * @param {string} folderId - The folder ID
   * @returns {Promise<Object|null>} The folder or null
   */
  async getById(folderId) {
    try {
      return await apiFetch(`/folders/${folderId}`);
    } catch (error) {
      if (error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Create a new folder
   * @param {Object} folderData - Folder data (name, parentId)
   * @returns {Promise<Object>} The created folder
   */
  async create(folderData) {
    const now = new Date().toISOString();
    return apiFetch('/folders', {
      method: 'POST',
      body: {
        ...folderData,
        createdAt: now,
        updatedAt: now
      }
    });
  },

  /**
   * Update a folder
   * @param {string} folderId - The folder ID to update
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} The updated folder
   */
  async update(folderId, updates) {
    const existing = await this.getById(folderId);
    if (!existing) {
      throw new Error(`Folder not found: ${folderId}`);
    }

    const now = new Date().toISOString();
    return apiFetch(`/folders/${folderId}`, {
      method: 'PUT',
      body: {
        ...existing,
        ...updates,
        id: folderId,
        updatedAt: now
      }
    });
  },

  /**
   * Delete a folder
   * @param {string} folderId - The folder ID to delete
   * @returns {Promise<boolean>} True if deleted
   */
  async delete(folderId) {
    await apiFetch(`/folders/${folderId}`, {
      method: 'DELETE'
    });
    return true;
  },

  /**
   * Get subfolders of a folder
   * @param {string|null} parentId - Parent folder ID (null for root)
   * @returns {Promise<Object[]>} Array of subfolders
   */
  async getSubfolders(parentId = null) {
    const all = await this.getAll();
    return all.filter(f => sameId(f.parentId, parentId));
  },

  /**
   * Get folder path (breadcrumb) for a folder
   * @param {string} folderId - The folder ID
   * @returns {Promise<Object[]>} Array of folders from root to target
   */
  async getFolderPath(folderId) {
    const all = await this.getAll();
    const path = [];
    let currentId = folderId;

    while (currentId) {
      const folder = all.find(f => sameId(f.id, currentId));
      if (!folder) break;
      path.unshift(folder);
      currentId = folder.parentId || null;
    }

    return path;
  }
};

/**
 * Templates API
 */
export const templatesApi = {
  /**
   * Get all user templates
   * @returns {Promise<Object[]>} Array of all user templates
   */
  async getAll() {
    return apiFetch('/templates');
  },

  /**
   * Get a template by ID
   * @param {string} templateId - The template ID
   * @returns {Promise<Object|null>} The template or null
   */
  async getById(templateId) {
    try {
      return await apiFetch(`/templates/${templateId}`);
    } catch (error) {
      if (error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Create a new template
   * @param {Object} templateData - Template data
   * @returns {Promise<Object>} The created template
   */
  async create(templateData) {
    const now = new Date().toISOString();
    return apiFetch('/templates', {
      method: 'POST',
      body: {
        ...templateData,
        isDefault: false,
        isProtected: false,
        createdAt: now,
        updatedAt: now
      }
    });
  },

  /**
   * Update a template
   * @param {string} templateId - The template ID to update
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} The updated template
   */
  async update(templateId, updates) {
    const existing = await this.getById(templateId);
    if (!existing) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const now = new Date().toISOString();
    return apiFetch(`/templates/${templateId}`, {
      method: 'PUT',
      body: {
        ...existing,
        ...updates,
        id: templateId,
        updatedAt: now
      }
    });
  },

  /**
   * Delete a template
   * @param {string} templateId - The template ID to delete
   * @returns {Promise<boolean>} True if deleted
   */
  async delete(templateId) {
    await apiFetch(`/templates/${templateId}`, {
      method: 'DELETE'
    });
    return true;
  },

  /**
   * Get templates in a specific folder
   * @param {string|null} folderId - The folder ID (null for root)
   * @returns {Promise<Object[]>} Array of templates in the folder
   */
  async getByFolder(folderId = null) {
    const all = await this.getAll();
    return all.filter(t => sameId(t.folderId, folderId));
  },

  /**
   * Move a template to a folder
   * @param {string} templateId - The template ID
   * @param {string|null} folderId - The target folder ID
   * @returns {Promise<Object>} The updated template
   */
  async moveToFolder(templateId, folderId) {
    return this.update(templateId, { folderId });
  }
};

/**
 * Packages API
 */
export const packagesApi = {
  /**
   * Get all packages
   * @returns {Promise<Object[]>} Array of all packages
   */
  async getAll() {
    return apiFetch('/packages');
  },

  /**
   * Get a package by ID
   * @param {string} packageId - The package ID
   * @returns {Promise<Object|null>} The package or null
   */
  async getById(packageId) {
    try {
      return await apiFetch(`/packages/${packageId}`);
    } catch (error) {
      if (error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Create a new package
   * @param {Object} packageData - Package data
   * @returns {Promise<Object>} The created package
   */
  async create(packageData) {
    const now = new Date().toISOString();
    return apiFetch('/packages', {
      method: 'POST',
      body: {
        ...packageData,
        createdAt: now,
        updatedAt: now
      }
    });
  },

  /**
   * Update a package
   * @param {string} packageId - The package ID to update
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} The updated package
   */
  async update(packageId, updates) {
    const existing = await this.getById(packageId);
    if (!existing) {
      throw new Error(`Package not found: ${packageId}`);
    }

    const now = new Date().toISOString();
    return apiFetch(`/packages/${packageId}`, {
      method: 'PUT',
      body: {
        ...existing,
        ...updates,
        id: packageId,
        updatedAt: now
      }
    });
  },

  /**
   * Delete a package
   * @param {string} packageId - The package ID to delete
   * @returns {Promise<boolean>} True if deleted
   */
  async delete(packageId) {
    await apiFetch(`/packages/${packageId}`, {
      method: 'DELETE'
    });
    return true;
  }
};

export const apiService = {
  folders: foldersApi,
  templates: templatesApi,
  packages: packagesApi
};