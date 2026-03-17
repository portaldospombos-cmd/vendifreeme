import { PropertyStatus, BookingType } from '../types';

/**
 * Deterministic Asset Lifecycle Transitions (SOP: sop_asset_lifecycle.md)
 * Layer 3: Tool
 */
export const getNextStatus = (
  currentStatus: PropertyStatus,
  action: BookingType | 'final_deal' | 'cancel_deal'
): PropertyStatus => {
  switch (action) {
    case 'reserva':
    case 'visita':
      if (currentStatus === 'disponível') return 'reservado';
      break;
    
    case 'proposta':
      if (currentStatus === 'disponível' || currentStatus === 'reservado') return 'negociação';
      break;
    
    case 'final_deal':
      if (currentStatus === 'negociação') return 'vendido';
      break;
    
    case 'cancel_deal':
      return 'disponível';
  }
  
  return currentStatus;
};
