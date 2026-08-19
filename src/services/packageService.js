/**
 * Package Service - Handles all package operations via the Node/MongoDB REST API
 */

import { apiService } from './apiService.js';
import { templateService } from './templateService.js';
import { deepClone, generateId } from '../utils/helpers.js';
import { applyTemplateStructure } from '../shared/lib/templateSchema.js';
import { getItem, setItem } from './storageService.js';

const PACKAGE_HISTORY_KEY = 'travel-package-history';

/**
 * Get the default package structure
 */
function getDefaultPackage() {
  return {
    id: generateId('pkg'),
    templateId: 'template-1',
    company: '',
    consultant: '',
    phone: '',
    website: '',
    contact: {
      name: '',
      email: '',
      phone: ''
    },
    destination: '',
    title: '',
    subtitle: '',
    guest: '',
    adults: 2,
    rooms: 1,
    startDate: '',
    endDate: '',
    nights: 0,
    days: 0,
    route: [],
    heroImage: '',
    inclusions: [],
    exclusions: [],
    hotels: [],
    itinerary: [],
    notes: [],
    pricing: {
      validity: '',
      currency: 'USD',
      totalPrice: 0,
      priceBreakdown: []
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export const packageService = {
  async getPackageById(packageId) {
    const pkg = await apiService.packages.getById(packageId);
    if (!pkg) {
      throw new Error('Package not found');
    }
    return pkg;
  },

  /**
   * Get current package from the API
   */
  async getPackage() {
    const packages = await apiService.packages.getAll();
    if (packages && packages.length > 0) {
      return packages.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
    }
    return getDefaultPackage();
  },

  /**
   * Save package to the API
   */
  async savePackage(pkg) {
    const packageToSave = deepClone(pkg);
    packageToSave.updatedAt = new Date().toISOString();

    if (!packageToSave.id) {
      packageToSave.id = generateId('pkg');
    }

    if (!packageToSave.templateId) {
      packageToSave.templateId = 'template-1';
    }

    const existing = await apiService.packages.getById(packageToSave.id);
    const saved = existing
      ? await apiService.packages.update(packageToSave.id, packageToSave)
      : await apiService.packages.create(packageToSave);

    await this.addToHistory(saved);
    return saved;
  },

  /**
   * Create a new package (reset to default or from template)
   */
  async createPackage(templateId = 'template-1') {
    const newPackage = getDefaultPackage();
    newPackage.templateId = templateId;

    const template = await templateService.getTemplateById(templateId);
    if (template) {
      const merged = applyTemplateStructure(newPackage, template);
      Object.assign(newPackage, merged);
    }

    return this.savePackage(newPackage);
  },

  /**
   * Update specific fields of the package
   */
  async updatePackage(updates) {
    const currentPackage = await this.getPackage();
    const updatedPackage = deepMerge(currentPackage, updates);
    return this.savePackage(updatedPackage);
  },

  /**
   * Delete the current package (reset to default)
   */
  async deletePackage() {
    const currentPackage = await this.getPackage();
    if (currentPackage.id) {
      try {
        await apiService.packages.delete(currentPackage.id);
      } catch (error) {
        console.error('Error deleting package from API:', error);
      }
    }
    return this.createPackage();
  },

  /**
   * Load package from a template
   */
  async loadFromTemplate(template) {
    const newPackage = getDefaultPackage();
    newPackage.templateId = template.id;
    const merged = applyTemplateStructure(newPackage, template);
    Object.assign(newPackage, merged);
    return this.savePackage(newPackage);
  },

  /**
   * Save current package as a template
   */
  async saveAsTemplate(templateData) {
    const currentPackage = await this.getPackage();
    const templateContent = deepClone(currentPackage);

    delete templateContent.id;
    delete templateContent.createdAt;
    delete templateContent.updatedAt;
    delete templateContent.templateId;

    const defaults = getDefaultPackage();
    templateContent.company = defaults.company;
    templateContent.consultant = defaults.consultant;
    templateContent.contact = defaults.contact;
    templateContent.destination = '';
    templateContent.title = '';
    templateContent.subtitle = '';
    templateContent.guest = '';
    templateContent.adults = 2;
    templateContent.rooms = 1;
    templateContent.startDate = '';
    templateContent.endDate = '';
    templateContent.nights = 0;
    templateContent.days = 0;
    templateContent.route = [];
    templateContent.heroImage = '';

    return templateService.createTemplate({
      name: templateData.name,
      description: templateData.description || '',
      category: templateData.category || 'custom',
      tags: templateData.tags || [],
      thumbnail: templateData.thumbnail || '',
      folderId: templateData.folderId ?? null,
      content: templateContent,
      structure: templateContent
    });
  },

  /**
   * Get package history (stored locally for quick access)
   */
  async getHistory(limit = 10) {
    try {
      const history = getItem(PACKAGE_HISTORY_KEY) || [];
      return history.slice(-limit).reverse();
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  },

  /**
   * Add package to history
   */
  async addToHistory(pkg) {
    try {
      const history = getItem(PACKAGE_HISTORY_KEY) || [];
      const historyEntry = {
        id: pkg.id,
        templateId: pkg.templateId,
        destination: pkg.destination,
        title: pkg.title,
        guest: pkg.guest,
        startDate: pkg.startDate,
        endDate: pkg.endDate,
        updatedAt: pkg.updatedAt
      };

      history.push(historyEntry);

      if (history.length > 50) {
        history.splice(0, history.length - 50);
      }

      setItem(PACKAGE_HISTORY_KEY, history);
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  },

  async exportPackage() {
    const pkg = await this.getPackage();
    return JSON.stringify(pkg, null, 2);
  },

  async importPackage(jsonString) {
    try {
      const pkg = JSON.parse(jsonString);
      if (!pkg.id) {
        pkg.id = generateId('pkg');
      }
      if (!pkg.templateId) {
        pkg.templateId = 'template-1';
      }
      pkg.createdAt = pkg.createdAt || new Date().toISOString();
      pkg.updatedAt = new Date().toISOString();
      return this.savePackage(pkg);
    } catch (error) {
      console.error('Error importing package:', error);
      throw new Error('Invalid package data');
    }
  },

  async duplicatePackage() {
    const currentPackage = await this.getPackage();
    const duplicated = deepClone(currentPackage);
    duplicated.id = generateId('pkg');
    duplicated.createdAt = new Date().toISOString();
    duplicated.updatedAt = new Date().toISOString();
    return this.savePackage(duplicated);
  },

  async getPackageMetadata() {
    const pkg = await this.getPackage();
    return {
      id: pkg.id,
      templateId: pkg.templateId,
      destination: pkg.destination,
      title: pkg.title,
      subtitle: pkg.subtitle,
      guest: pkg.guest,
      startDate: pkg.startDate,
      endDate: pkg.endDate,
      nights: pkg.nights,
      days: pkg.days,
      updatedAt: pkg.updatedAt
    };
  }
};

function deepMerge(target, source) {
  const result = deepClone(target);

  Object.keys(source).forEach(key => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = deepClone(source[key]);
    }
  });

  return result;
}

export default packageService;
