import { deepClone } from '../../utils/helpers.js';

export function getTemplateStructure(template) {
  if (!template) return null;
  return template.structure || template.content || null;
}

export function applyTemplateStructure(target, template) {
  const structure = getTemplateStructure(template);
  if (!structure) return target;

  const result = deepClone(target);
  Object.keys(structure).forEach(key => {
    if (!['id', 'createdAt', 'updatedAt', 'templateId'].includes(key)) {
      result[key] = deepClone(structure[key]);
    }
  });
  return result;
}

export function packageToTemplateStructure(pkg) {
  return {
    company: pkg.company || '',
    consultant: pkg.consultant || '',
    phone: pkg.phone || '',
    website: pkg.website || '',
    destination: pkg.destination || '',
    title: pkg.title || '',
    subtitle: pkg.subtitle || '',
    heroImage: pkg.heroImage || '',
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
      city3: h.city3,
      hotel3: h.hotel3,
      room3: h.room3,
      nights3: h.nights3
    })),
    itinerary: (pkg.itinerary || []).map(day => ({
      day: day.day,
      title: day.title,
      description: day.description,
      activities: day.activities || [],
      meals: day.meals || '',
      stay: day.stay || ''
    })),
    notes: pkg.notes || [],
    pricing: pkg.pricing || {}
  };
}
