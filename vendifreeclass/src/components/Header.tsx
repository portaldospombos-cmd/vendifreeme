import { Search, Bell, MapPin, ChevronDown, Globe, ChevronLeft, RotateCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

export default function Header({ 
  title = 'Vendifree', 
  showSearch = true, 
  showNotifications = true,
  searchQuery = '',
  onSearch 
}: HeaderProps) {
  const { t, location, setLocation, language, setLanguage } = useSettings();
  const navigate = useNavigate();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [history, setHistory] = useState<string[][]>([]);
  const [activeDistrict, setActiveDistrict] = useState<string | null>(null);
  const [localitySearch, setLocalitySearch] = useState('');

  const languageOptions = [
    { code: 'pt', name: 'Portugal', flag: '🇵🇹' },
    { code: 'en', name: 'Reino Unido', flag: '🇬🇧' },
    { code: 'es', name: 'Espanha', flag: '🇪🇸' },
  ];

  const ptDistricts = [
    'Lisboa', 'Porto', 'Braga', 'Setúbal', 'Coimbra', 'Aveiro', 'Faro', 'Leiria', 'Santarém',
    'Viseu', 'Viana do Castelo', 'Vila Real', 'Castelo Branco', 'Évora', 'Guarda', 
    'Beja', 'Bragança', 'Portalegre', 'Funchal', 'Ponta Delgada'
  ];

  const subLocalities: Record<string, string[]> = {
    'Lisboa': ['Alenquer', 'Amadora', 'Arruda dos Vinhos', 'Azambuja', 'Cadaval', 'Cascais', 'Lisboa-Centro', 'Loures', 'Lourinhã', 'Mafra', 'Odivelas', 'Oeiras', 'Sintra', 'Sobral de Monte Agraço', 'Torres Vedras', 'Vila Franca de Xira'],
    'Porto': ['Amarante', 'Baião', 'Felgueiras', 'Gondomar', 'Lousada', 'Maia', 'Marco de Canaveses', 'Matosinhos', 'Paços de Ferreira', 'Paredes', 'Penafiel', 'Porto-Centro', 'Póvoa de Varzim', 'Santo Tirso', 'Trofa', 'Valongo', 'Vila do Conde', 'Vila Nova de Gaia'],
    'Braga': ['Amares', 'Barcelos', 'Braga-Centro', 'Cabeceiras de Basto', 'Celorico de Basto', 'Esposende', 'Fafe', 'Guimarães', 'Póvoa de Lanhoso', 'Terras de Bouro', 'Vieira do Minho', 'Vila Nova de Famalicão', 'Vila Verde', 'Vizela'],
    'Setúbal': ['Alcochete', 'Almada', 'Barreiro', 'Moita', 'Montijo', 'Palmela', 'Santiago do Cacém', 'Seixal', 'Sesimbra', 'Setúbal-Centro', 'Sines'],
    'Aveiro': ['Aveiro-Centro', 'Ílhavo', 'Águeda', 'Anadia', 'Oliveira de Azeméis', 'Ovar', 'Santa Maria da Feira', 'São João da Madeira', 'Espinho', 'Estarreja', 'Murtosa', 'Albergaria-a-Velha'],
    'Coimbra': ['Arganil', 'Cantanhede', 'Coimbra-Centro', 'Condeixa-a-Nova', 'Figueira da Foz', 'Lousã', 'Mira', 'Montemor-o-Velho', 'Oliveira do Hospital', 'Soure', 'Pampilhosa da Serra', 'Penela', 'Vila Nova de Poiares'],
    'Faro': ['Albufeira', 'Alcoutim', 'Aljezur', 'Castro Marim', 'Faro-Centro', 'Lagoa', 'Lagos', 'Loulé', 'Monchique', 'Olhão', 'Portimão', 'Quarteira', 'São Brás de Alportel', 'Silves', 'Tavira', 'Vila do Bispo', 'Vila Real de Santo António', 'Vilamoura'],
    'Leiria': ['Alcobaça', 'Alvaiázere', 'Ansião', 'Batalha', 'Bombarral', 'Caldas da Rainha', 'Castanheira de Pera', 'Figueiró dos Vinhos', 'Leiria-Centro', 'Marinha Grande', 'Nazaré', 'Óbidos', 'Pedrógão Grande', 'Peniche', 'Pombal', 'Porto de Mós'],
    'Santarém': ['Abrantes', 'Almeirim', 'Alpiarça', 'Benavente', 'Cartaxo', 'Chamusca', 'Constância', 'Coruche', 'Entroncamento', 'Ferreira do Zêzere', 'Golegã', 'Mação', 'Ourém', 'Rio Maior', 'Salvaterra de Magos', 'Santarém-Centro', 'Sardoal', 'Tomar', 'Torres Novas', 'Vila Nova da Barquinha'],
    'Viseu': ['Armamar', 'Carregal do Sal', 'Castro Daire', 'Cinfães', 'Lamego', 'Mangualde', 'Moimenta da Beira', 'Mortágua', 'Nelas', 'Oliveira de Frades', 'Penalva do Castelo', 'Penedono', 'Resende', 'Santa Comba Dão', 'São João da Pesqueira', 'São Pedro do Sul', 'Sátão', 'Sernancelhe', 'Tabuaço', 'Tarouca', 'Tondela', 'Vila Nova de Paiva', 'Viseu-Centro', 'Vouzela'],
    'Évora': ['Évora-Centro', 'Montemor-o-Novo', 'Vendas Novas', 'Estremoz', 'Vila Viçosa', 'Reguengos de Monsaraz', 'Arraiolos', 'Borba', 'Portel'],
    'Beja': ['Beja-Centro', 'Aljustrel', 'Almodôvar', 'Castro Verde', 'Ferreira do Alentejo', 'Mértola', 'Moura', 'Odemira', 'Ourique', 'Serpa'],
    'Castelo Branco': ['Castelo Branco-Centro', 'Covilhã', 'Fundão', 'Idanha-a-Nova', 'Oleiros', 'Penamacor', 'Proença-a-Nova', 'Sertã', 'Vila de Rei', 'Vila Velha de Ródão'],
    'Guarda': ['Guarda-Centro', 'Almeida', 'Celorico da Beira', 'Figueira de Castelo Rodrigo', 'Fornos de Algodres', 'Gouveia', 'Manteigas', 'Pinhel', 'Sabugal', 'Seia', 'Trancoso'],
    'Viana do Castelo': ['Viana do Castelo-Centro', 'Arcos de Valdevez', 'Caminha', 'Melgaço', 'Monção', 'Paredes de Coura', 'Ponte da Barca', 'Ponte de Lima', 'Valença', 'Vila Nova de Cerveira'],
    'Vila Real': ['Vila Real-Centro', 'Alijo', 'Boticas', 'Chaves', 'Mesao Frio', 'Mondim de Basto', 'Montalegre', 'Murca', 'Peso da Régua', 'Ribeira de Pena', 'Sabrosa', 'Santa Marta de Penaguião', 'Valpaços', 'Vila Pouca de Aguiar'],
    'Bragança': ['Bragança-Centro', 'Alfândega da Fé', 'Carrazeda de Ansiães', 'Freixo de Espada à Cinta', 'Macedo de Cavaleiros', 'Miranda do Douro', 'Mirandela', 'Mogadouro', 'Torre de Moncorvo', 'Vila Flor', 'Vimioso', 'Vinhais'],
    'Portalegre': ['Portalegre-Centro', 'Alter do Chão', 'Arronches', 'Avis', 'Campo Maior', 'Castelo de Vide', 'Crato', 'Elvas', 'Fronteira', 'Gavião', 'Marvão', 'Monforte', 'Nisa', 'Ponte de Sor', 'Sousel'],
    'Madeira': ['Funchal', 'Calheta', 'Câmara de Lobos', 'Machico', 'Ponta do Sol', 'Porto Moniz', 'Porto Santo', 'Ribeira Brava', 'Santa Cruz', 'Santana', 'São Vicente'],
    'Açores': ['Ponta Delgada', 'Angra do Heroísmo', 'Horta', 'Lagoa', 'Madalena', 'Nordeste', 'Povoação', 'Praia da Vitória', 'Ribeira Grande', 'Santa Cruz da Graciosa', 'Santa Cruz das Flores', 'São Roque do Pico', 'Velas', 'Vila do Porto', 'Vila Franca do Campo'],
  };

  const allLocalities = useMemo(() => {
    const list: { name: string; parent: string }[] = [];
    Object.entries(subLocalities).forEach(([parent, children]) => {
      children.forEach(child => list.push({ name: child, parent }));
    });
    return list;
  }, []);

  const filteredLocalities = useMemo(() => {
    if (!localitySearch) return [];
    return allLocalities.filter(l => 
      l.name.toLowerCase().includes(localitySearch.toLowerCase()) ||
      l.parent.toLowerCase().includes(localitySearch.toLowerCase())
    ).slice(0, 10);
  }, [localitySearch, allLocalities]);

  const ptCities = ptDistricts; // Maintain compatibility if needed

  // Initialize selected cities when modal opens
  const openModal = () => {
    setActiveDistrict(null);
    setLocalitySearch('');
    setHistory([]);
    if (location.includes('Portugal')) {
      const cities = location.replace(', Portugal', '').split(', ').filter(c => [...ptDistricts, ...allLocalities.map(l => l.name)].includes(c));
      setSelectedCities(cities);
    } else {
      setSelectedCities([]);
    }
    setShowLocationModal(true);
  };

  // Helper to handle multi-select logic locally in the modal
  const toggleCity = (city: string) => {
    setHistory(prev => [...prev.slice(-10), [...selectedCities]]); // Keep last 10 actions
    setSelectedCities(prev => {
      if (prev.includes(city)) {
        return prev.filter(c => c !== city);
      } else {
        const next = [...prev, city];
        return next;
      }
    });
  };

  const undoAction = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setSelectedCities(prev);
      setHistory(h => h.slice(0, -1));
    }
  };

  const isCitySelected = (city: string) => {
    return selectedCities.includes(city);
  };

  const confirmSelection = () => {
    if (selectedCities.length === 0) {
      setLocation('Portugal');
    } else {
      setLocation(`${selectedCities.join(', ')}, Portugal`);
    }
    setShowLocationModal(false);
  };

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 z-50 glass-header flex justify-between items-center px-6 h-16 border-b border-outline-variant/10">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-2xl font-black tracking-tighter text-primary font-headline cursor-pointer hover:opacity-80 transition-opacity">
          {title}
        </Link>
        
        {/* Location Selector Trigger */}
        <button 
          onClick={openModal}
          className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-surface-container-high rounded-full transition-all group"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <MapPin size={16} />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 leading-none">Localização</p>
            <p className="text-sm font-bold text-on-surface flex items-center gap-1">
              {location.length > 20 ? `${location.substring(0, 20)}...` : location}
              <ChevronDown size={14} className="text-primary" />
            </p>
          </div>
        </button>

        {/* Search bar on Desktop Header */}
        {showSearch && (
          <div className="hidden lg:flex items-center bg-surface-container-low rounded-full px-4 py-2 w-72 xl:w-96 border border-outline-variant/10 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search size={18} className="text-on-surface-variant/50" />
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 text-on-surface"
              value={searchQuery}
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <nav className="hidden md:flex gap-8 items-center mr-4">
          <Link to="/" className="text-primary font-bold font-headline text-sm tracking-tight">{t('common.home')}</Link>
          <Link to="/community" className="text-on-surface-variant font-headline font-bold text-sm tracking-tight hover:text-primary transition-colors">Comunidade</Link>
          <Link to="/promote" className="text-tertiary font-headline font-bold text-sm tracking-tight hover:opacity-80 transition-opacity">Promover</Link>
        </nav>
        
        <div className="flex items-center gap-2 relative">
          {showNotifications && (
            <button 
              onClick={() => navigate('/notifications')}
              className="text-primary hover:bg-surface-container-high transition-colors p-2.5 rounded-full active:scale-90 duration-200 cursor-pointer relative"
            >
              <Bell size={22} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-background" />
            </button>
          )}
          
          <button 
            onClick={() => navigate('/profile')}
            className="hidden lg:flex items-center gap-2 bg-surface-container-low border border-outline-variant/10 px-3 py-1.5 rounded-full hover:bg-surface-container-high transition-colors ml-2"
          >
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
              U
            </div>
            <span className="text-xs font-bold text-on-surface-variant">Perfil</span>
          </button>
        </div>
      </div>

      {/* Location / Language Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLocationModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-none"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative z-10 w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-outline-variant/10"
            >
              <div className="p-8 pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black font-headline text-primary">Operação Global</h3>
                  <button onClick={() => setShowLocationModal(false)} className="p-2 hover:bg-surface-container-high rounded-full"><Globe size={24} /></button>
                </div>

                {/* Language / Country */}
                <div className="space-y-4 mb-8">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                    <Globe size={14} /> Selecionar País / Idioma
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {languageOptions.map((c) => (
                      <button 
                        key={c.code}
                        onClick={() => {
                          setLanguage(c.code as any);
                          setLocation(c.name);
                        }}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${language === c.code ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant/10 hover:border-primary/20'}`}
                      >
                        <span className="text-2xl">{c.flag}</span>
                        <span className="text-xs font-bold">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cities (Only for PT for now) */}
                {language === 'pt' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-surface-container-low/50 p-2 rounded-2xl mb-4 border border-outline-variant/10">
                      <div className="flex items-center gap-2 px-2">
                        <MapPin size={16} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                          {activeDistrict ? activeDistrict : 'Distritos / Regiões'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {history.length > 0 && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              undoAction();
                            }}
                            className="bg-primary/5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase text-primary border border-primary/10 shadow-sm flex items-center gap-1.5 active:rotate-[-45deg] transition-all"
                          >
                            <RotateCcw size={12} /> Desfazer
                          </button>
                        )}
                        {(activeDistrict || selectedCities.length > 0) && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (activeDistrict) setActiveDistrict(null);
                              else setSelectedCities([]);
                            }}
                            className="bg-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase text-primary border border-primary/20 shadow-sm flex items-center gap-1 active:scale-95 transition-transform"
                          >
                            <ChevronLeft size={12} /> {activeDistrict ? 'Voltar' : 'Limpar tudo'}
                          </button>
                        )}
                        {selectedCities.length > 0 && activeDistrict && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCities([]);
                            }}
                            className="bg-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase text-error border border-error/10 shadow-sm active:scale-95 transition-transform"
                          >
                            Limpar tudo
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Selected Badges */}
                    {selectedCities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4 max-h-24 overflow-y-auto p-1">
                        {selectedCities.map(city => (
                          <button
                            key={`badge-${city}`}
                            onClick={() => toggleCity(city)}
                            className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 hover:bg-primary/20 transition-colors"
                          >
                            {city}
                            <div className="w-3.5 h-3.5 bg-primary text-white rounded-full flex items-center justify-center font-black">×</div>
                          </button>
                        ))}
                      </div>
                    )}

                    {!activeDistrict && (
                      <div className="relative mb-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={14} />
                        <input 
                          type="text"
                          placeholder="Pesquisar localidade (ex: Cascais, Matosinhos...)"
                          value={localitySearch}
                          onChange={(e) => setLocalitySearch(e.target.value)}
                          className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl py-3 pl-9 pr-4 text-xs font-bold focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                        />
                        {localitySearch && filteredLocalities.length > 0 && (
                          <div className="absolute top-full left-0 right-0 bg-white border border-outline-variant/10 rounded-xl mt-1 shadow-2xl z-[110] overflow-hidden">
                            {filteredLocalities.map(loc => (
                              <button 
                                key={`${loc.parent}-${loc.name}`}
                                onClick={() => {
                                  toggleCity(loc.name);
                                  setLocalitySearch('');
                                }}
                                className={`w-full px-4 py-3 text-left flex items-center justify-between group transition-colors ${isCitySelected(loc.name) ? 'bg-primary/10' : 'hover:bg-primary/5'}`}
                              >
                                <div>
                                  <span className={`text-xs font-bold ${isCitySelected(loc.name) ? 'text-primary' : ''}`}>{loc.name}</span>
                                  <span className="text-[10px] text-on-surface-variant ml-2 font-black uppercase tracking-widest">{loc.parent}</span>
                                </div>
                                {isCitySelected(loc.name) && (
                                  <div className="w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center">
                                    <ChevronDown size={10} className="rotate-180" />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                        {localitySearch && filteredLocalities.length === 0 && (
                          <div className="absolute top-full left-0 right-0 bg-white border border-outline-variant/10 rounded-xl mt-1 p-4 shadow-xl z-[110] text-center">
                            <p className="text-[10px] font-black uppercase text-on-surface-variant">Nenhuma localidade encontrada</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[50vh] overflow-y-auto pr-2 scrollbar-style">
                      {activeDistrict ? (
                        subLocalities[activeDistrict]?.map((city) => (
                          <button 
                            key={city}
                            onClick={() => toggleCity(city)}
                            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-2 border ${
                              isCitySelected(city) 
                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]' 
                                : 'bg-surface-container-low border-outline-variant/10 text-on-surface-variant hover:bg-surface-container-high hover:border-primary/30'
                            }`}
                          >
                            <span className="truncate">{city}</span>
                            {isCitySelected(city) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="shrink-0 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center text-primary"
                              >
                                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                              </motion.div>
                            )}
                          </button>
                        ))
                      ) : (
                        ptDistricts.map((city) => (
                          <button 
                            key={city}
                            onClick={() => {
                              if (subLocalities[city]) {
                                setActiveDistrict(city);
                              } else {
                                toggleCity(city);
                              }
                            }}
                            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-2 border ${
                              isCitySelected(city) 
                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]' 
                                : 'bg-surface-container-low border-outline-variant/10 text-on-surface-variant hover:bg-surface-container-high hover:border-primary/30'
                            }`}
                          >
                            <span className="truncate">{city}</span>
                            <div className="flex items-center gap-1">
                              {subLocalities[city] && <div className="w-1 h-1 bg-primary/30 rounded-full" />}
                              {isCitySelected(city) && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="shrink-0 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center text-primary"
                                >
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                </motion.div>
                              )}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                    
                    <button 
                      onClick={confirmSelection}
                      className="w-full mt-4 py-4 signature-gradient text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      {selectedCities.length > 0 
                        ? `Confirmar ${selectedCities.length} ${selectedCities.length === 1 ? 'Localidade' : 'Localidades'}`
                        : 'Ver Todo o País'}
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-8 bg-surface-container-low/50 border-t border-outline-variant/10 flex flex-col items-center text-center">
                <p className="text-[10px] font-bold text-on-surface-variant leading-relaxed">
                  A Vendifree opera globalmente. A sua localização ajuda-nos a mostrar resultados mais relevantes e a ajustar a moeda e idioma.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
