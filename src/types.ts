export type Market = 'usvi' | 'polynesia';
export type Continent = 'África' | 'Ásia' | 'Europa' | 'América do Norte' | 'América do Sul' | 'Oceânia';
export type Category = 'villas' | 'realestate' | 'hotels' | 'cars' | 'yachts' | 'jets' | 'experiences';
export type PublicTab = 'home' | Category;
export type AdminTab = 'dashboard' | 'listings' | 'bookings' | 'ambassadors' | 'system' | 'intelligence' | 'messages' | 'synergy';
export type AmbassadorTab = 'amb-dashboard' | 'amb-earnings' | 'amb-listings' | 'amb-services' | 'amb-highlights' | 'amb-profile' | 'amb-manifesto' | 'amb-saas';
export type UserTab = 'user-bookings' | 'user-listings' | 'user-favourites' | 'user-profile' | 'user-gifts';
export type AppMode = 'public' | 'admin' | 'ambassador' | 'user' | 'seller';
export type UserRole = 'admin' | 'ambassador' | 'user' | 'seller';
export type LoginTarget = 'admin' | 'ambassador' | 'user' | 'seller' | null;
export type AmbassadorStatus = 'new' | 'awaiting_bot_review' | 'awaiting_admin_approval' | 'contacted' | 'interested' | 'active' | 'rejected';
export type AmbassadorPlatform = 'vendifree' | 'usvi' | 'both';
export type AmbassadorTier = 'Starter' | 'Silver' | 'Gold' | 'Platinum' | 'Elite';
export type PropertyStatus = 'disponível' | 'reservado' | 'negociação' | 'vendido' | 'alugado';
export type BookingType = 'reserva' | 'visita' | 'proposta';

export interface Property {
  id: string;
  market: Market;
  category: Category;
  title: string;
  location: string;
  island: string;
  price: number;
  priceUnit: 'night' | 'week' | 'sale' | 'day';
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  guests?: number;
  rating: number;
  reviews: number;
  description: string;
  amenities: string[];
  featured: boolean;
  status: PropertyStatus;
  images: string[];
  virtualTourUrl?: string;
  specs: {
    metragem: number;
    suites: number;
    piscinas: number;
    marina: boolean;
    heliporto: boolean;
    extras: string[];
  };
  cardClass: string;
  iconEmoji: string;
  ambassadorId?: string;
  isMystery?: boolean;
  requiresVIP?: boolean;
  isGhost?: boolean;
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut?: string;
  guests: number;
  totalPrice: number;
  type: BookingType;
  proposalAmount?: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'em negociação' | 'terminado';
  createdAt: string;
  ambassadorId?: string;
}

export interface Ambassador {
  id: string;
  name: string;
  location: string;
  territory: string;
  platform: AmbassadorPlatform;
  niche: string;
  followers: number;
  network: string;
  fitScore: number;
  status: AmbassadorStatus;
  email: string;
  notes?: string;
  monthlyEarnings?: number;
  totalVolumeGenerated: number;
  tier: AmbassadorTier;
  rating?: number;
  dealsCompleted?: number;
  taxId?: string;
  linkedin?: string;
  experience?: string;
}

export interface GiftCard {
  id: string;
  code: string;
  value: number;
  buyerName: string;
  recipientEmail?: string;
  status: 'valid' | 'redeemed' | 'expired';
  type: 'stay' | 'trip' | 'credits';
  createdAt: string;
  expiryDate: string;
}

export interface BotAction {
  id: string;
  botName: 'Versus' | 'Venus' | 'Architect';
  action: string;
  timestamp: string;
  status: 'autonomous' | 'supervised' | 'overridden';
  tokenSavings: string;
}

export interface BotMessage {
  id: string;
  sender: 'Versus' | 'Venus' | 'Architect' | 'Admin';
  content: string;
  timestamp: string;
  requiresAction: boolean;
}

export interface ScalabilityIndex {
  current: number; // 0-100
  orientation: 'Horizontal' | 'Vertical' | 'Optimal';
  lastAdjustment: string;
}

export interface BotSkill {
  id: string;
  name: string;
  description: string;
  tokenUsage: 'zero' | 'minimal' | 'high';
  isActive: boolean;
}

export interface BotSystemStatus {
  isShadowMode: boolean;
  activeBots: string[];
  lastDecisions: BotAction[];
  messages: BotMessage[];
  scalability: ScalabilityIndex;
}

export interface AdminStats {
  totalRevenue: number;
  monthlyRevenue: number;
  premiumRevenue: number;
  commissionRevenue: number;
  totalBookings: number;
  activeListings: number;
  activeAmbassadors: number;
  conversionRate: number;
  pendingProposals: number;
  completedDeals: number;
  byStatus: {
    disponível: number;
    reservado: number;
    negociação: number;
    vendido: number;
    alugado: number;
  };
}

export interface UserAccount {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  ambassadorId?: string;
  phone?: string;
  nif?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  status: 'active' | 'locked' | 'pending_activation';
  failedAttempts: number;
}export interface AdminBotControl {
  isSupervised: boolean;
  activeCommand?: string;
  tokenEfficiencyEnabled: boolean;
  skillLevel: 'minimalist' | 'comprehensive';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export type VIPStatus = 'none' | 'pending' | 'verified_vip';

export interface ServiceAddon {
  id: string;
  type: 'jet' | 'yacht' | 'chef' | 'security';
  title: string;
  price: number;
  commissionRate: number; // Fixed at 6.5%
}

export interface HNWLead {
  id: string;
  clientName: string;
  status: 'kyc_pending' | 'qualified' | 'vip_verified';
  estimatedBudget: number;
  interestArea: string;
  sourceAmbassadorId: string;
  proofOfFundsUrl?: string;
  conversionProbability: number; // 0-100
}

export type SaaSTier = 'Explorer' | 'Curator' | 'Mana Royal';

export interface PerformanceMetric {
  ambassadorId: string;
  cleanTransactions: number;
  avgResponseTime: number; // in hours
  vipRetentionRate: number; // 0-100
  performanceScore: number; // 0-100
}

export interface ServiceUnlock {
  id: string;
  title: string;
  description: string;
  fee: number;
  status: 'locked' | 'unlocked';
}
