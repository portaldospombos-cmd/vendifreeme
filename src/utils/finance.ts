import { Booking } from '../types';

/**
 * Deterministic Commission Calculator (SOP: sop_commissions.md)
 * Layer 3: Tool
 */
export interface CommissionResult {
  grossCommission: number;
  netToSeller: number;
  platformShare: number;
  ambassadorNet: number;
}

export const calculateCommission = (totalValue: number, commissionPercent: number = 0.30): CommissionResult => {
  const grossCommission = totalValue * commissionPercent;
  
  // Platform takes 20% of the commission, Ambassador takes 80%
  const platformShare = grossCommission * 0.20;
  const ambassadorNet = grossCommission * 0.80;
  
  const netToSeller = totalValue - grossCommission;

  return {
    grossCommission,
    netToSeller,
    platformShare,
    ambassadorNet
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
};
