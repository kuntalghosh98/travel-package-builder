/**
 * Template Registry - Default template definitions
 * These are the built-in, read-only templates that ship with the application
 */

export const defaultTemplates = [
  {
    id: "template-1",
    name: "Classic Explorer",
    description: "Clean, professional layout perfect for standard tour packages. Features structured itinerary with daily activities and hotel options.",
    category: "classic",
    thumbnail: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=640&h=360&fit=crop&q=80",
    tags: ["bali", "culture", "7-days"],
    isDefault: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    structure: {
      company: "Wanderlust Travel Co.",
      consultant: "Travel Consultant",
      phone: "+1 (555) 123-4567",
      website: "www.wanderlusttravel.com",
      destination: "Bali, Indonesia",
      title: "Tropical Paradise Escape",
      subtitle: "7 Days of Sun, Sand & Culture",
      heroImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=85",
      route: ["Denpasar", "Ubud", "Seminyak", "Denpasar"],
      inclusions: [
        "6 nights accommodation in 4-star hotels",
        "Daily breakfast and 3 dinners",
        "Airport transfers and inter-city transport",
        "English-speaking local guide",
        "Entrance fees to all listed attractions",
        "Travel insurance (basic coverage)"
      ],
      exclusions: [
        "International flights",
        "Visa fees (if applicable)",
        "Personal expenses and tips",
        "Optional activities not listed",
        "Travel insurance upgrades",
        "Meals not specified in itinerary"
      ],
      hotels: [
        {
          option: "A",
          label: "Standard Comfort",
          city1: "Ubud",
          hotel1: "Ubud Village Hotel",
          room1: "Deluxe Garden View",
          nights1: 3,
          city2: "Seminyak",
          hotel2: "The Haven Bali Seminyak",
          room2: "Superior Room",
          nights2: 3,
          vehicle: "Toyota Avanza (6-seater)"
        },
        {
          option: "B",
          label: "Premium Experience",
          city1: "Ubud",
          hotel1: "Komaneka at Bisma",
          room1: "Pool Villa",
          nights1: 3,
          city2: "Seminyak",
          hotel2: "W Bali - Seminyak",
          room2: "Wonderful Room",
          nights2: 3,
          vehicle: "Toyota Fortuner (6-seater)"
        }
      ],
      itinerary: [
        {
          day: 1,
          route: "Denpasar → Ubud",
          title: "Arrival & Ubud Cultural Immersion",
          description: "Welcome to Bali! Transfer to Ubud, the cultural heart of the island. Afternoon visit to Ubud Palace and traditional market.",
          distance: "35 km / 1.5 hrs",
          activities: [
            "Airport pickup and transfer",
            "Check-in at hotel",
            "Ubud Palace visit",
            "Traditional market exploration",
            "Welcome dinner at local restaurant"
          ]
        },
        {
          day: 2,
          route: "Ubud",
          title: "Sacred Temples & Rice Terraces",
          description: "Full day exploring Ubud's spiritual and natural wonders.",
          distance: "25 km / 1 hr",
          activities: [
            "Tegallalang Rice Terraces sunrise",
            "Tirta Empul Holy Water Temple",
            "Gunung Kawi Temple complex",
            "Coffee plantation tour",
            "Traditional Balinese dance performance"
          ]
        },
        {
          day: 3,
          route: "Ubud",
          title: "Art, Craft & Wellness",
          description: "Discover Ubud's artistic heritage and rejuvenate with wellness experiences.",
          distance: "15 km / 45 min",
          activities: [
            "Mas Village woodcarving workshop",
            "Celuk Village silver jewelry making",
            "Ubud Art Market shopping",
            "Spa treatment (2 hours)",
            "Yoga session at hotel"
          ]
        },
        {
          day: 4,
          route: "Ubud → Seminyak",
          title: "Journey to the Coast",
          description: "Scenic drive to Seminyak with stops at iconic landmarks.",
          distance: "30 km / 1.5 hrs",
          activities: [
            "Tanah Lot Temple sunset visit",
            "Canggu rice field walk",
            "Beach club lunch",
            "Check-in at Seminyak hotel",
            "Sunset drinks at beach bar"
          ]
        },
        {
          day: 5,
          route: "Seminyak",
          title: "Beach Day & Shopping",
          description: "Relaxed day enjoying Seminyak's famous beaches and boutique shopping.",
          distance: "10 km / 30 min",
          activities: [
            "Seminyak Beach morning swim",
            "Boutique shopping on Jalan Kayu Aya",
            "Potato Head Beach Club",
            "Cooking class (optional)",
            "Farewell beachfront dinner"
          ]
        },
        {
          day: 6,
          route: "Seminyak",
          title: "Free Day / Optional Tours",
          description: "Choose your own adventure or simply relax.",
          distance: "Variable",
          activities: [
            "Nusa Penida day trip (optional)",
            "Surfing lessons (optional)",
            "Spa & wellness day (optional)",
            "Shopping & cafe hopping",
            "Free evening"
          ]
        },
        {
          day: 7,
          route: "Seminyak → Denpasar",
          title: "Departure",
          description: "Final morning at leisure before transfer to airport.",
          distance: "10 km / 30 min",
          activities: [
            "Late checkout (subject to availability)",
            "Last-minute souvenir shopping",
            "Airport transfer",
            "Farewell from Bali!"
          ]
        }
      ],
      notes: [
        "Best time to visit: April - October (dry season)",
        "Visa on arrival available for most nationalities ($35 USD)",
        "Local currency: Indonesian Rupiah (IDR)",
        "Dress modestly when visiting temples (shoulders & knees covered)",
        "Travel insurance highly recommended"
      ],
      validity: "Valid for travel: April 1 - October 31, 2025. Prices subject to change based on availability."
    }
  },
  {
    id: "template-2",
    name: "Luxury Escape",
    description: "Premium template for high-end packages with emphasis on luxury accommodations, fine dining, and exclusive experiences.",
    category: "luxury",
    thumbnail: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=640&h=360&fit=crop&q=80",
    tags: ["maldives", "luxury", "5-star"],
    isDefault: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    structure: {
      company: "Elite Journeys",
      consultant: "Luxury Travel Advisor",
      phone: "+1 (555) 987-6543",
      website: "www.elitejourneys.com",
      destination: "Maldives",
      title: "Maldives Overwater Luxury Retreat",
      subtitle: "5 Nights in Paradise - Overwater Villas & Private Dining",
      heroImage: "https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&w=1600&q=85",
      route: ["Malé", "North Malé Atoll", "Malé"],
      inclusions: [
        "5 nights in overwater villa with private pool",
        "All-inclusive dining (breakfast, lunch, dinner)",
        "Premium beverages including fine wines",
        "Seaplane transfers (round trip)",
        "Daily spa treatment (60 minutes)",
        "Private sunset dolphin cruise",
        "Personal butler service",
        "Complimentary water sports (non-motorized)"
      ],
      exclusions: [
        "International flights to Malé",
        "Seaplane supplement for night arrivals",
        "Motorized water sports",
        "Scuba diving excursions",
        "Gratuities for butler/spa staff",
        "Travel insurance"
      ],
      hotels: [
        {
          option: "A",
          label: "Signature Overwater Villa",
          city1: "North Malé Atoll",
          hotel1: "Soneva Jani",
          room1: "Water Reserve (1-bedroom)",
          nights1: 5,
          city2: "",
          hotel2: "",
          room2: "",
          nights2: 0,
          vehicle: "Seaplane transfer included"
        },
        {
          option: "B",
          label: "Ultimate Overwater Residence",
          city1: "North Malé Atoll",
          hotel1: "The St. Regis Maldives Vommuli",
          room1: "John Jacob Astor Estate (2-bedroom)",
          nights1: 5,
          city2: "",
          hotel2: "",
          room2: "",
          nights2: 0,
          vehicle: "Seaplane transfer included"
        }
      ],
      itinerary: [
        {
          day: 1,
          route: "Malé → North Malé Atoll",
          title: "Arrival in Paradise",
          description: "Seaplane transfer to your private island resort. Welcome champagne and villa orientation.",
          distance: "40 km / 25 min seaplane",
          activities: [
            "VIP airport meet & greet",
            "Seaplane transfer to resort",
            "Welcome champagne & canapés",
            "Villa orientation with butler",
            "Sunset dinner on private deck"
          ]
        },
        {
          day: 2,
          route: "North Malé Atoll",
          title: "Island Indulgence",
          description: "Full day of relaxation and resort amenities.",
          distance: "On island",
          activities: [
            "Floating breakfast in villa pool",
            "Spa treatment (90 minutes)",
            "Snorkeling with marine biologist",
            "Wine tasting at overwater cellar",
            "Private beach dinner under stars"
          ]
        },
        {
          day: 3,
          route: "North Malé Atoll",
          title: "Ocean Adventures",
          description: "Explore the vibrant marine life of the Maldives.",
          distance: "Atoll exploration",
          activities: [
            "Sunrise dolphin watching cruise",
            "Guided snorkeling at house reef",
            "Picnic on deserted sandbank",
            "Sunset fishing excursion",
            "Gourmet dinner at underwater restaurant"
          ]
        },
        {
          day: 4,
          route: "North Malé Atoll",
          title: "Wellness & Rejuvenation",
          description: "Dedicated wellness day with personalized treatments.",
          distance: "On island",
          activities: [
            "Sunrise yoga on private deck",
            "Ayurvedic consultation & treatment",
            "Healthy cooking class",
            "Meditation session",
            "Farewell gala dinner"
          ]
        },
        {
          day: 5,
          route: "North Malé Atoll",
          title: "Leisure & Last Moments",
          description: "Final full day to savor the Maldives experience.",
          distance: "On island",
          activities: [
            "Late breakfast at leisure",
            "Final spa treatment",
            "Souvenir shopping at boutique",
            "Afternoon tea",
            "Private farewell celebration"
          ]
        },
        {
          day: 6,
          route: "North Malé Atoll → Malé",
          title: "Departure",
          description: "Seaplane transfer back to Malé for international flight.",
          distance: "40 km / 25 min seaplane",
          activities: [
            "Leisurely morning",
            "Check-out & seaplane transfer",
            "VIP airport lounge access",
            "Departure from Malé"
          ]
        }
      ],
      notes: [
        "Seaplane operates daylight hours only (6 AM - 4 PM)",
        "Maldives is a Muslim country - respect local customs on inhabited islands",
        "No single-use plastics at most luxury resorts",
        "USD widely accepted; credit cards at resorts",
        "Best visibility for snorkeling: November - April"
      ],
      validity: "Valid for travel: November 1, 2024 - April 30, 2025. Peak season surcharges apply Dec 20 - Jan 10."
    }
  },
  {
    id: "template-3",
    name: "Adventure Trekker",
    description: "Designed for active adventure packages with multi-destination trekking, camping, and outdoor activities.",
    category: "adventure",
    thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=640&h=360&fit=crop&q=80",
    tags: ["nepal", "trekking", "outdoor"],
    isDefault: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    structure: {
      company: "Summit Seekers Adventures",
      consultant: "Adventure Specialist",
      phone: "+1 (555) 456-7890",
      website: "www.summitseekers.com",
      destination: "Nepal - Annapurna Region",
      title: "Annapurna Base Camp Trek",
      subtitle: "12 Days Himalayan Adventure - Trek to the Heart of the Annapurnas",
      heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
      route: ["Kathmandu", "Pokhara", "Nayapul", "Ghandruk", "Chhomrong", "Bamboo", "Deurali", "Annapurna Base Camp", "Bamboo", "Jhinu Danda", "Nayapul", "Pokhara", "Kathmandu"],
      inclusions: [
        "11 nights accommodation (hotels & teahouses)",
        "All meals during trek (breakfast, lunch, dinner)",
        "Experienced licensed trekking guide",
        "Porter service (1 porter per 2 trekkers)",
        "Annapurna Conservation Area Permit (ACAP)",
        "Trekkers' Information Management System (TIMS) card",
        "Domestic flights Kathmandu-Pokhara-Kathmandu",
        "Private ground transportation",
        "First aid kit and oximeter",
        "Welcome & farewell dinners in Kathmandu"
      ],
      exclusions: [
        "International flights to Kathmandu",
        "Nepal visa ($30 for 15 days / $50 for 30 days)",
        "Travel insurance (must cover high altitude trekking)",
        "Personal trekking gear (sleeping bag, poles, boots)",
        "Hot showers, WiFi, charging at teahouses ($2-5 each)",
        "Extra snacks, drinks, alcohol",
        "Tips for guide and porters (recommended $10-15/day)",
        "Emergency helicopter evacuation"
      ],
      hotels: [
        {
          option: "A",
          label: "Standard Teahouse Trek",
          city1: "Kathmandu",
          hotel1: "Hotel Yak & Yeti (or similar)",
          room1: "Deluxe Room",
          nights1: 2,
          city2: "Pokhara",
          hotel2: "Hotel Lake Star (or similar)",
          room2: "Lake View Room",
          nights2: 2,
          vehicle: "Private tourist bus / domestic flight"
        },
        {
          option: "B",
          label: "Comfort Lodge Trek",
          city1: "Kathmandu",
          hotel1: "Dwarika's Hotel (or similar)",
          room1: "Heritage Room",
          nights1: 2,
          city2: "Pokhara",
          hotel2: "Temple Tree Resort (or similar)",
          room2: "Cottage Suite",
          nights2: 2,
          vehicle: "Private tourist bus / domestic flight"
        }
      ],
      itinerary: [
        {
          day: 1,
          route: "Kathmandu Arrival",
          title: "Welcome to Nepal",
          description: "Arrival in Kathmandu, transfer to hotel. Evening briefing and welcome dinner.",
          distance: "6 km / 30 min",
          activities: [
            "Airport pickup",
            "Hotel check-in",
            "Trek briefing with guide",
            "Welcome dinner with cultural show",
            "Early night for tomorrow's flight"
          ]
        },
        {
          day: 2,
          route: "Kathmandu → Pokhara",
          title: "Flight to Pokhara - Lake City",
          description: "Scenic 25-minute flight to Pokhara. Afternoon at leisure by Phewa Lake.",
          distance: "200 km / 25 min flight",
          activities: [
            "Early morning flight to Pokhara",
            "Hotel check-in",
            "Boating on Phewa Lake",
            "Visit World Peace Pagoda",
            "Lakeside dinner"
          ]
        },
        {
          day: 3,
          route: "Pokhara → Nayapul → Ghandruk",
          title: "Trek Begins - To Ghandruk",
          description: "Drive to Nayapul, then trek through beautiful villages to Ghandruk (1,940m).",
          distance: "42 km drive + 10 km trek / 5-6 hrs",
          activities: [
            "Drive to Nayapul (1.5 hrs)",
            "Trek to Birethanti (1,025m)",
            "Steep ascent to Ghandruk",
            "Gurung village cultural visit",
            "Mountain views: Annapurna South, Hiunchuli"
          ]
        },
        {
          day: 4,
          route: "Ghandruk → Chhomrong",
          title: "Into the Annapurna Sanctuary",
          description: "Descend to Kimrong Khola then steep climb to Chhomrong (2,170m) - gateway to sanctuary.",
          distance: "10 km / 5-6 hrs",
          activities: [
            "Descend to Kimrong Khola",
            "Steep climb to Chhomrong",
            "First views of Machhapuchhre (Fishtail)",
            "Acclimatization walk",
            "Early dinner for altitude"
          ]
        },
        {
          day: 5,
          route: "Chhomrong → Bamboo",
          title: "Deep into the Forest",
          description: "Trek through rhododendron and bamboo forests to Bamboo (2,310m).",
          distance: "8 km / 5-6 hrs",
          activities: [
            "Descend to Chhomrong Khola",
            "Climb through rhododendron forest",
            "Pass Sinuwa village",
            "Enter bamboo forest zone",
            "Overnight at Bamboo"
          ]
        },
        {
          day: 6,
          route: "Bamboo → Deurali",
          title: "Alpine Zone Approach",
          description: "Enter alpine zone with stunning mountain vistas. Deurali (3,230m).",
          distance: "7 km / 4-5 hrs",
          activities: [
            "Trek through bamboo & rhododendron",
            "Cross avalanche-prone areas carefully",
            "Himalayan Hotel (2,920m) lunch stop",
            "Final climb to Deurali",
            "Altitude acclimatization"
          ]
        },
        {
          day: 7,
          route: "Deurali → Annapurna Base Camp",
          title: "THE SUMMIT - Annapurna Base Camp (4,130m)",
          description: "Early start to reach ABC for sunrise. 360° panoramic mountain views!",
          distance: "7 km / 4-5 hrs",
          activities: [
            "Pre-dawn start (4:30 AM)",
            "Machhapuchhre Base Camp (3,700m)",
            "Annapurna Base Camp arrival",
            "Sunrise over Annapurna I (8,091m)",
            "360° panorama: Annapurna I, II, III, IV, South, Gangapurna, Machhapuchhre",
            "Descent to Bamboo for overnight"
          ]
        },
        {
          day: 8,
          route: "Bamboo → Jhinu Danda",
          title: "Descent & Hot Springs",
          description: "Long descent to Jhinu Danda (1,780m) - famous for natural hot springs.",
          distance: "15 km / 6-7 hrs",
          activities: [
            "Long descent through forests",
            "Pass Chhomrong again",
            "Natural hot springs at Jhinu",
            "Relax tired muscles in thermal pools",
            "Celebration dinner with team"
          ]
        },
        {
          day: 9,
          route: "Jhinu Danda → Nayapul → Pokhara",
          title: "Trek Complete - Return to Pokhara",
          description: "Final trek to Nayapul, drive back to Pokhara. Free afternoon.",
          distance: "10 km trek + 42 km drive / 5-6 hrs",
          activities: [
            "Easy descent to Nayapul",
            "Drive to Pokhara",
            "Hotel check-in & hot shower!",
            "Free afternoon - massage recommended",
            "Farewell dinner with trekking crew"
          ]
        },
        {
          day: 10,
          route: "Pokhara → Kathmandu",
          title: "Return to Capital",
          description: "Flight back to Kathmandu. Free day for shopping/sightseeing.",
          distance: "200 km / 25 min flight",
          activities: [
            "Morning flight to Kathmandu",
            "Hotel check-in",
            "Thamel shopping district",
            "Swayambhunath (Monkey Temple) optional",
            "Free evening"
          ]
        },
        {
          day: 11,
          route: "Kathmandu",
          title: "Kathmandu Valley Heritage Tour",
          description: "Guided tour of UNESCO World Heritage sites.",
          distance: "30 km / full day",
          activities: [
            "Pashupatinath Temple (Hindu cremation site)",
            "Boudhanath Stupa (largest in Nepal)",
            "Patan Durbar Square",
            "Kathmandu Durbar Square",
            "Farewell dinner"
          ]
        },
        {
          day: 12,
          route: "Kathmandu Departure",
          title: "Departure",
          description: "Transfer to airport for international flight.",
          distance: "6 km / 30 min",
          activities: [
            "Hotel checkout",
            "Airport transfer",
            "Departure from Nepal"
          ]
        }
      ],
      notes: [
        "Trek grade: Moderate to Strenuous (max altitude 4,130m)",
        "Best seasons: March-May (spring) & September-November (autumn)",
        "Physical preparation: 3-4 months cardio & strength training recommended",
        "Altitude sickness: Guide carries oximeter; descent is only cure",
        "Pack light: 15kg max for porter (including sleeping bag)",
        "Required gear: Broken-in hiking boots, down jacket, sleeping bag (-10°C), layers",
        "Travel insurance MUST cover trekking above 4,000m and helicopter evacuation"
      ],
      validity: "Valid for 2025 spring (Mar-May) & autumn (Sep-Nov) seasons. Permit fees subject to government revision."
    }
  }
];

/**
 * Get a default template by ID
 * @param {string} templateId - The template ID
 * @returns {Object|null} The template or null
 */
export function getDefaultTemplate(templateId) {
  return defaultTemplates.find(t => t.id === templateId) || null;
}

/**
 * Get default templates by category
 * @param {string} category - The category to filter by
 * @returns {Object[]} Filtered templates
 */
export function getDefaultTemplatesByCategory(category) {
  return defaultTemplates.filter(t => t.category === category);
}

/**
 * Get all available categories
 * @returns {string[]} Unique categories
 */
export function getCategories() {
  return [...new Set(defaultTemplates.map(t => t.category))];
}