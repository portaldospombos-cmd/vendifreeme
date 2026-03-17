import { Property, Booking, Ambassador, AdminStats, Continent, UserAccount, ContactMessage, GiftCard, BotSystemStatus, HNWLead, ServiceAddon } from './types';

export const ACCOUNTS: UserAccount[] = [
  { id: 'u-admin', email: 'admin@usvi.com', password: 'admin123', role: 'admin', name: 'Admin USVI', status: 'active', failedAttempts: 0 },
  { id: 'u-sell-1', email: 'vendas@usvi.com', password: 'sell123', role: 'seller', name: 'Vendedor USVI', status: 'active', failedAttempts: 0 },
  { id: 'u-amb-1', email: 'carlos@usvi-realty.com', password: 'amb123', role: 'ambassador', name: 'Carlos Ferreira', ambassadorId: 'a1', status: 'active', failedAttempts: 0 },
  { id: 'u-user-1', email: 'alex@email.com', password: 'user123', role: 'user', name: 'Alexander Whitmore', status: 'active', failedAttempts: 0 },
];

export const CONTINENT_DATA: Record<Continent, { area: number; multiplier: number; luxuryIndex: number }> = {
  'Ásia': { area: 44.5, multiplier: 1.2, luxuryIndex: 0.85 },
  'África': { area: 30.3, multiplier: 1.5, luxuryIndex: 0.65 },
  'América do Norte': { area: 24.7, multiplier: 1.0, luxuryIndex: 1.2 },
  'América do Sul': { area: 17.8, multiplier: 1.3, luxuryIndex: 0.75 },
  'Europa': { area: 10.1, multiplier: 0.9, luxuryIndex: 1.5 },
  'Oceânia': { area: 8.5, multiplier: 0.8, luxuryIndex: 1.8 },
};

export const PROPERTIES: Property[] = [
  {
    id: 'v1', market: 'usvi', category: 'villas', title: 'Villa Coral Bay Estate',
    location: 'Coral Bay, St. John', island: 'St. John',
    price: 18500, priceUnit: 'week', bedrooms: 6, bathrooms: 7, sqft: 8200, guests: 12,
    rating: 4.97, reviews: 84,
    description: 'Spectacular cliffside estate with panoramic Caribbean views. Private infinity pool, full concierge service, private chef available.',
    amenities: ['Infinity Pool', 'Private Chef', 'Ocean View', 'Beach Access', 'Concierge', 'Helipad'],
    featured: true, status: 'disponível',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
    ],
    virtualTourUrl: 'https://my.matterport.com/show/?m=example1',
    specs: { metragem: 760, suites: 6, piscinas: 2, marina: false, heliporto: true, extras: ['Chef Privado', 'Ginásio'] },
    cardClass: 'card-villa-1', iconEmoji: '🏝️', ambassadorId: 'a1'
  },
  {
    id: 'v2', market: 'usvi', category: 'villas', title: 'Maho Bay Paradise Villa',
    location: 'Maho Bay, St. John', island: 'St. John',
    price: 12000, priceUnit: 'week', bedrooms: 4, bathrooms: 5, sqft: 5500, guests: 8,
    rating: 4.95, reviews: 112,
    description: 'Nestled above Maho Bay with direct beach access. Elegant tropical interiors, private pool, and stunning sunset terraces.',
    amenities: ['Private Pool', 'Beach Access', 'Chef Kitchen', 'Snorkel Gear'],
    featured: true, status: 'disponível',
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'],
    specs: { metragem: 510, suites: 4, piscinas: 1, marina: false, heliporto: false, extras: ['Carrinho de Golfe'] },
    cardClass: 'card-villa-2', iconEmoji: '🌊'
  },
  {
    id: 'r1', market: 'usvi', category: 'realestate', title: 'Great Cruz Bay Oceanfront Estate',
    location: 'Great Cruz Bay, St. John', island: 'St. John',
    price: 8750000, priceUnit: 'sale', bedrooms: 7, bathrooms: 8, sqft: 12000,
    rating: 5.0, reviews: 6,
    description: 'Once-in-a-lifetime oceanfront estate. 4.2 acres of pristine land, private beach, world-class architecture.',
    amenities: ['Private Beach', 'Infinity Pool', 'Wine Cellar', 'Home Theater'],
    featured: true, status: 'negociação',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
    specs: { metragem: 1100, suites: 7, piscinas: 1, marina: true, heliporto: true, extras: ['Cave de Vinhos', 'Cinema'] },
    cardClass: 'card-re-1', iconEmoji: '🏰', ambassadorId: 'a1'
  },
  {
    id: 'pr1', market: 'polynesia', category: 'realestate', title: 'Bora Bora Private Island',
    location: 'Bora Bora, Polinésia Francesa', island: 'Bora Bora',
    price: 45000000, priceUnit: 'sale', bedrooms: 12, bathrooms: 15, sqft: 25000,
    rating: 5.0, reviews: 1,
    description: 'Exclusive private island (Motu) in the Bora Bora lagoon. Complete privacy with autonomous power and water systems.',
    amenities: ['Private Island', 'Helipad', 'Marina', 'Staff Quarters', 'Lagoon Access'],
    featured: true, status: 'disponível',
    images: ['https://images.unsplash.com/photo-1506929113675-b9299d4fd64e?auto=format&fit=crop&w=1200&q=80'],
    virtualTourUrl: 'https://my.matterport.com/show/?m=example2',
    specs: { metragem: 2300, suites: 12, piscinas: 4, marina: true, heliporto: true, extras: ['Ilha Privada', 'Autossuficiente'] },
    cardClass: 'card-re-1', iconEmoji: '🏔️', ambassadorId: 'a1'
  },
  {
    id: 'y1', market: 'usvi', category: 'yachts', title: 'Azimut Grande 35M',
    location: 'Charlotte Amalie, St. Thomas', island: 'St. Thomas',
    price: 150000, priceUnit: 'week', bedrooms: 5, bathrooms: 6, sqft: 3500, guests: 10,
    rating: 4.98, reviews: 12,
    description: 'Ultra-luxurious superyacht with cutting-edge design and vast outdoor spaces. includes full crew and premium water toys.',
    amenities: ['Jacuzzi', 'Beach Club', 'Stabilizers', 'Gym', 'Sea Bob', 'Jet Ski'],
    featured: true, status: 'disponível',
    images: ['https://images.unsplash.com/photo-1567899378494-47b22a2ec96a?auto=format&fit=crop&w=1200&q=80'],
    specs: { metragem: 35, suites: 5, piscinas: 1, marina: true, heliporto: false, extras: ['Full Crew', 'Beach Club'] },
    cardClass: 'card-yacht-1', iconEmoji: '🛥️', ambassadorId: 'a1'
  },
  {
    id: 'j1', market: 'polynesia', category: 'jets', title: 'Gulfstream G650ER',
    location: 'Papeete, Tahiti', island: 'Tahiti',
    price: 85000, priceUnit: 'sale', bedrooms: 0, bathrooms: 2, sqft: 1500, guests: 16,
    rating: 5.0, reviews: 3,
    description: 'The pinnacle of business aviation. Travel the world in ultimate comfort and speed. International range 7,500 nm.',
    amenities: ['Private Bedroom', 'Full Galley', 'High-speed Wi-Fi', 'Flight Attendant'],
    featured: true, status: 'disponível',
    images: ['https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=1200&q=80'],
    specs: { metragem: 30, suites: 1, piscinas: 0, marina: false, heliporto: true, extras: ['Ultra Long Range', 'Ku-band Satcom'] },
    cardClass: 'card-jet-1', iconEmoji: '🛩️', ambassadorId: 'a1'
  },
  {
    id: 'e1', market: 'polynesia', category: 'experiences', title: 'Tahitian Pearl Harvest Expedition',
    location: 'Rangiroa, French Polynesia', island: 'Rangiroa',
    price: 2500, priceUnit: 'day', bedrooms: 0, bathrooms: 0, sqft: 0, guests: 4,
    rating: 4.99, reviews: 28,
    description: 'A deep dive into the legendary black pearl culture. Guided harvest, private lagoon lunch, and a custom pearl piece.',
    amenities: ['Private Boat', 'Snorkeling', 'Gourmet Lunch', 'Guide'],
    featured: true, status: 'disponível',
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80'],
    specs: { metragem: 0, suites: 0, piscinas: 0, marina: true, heliporto: false, extras: ['Black Pearl Harvest', 'Lagoon Picnic'] },
    cardClass: 'card-exp-1', iconEmoji: '💎', ambassadorId: 'a1'
  },
  {
    id: 'otr1', market: 'polynesia', category: 'villas', title: 'The Marquesas Secret Atoll',
    location: '9°25\'0"S 139°30\'0"W', island: 'Marquesas',
    price: 350000, priceUnit: 'week', bedrooms: 4, bathrooms: 4, sqft: 0, guests: 8,
    rating: 5.0, reviews: 1,
    description: 'Expedição completa de Luxo Primitivo. O único acesso é por iate privado ou hidroavião de longo alcance. Total isolamento do mundo moderno.',
    amenities: ['Mordomo 24h', 'Chef Michelin', 'Comunicações Satélite', 'Eco-Lodge'],
    featured: true, status: 'disponível',
    images: ['https://images.unsplash.com/photo-1505881502353-a1986add3732?auto=format&fit=crop&w=1200&q=80'],
    specs: { metragem: 0, suites: 4, piscinas: 1, marina: false, heliporto: true, extras: ['Jato Privado Incluído', 'Expedição de Pesca'] },
    cardClass: 'card-villa-1', iconEmoji: '🌋', ambassadorId: 'a1',
    isMystery: true, requiresVIP: true
  },
  {
    id: 'otr2', market: 'usvi', category: 'villas', title: 'The St. John Glass Mansion',
    location: 'Trunk Bay, St. John', island: 'St. John',
    price: 45000, priceUnit: 'week', bedrooms: 5, bathrooms: 6, sqft: 9000, guests: 10,
    rating: 4.99, reviews: 14,
    description: 'Architectural masterpiece with floor-to-ceiling glass walls. Private beach access and state-of-the-art security.',
    amenities: ['Glass Walls', 'Private Beach', 'Smart Home', 'Infinity Pool'],
    featured: true, status: 'disponível',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'],
    specs: { metragem: 830, suites: 5, piscinas: 1, marina: false, heliporto: false, extras: ['Domótica Avançada', 'Segurança 24h'] },
    cardClass: 'card-villa-3', iconEmoji: '💎', ambassadorId: 'a1'
  },
  {
    id: 'pr2', market: 'polynesia', category: 'yachts', title: 'Silent 80 Solar Catamaran',
    location: 'Bora Bora, Polinésia Francesa', island: 'Bora Bora',
    price: 32000, priceUnit: 'week', bedrooms: 4, bathrooms: 4, sqft: 2500, guests: 8,
    rating: 4.96, reviews: 5,
    description: 'Eco-luxury solar powered catamaran. Zero noise, zero emissions, infinite range in the lagoon.',
    amenities: ['Solar Powered', 'Silent Cruise', 'Zero Emissions', 'Water Toys'],
    featured: true, status: 'disponível',
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80'],
    specs: { metragem: 24, suites: 4, piscinas: 0, marina: true, heliporto: false, extras: ['Energia Solar', 'Silencioso'] },
    cardClass: 'card-yacht-1', iconEmoji: '☀️', ambassadorId: 'a1'
  }
];

export const HNW_LEADS: HNWLead[] = [
  { id: 'hnw1', clientName: 'Victor V.', status: 'qualified', estimatedBudget: 150000, interestArea: 'Tahiti Expedition', sourceAmbassadorId: 'a1', conversionProbability: 85 },
  { id: 'hnw2', clientName: 'Sarah J.', status: 'kyc_pending', estimatedBudget: 45000, interestArea: 'St. John Villa Rental', sourceAmbassadorId: 'a1', conversionProbability: 45 }
];

export const SERVICE_ADDONS: ServiceAddon[] = [
  { id: 's1', type: 'jet', title: 'Private Jet Transfer (Inner Islands)', price: 12500, commissionRate: 0.065 },
  { id: 's2', type: 'security', title: 'Elite Close Protection Group (7 Days)', price: 8400, commissionRate: 0.065 },
  { id: 's3', type: 'chef', title: 'Michelin Star In-Villa Experience', price: 3500, commissionRate: 0.065 }
];

export const BOOKINGS: Booking[] = [
  {
    id: 'b1', propertyId: 'v1', propertyTitle: 'Villa Coral Bay Estate',
    guestName: 'Alexander Whitmore', guestEmail: 'alex@email.com',
    checkIn: '2026-04-12', checkOut: '2026-04-19', guests: 10, totalPrice: 18500,
    type: 'reserva', status: 'confirmed', createdAt: '2026-02-28', ambassadorId: 'a1'
  },
  {
    id: 'b2', propertyId: 'r1', propertyTitle: 'Great Cruz Bay Oceanfront Estate',
    guestName: 'Sophie Laurent', guestEmail: 'sophie.laurent@luxe.fr',
    checkIn: '2026-05-20', guests: 2, totalPrice: 8750000,
    type: 'proposta', proposalAmount: 8200000, status: 'em negociação', createdAt: '2026-03-01', ambassadorId: 'a1'
  },
];

export const AMBASSADORS: Ambassador[] = [
  {
    id: 'a1', name: 'Carlos Ferreira', location: 'Charlotte Amalie, USVI',
    territory: 'USVI', platform: 'both', niche: 'Luxury Real Estate',
    followers: 28400, network: 'Instagram + LinkedIn', fitScore: 96,
    status: 'active', email: 'carlos@usvi-realty.com',
    monthlyEarnings: 12800, totalVolumeGenerated: 1250000, tier: 'Platinum',
    rating: 4.9, dealsCompleted: 15
  },
  {
    id: 'a2', name: 'Maria Santos', location: 'Lisboa, Portugal',
    territory: 'Portugal', platform: 'both', niche: 'Yachts & Islands',
    followers: 15200, network: 'WhatsApp + Site', fitScore: 88,
    status: 'active', email: 'maria@vendifree.pt',
    monthlyEarnings: 8400, totalVolumeGenerated: 420000, tier: 'Silver',
    rating: 4.7, dealsCompleted: 8
  },
  {
    id: 'a3', name: 'Ricardo Alvim', location: 'Funchal, Madeira',
    territory: 'Portugal', platform: 'both', niche: 'Hospitality & Boutique Hotels',
    followers: 42000, network: 'LinkedIn + Industry Events', fitScore: 94,
    status: 'interested', email: 'ricardo@hotel-logic.com',
    monthlyEarnings: 0, totalVolumeGenerated: 0, tier: 'Starter',
    rating: 4.8, dealsCompleted: 20
  },
  {
    id: 'a4', name: 'Elena Petrova', location: 'Nice, França',
    territory: 'Europa', platform: 'both', niche: 'Luxury Item Rentals (Yachts/Cars)',
    followers: 85000, network: 'Instagram + JetSet Network', fitScore: 91,
    status: 'new', email: 'elena@luxe-rental.fr',
    monthlyEarnings: 0, totalVolumeGenerated: 0, tier: 'Starter',
    rating: 4.9, dealsCompleted: 35
  },
  {
    id: 'a5', name: 'Nuno Costa', location: 'Algarve, Portugal',
    territory: 'Portugal', platform: 'vendifree', niche: 'Hotel Equipment Supplies',
    followers: 12000, network: 'B2B Wholesale', fitScore: 85,
    status: 'contacted', email: 'nuno@supply-hotel.pt',
    monthlyEarnings: 0, totalVolumeGenerated: 0, tier: 'Starter',
    rating: 4.6, dealsCompleted: 12
  },
];

export const GIFT_CARDS: GiftCard[] = [
  {
    id: 'gc1',
    code: 'LUXE-2026-VOID',
    value: 500,
    buyerName: 'Alexander Whitmore',
    status: 'valid',
    type: 'stay',
    createdAt: '2026-03-01',
    expiryDate: '2027-03-01'
  }
];

export const ADMIN_STATS: AdminStats = {
  totalRevenue: 3450000,
  monthlyRevenue: 345000,
  premiumRevenue: 85200,
  commissionRevenue: 259800,
  totalBookings: 52,
  activeListings: 18,
  activeAmbassadors: 6,
  conversionRate: 13.2,
  pendingProposals: 7,
  completedDeals: 42,
  byStatus: {
    disponível: 12,
    reservado: 2,
    negociação: 4,
    vendido: 35,
    alugado: 7,
  }
};

export const CONTACT_MESSAGES: ContactMessage[] = [
  // ... existing messages ...
];

export const BOT_SYSTEM_DATA: BotSystemStatus = {
  isShadowMode: true,
  activeBots: ['Versus', 'Venus', 'Architect'],
  messages: [
    {
      id: 'bm1',
      sender: 'Architect',
      content: 'Analisei o progresso do projeto. Sugiro construir a Skill "Otimização de Conversão" para o bot Venus. Copie esta análise para o Claude para validar a lógica.',
      timestamp: '2026-03-16T22:50:00Z',
      requiresAction: true
    },
    {
      id: 'bm2',
      sender: 'Versus',
      content: 'Padrão de fraude detetado em 2 novas candidaturas. Aguardo comando para bloquear ou monitorizar em "ShadowMode".',
      timestamp: '2026-03-16T22:55:00Z',
      requiresAction: true
    }
  ],
  lastDecisions: [
    { id: 'bd1', botName: 'Venus', action: 'Ativação de Embaixador Elite', timestamp: '2026-03-16T21:00:00Z', status: 'autonomous', tokenSavings: '85%' },
    { id: 'bd2', botName: 'Architect', action: 'Refatoração de Skill de Cache', timestamp: '2026-03-16T22:00:00Z', status: 'supervised', tokenSavings: '100%' }
  ],
  scalability: {
    current: 78,
    orientation: 'Optimal',
    lastAdjustment: '2026-03-16'
  }
};
