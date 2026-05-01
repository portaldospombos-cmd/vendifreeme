import React, { useMemo } from 'react';
import { MapPin, X, Navigation, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings } from '../contexts/SettingsContext';

const countries = [
  { 
    id: 'pt', 
    name: 'Portugal', 
    flag: '🇵🇹', 
    lang: 'pt',
    regions: [
      'Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco', 'Coimbra', 
      'Évora', 'Faro', 'Guarda', 'Leiria', 'Lisboa', 'Portalegre', 'Porto', 
      'Santarém', 'Setúbal', 'Viana do Castelo', 'Vila Real', 'Viseu', 
      'Madeira', 'Açores'
    ]
  },
  {
    id: 'es',
    name: 'España',
    flag: '🇪🇸',
    lang: 'es',
    regions: [
      'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga',
      'Murcia', 'Palma', 'Las Palmas', 'Bilbao', 'Alicante', 'Córdoba',
      'Valladolid', 'Vigo', 'Gijón', 'L\'Hospitalet'
    ]
  },
  {
    id: 'en',
    name: 'International',
    flag: '🌍',
    lang: 'en',
    regions: [
      'London', 'Manchester', 'New York', 'Los Angeles', 'Paris', 'Berlin',
      'Dubai', 'Tokyo', 'Singapore', 'Amsterdam', 'Toronto'
    ]
  }
];

interface RegionSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRegion: string | null;
  onSelectRegion: (region: string | null) => void;
  onGeolocate: () => void;
  isLocating: boolean;
}

export default function RegionSelector({ isOpen, onClose, selectedRegion, onSelectRegion, onGeolocate, isLocating }: RegionSelectorProps) {
  const { setLanguage, t } = useSettings();
  const [selectedCountry, setSelectedCountry] = React.useState(countries[0]);

  const handleToggle = (region: string) => {
    if (selectedRegion === region) {
      onSelectRegion(null);
    } else {
      // Auto-switch language based on country
      setLanguage(selectedCountry.lang as 'en' | 'pt' | 'es');
      onSelectRegion(`${region}, ${selectedCountry.name}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ y: '100%', opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: '100%', opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg bg-surface rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-white/40 flex flex-col max-h-[80vh]"
          >
            <div className="p-6 md:p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low shrink-0">
              <div>
                <h3 className="text-2xl font-black font-headline text-primary">Selecione a Região</h3>
                <p className="text-xs text-on-surface-variant font-bold mt-1">Filtre os anúncios por localização</p>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-surface-container-high rounded-full transition-colors text-primary">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto space-y-8">
              {/* Country Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {countries.map(country => (
                  <button
                    key={country.id}
                    onClick={() => setSelectedCountry(country)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shrink-0 ${
                      selectedCountry.id === country.id
                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                  </button>
                ))}
              </div>

              <button 
                onClick={onGeolocate}
                disabled={isLocating}
                className="w-full flex items-center justify-between p-5 bg-primary/5 border-2 border-primary/20 rounded-2xl text-primary font-black text-sm hover:bg-primary/10 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <Navigation size={20} className={isLocating ? 'animate-pulse' : ''} />
                  <span>{isLocating ? 'A localizar...' : 'Usar Localização Atual'}</span>
                </div>
              </button>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black font-headline text-on-surface-variant uppercase tracking-widest">{selectedCountry.name} - Distritos</label>
                  {selectedRegion && (
                    <button 
                      onClick={() => onSelectRegion(null)}
                      className="text-[10px] font-black text-error uppercase tracking-widest"
                    >
                      Limpar
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {selectedCountry.regions.map(r => {
                    const isSelected = selectedRegion?.includes(r);
                    return (
                      <button
                        key={r}
                        onClick={() => handleToggle(r)}
                        className={`p-4 border-2 rounded-2xl font-bold text-sm transition-all focus:outline-none text-left ${
                          isSelected 
                            ? 'bg-primary/5 text-primary border-primary'
                            : 'bg-surface-container-lowest text-on-surface-variant border-transparent hover:bg-surface-container-low'
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
