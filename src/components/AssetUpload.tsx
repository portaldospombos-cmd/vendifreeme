import React, { useState, useRef } from 'react';
import { Category, Market, PropertyStatus } from '../types';

interface AssetUploadProps {
  onSuccess: (newAsset: any) => void;
  onCancel: () => void;
  role: 'admin' | 'ambassador' | 'user' | 'seller';
}

export const AssetUpload: React.FC<AssetUploadProps> = ({ onSuccess, onCancel, role }) => {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('villas');
  const [market, setMarket] = useState<Market>('usvi');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach(file => {
        const url = URL.createObjectURL(file);
        newImages.push(url);
      });
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      const newAsset = {
        id: `upl-${Math.random().toString(36).substr(2, 9)}`,
        title,
        category,
        market,
        price: parseFloat(price),
        priceUnit: category === 'realestate' ? 'sale' : 'week',
        location,
        description,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80'],
        status: (role === 'admin' || role === 'seller' || role === 'ambassador') ? 'disponível' : 'negociação', // Pre-verified: Admin, Seller, Ambassador. User stays pending.
        featured: false,
        specs: { metragem: 0, suites: 0, piscinas: 0, marina: false, heliporto: false, extras: [] }
      };
      
      setUploading(false);
      onSuccess(newAsset);
    }, 1500);
  };

  return (
    <div className="dash-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="dash-card-title">🚀 Publicar Novo Ativo</div>
      <p style={{ color: 'rgba(248,250,252,0.4)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
        Configure os detalhes do seu anúncio e carregue fotos de alta resolução.
      </p>

      <form onSubmit={handleSubmit} className="upload-form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="login-field">
            <label>Título do Anúncio</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Ex: Penthouse com vista mar" 
              required 
            />
          </div>
          <div className="login-field">
            <label>Categoria</label>
            <select value={category} onChange={e => setCategory(e.target.value as Category)} className="filter-select-adv">
              <option value="villas">Ilhas e Villas</option>
              <option value="realestate">Imobiliário de Luxo</option>
              <option value="hotels">Hotéis e Resorts</option>
              <option value="cars">Viaturas e Iates</option>
            </select>
          </div>
          <div className="login-field">
            <label>Preço (€)</label>
            <input 
              type="number" 
              value={price} 
              onChange={e => setPrice(e.target.value)} 
              placeholder="Ex: 850000" 
              required 
            />
          </div>
          <div className="login-field">
            <label>Mercado</label>
            <select value={market} onChange={e => setMarket(e.target.value as Market)} className="filter-select-adv">
              <option value="usvi">US Virgin Islands</option>
              <option value="polynesia">French Polynesia</option>
            </select>
          </div>
        </div>

        <div className="login-field" style={{ marginTop: '1.5rem' }}>
          <label>Localização Detalhada</label>
          <input 
            type="text" 
            value={location} 
            onChange={e => setLocation(e.target.value)} 
            placeholder="Ex: Caneel Bay, St. John" 
            required 
          />
        </div>

        <div className="login-field" style={{ marginTop: '1.5rem' }}>
          <label>Descrição do Ativo</label>
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="Descreva as características exclusivas..."
            style={{ 
              width: '100%', minHeight: '100px', background: 'rgba(248,250,252,0.03)', 
              border: '1px solid rgba(248,250,252,0.1)', borderRadius: '6px', color: 'white',
              padding: '0.75rem', outline: 'none'
            }}
          />
        </div>

        <div style={{ marginTop: '2rem' }}>
          <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', color: 'rgba(248,250,252,0.35)', marginBottom: '0.75rem' }}>
            Fotos do Ativo ({images.length})
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {images.map((img, i) => (
              <div key={i} style={{ width: '80px', height: '80px', borderRadius: '6px', backgroundImage: `url(${img})`, backgroundSize: 'cover' }}></div>
            ))}
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{ 
                width: '80px', height: '80px', borderRadius: '6px', border: '2px dashed rgba(248,250,252,0.1)',
                background: 'rgba(248,250,252,0.02)', color: 'rgba(248,250,252,0.3)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
              }}
            >
              +
            </button>
          </div>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
        </div>

        <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
          <button 
            type="submit" 
            className="login-submit-btn" 
            style={{ flex: 1 }}
            disabled={uploading || !title || !price}
          >
            {uploading ? '⏳ Carregando Ativo...' : '✦ Publicar Anúncio'}
          </button>
          <button 
            type="button" 
            onClick={onCancel}
            style={{ padding: '0 2rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '6px', cursor: 'pointer' }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
