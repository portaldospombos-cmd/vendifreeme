import React, { useState } from 'react';
import { UserTab } from '../types';
import { useAuth } from './AuthContext';
import { BOOKINGS } from '../data';

import { AssetUpload } from './AssetUpload';
import { GiftCardStore } from './GiftCardStore';
import { GiftCardModal } from './GiftCardModal';
import { GIFT_CARDS } from '../data';
import { GiftCard } from '../types';

export const UserPanel: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const [tab, setTab] = useState<UserTab>('user-bookings');
  
  // Profile form state
  const [editingProfile, setEditingProfile] = useState(false);
  const [myGifts, setMyGifts] = useState<GiftCard[]>(GIFT_CARDS);
  const [selectedGift, setSelectedGift] = useState<GiftCard | null>(null);
  const [showGiftStore, setShowGiftStore] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    nif: currentUser?.nif || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    postalCode: currentUser?.postalCode || '',
  });

  const handleUploadSuccess = (newAsset: any) => {
    alert(`Sucesso! O seu anúncio "${newAsset.title}" foi carregado e está em processamento.`);
    setTab('user-listings');
  };

  const handleSaveProfile = () => {
    updateProfile(profileForm);
    setEditingProfile(false);
    alert('Perfil atualizado com sucesso profissional.');
  };

  const myBookings = BOOKINGS.filter(
    b => b.guestName === currentUser?.name || b.guestEmail === currentUser?.email
  );

  const isProfileComplete = !!(currentUser?.phone && currentUser?.nif && currentUser?.address);

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-sidebar-title">Gestão de Conta</div>
        {[
          { key: 'user-bookings', label: 'Reservas' },
          { key: 'user-listings', label: 'Meus Anúncios' },
          { key: 'user-gifts', label: 'Gift Cards Luxury' },
          { key: 'user-favourites', label: 'Favoritos' },
          { key: 'user-profile', label: 'Perfil' },
        ].map(item => (
          <button
            key={item.key}
            className={`admin-nav-item ${tab === item.key ? 'active' : ''}`}
            onClick={() => setTab(item.key as UserTab)}
          >
            <span style={{ fontWeight: 500 }}>{item.label}</span>
          </button>
        ))}

        <div className="sidebar-divider" />
        <div className="admin-sidebar-title">Resumo Financeiro</div>
        <div className="sidebar-stats">
          <div className="sidebar-stat-item">
            <div className="sidebar-stat-label">Ativos Reservados</div>
            <div className="sidebar-stat-value">{myBookings.length}</div>
          </div>
          <div className="sidebar-stat-item">
            <div className="sidebar-stat-label">Investimento Total</div>
            <div className="sidebar-stat-value">
              €{myBookings.reduce((s, b) => s + b.totalPrice, 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="admin-content">
        {/* BOOKINGS */}
        {tab === 'user-bookings' && (
          <div>
            <div className="admin-page-title">Painel do Investidor: {currentUser?.name}</div>
            <div className="admin-page-sub">Monitorização de reservas e propostas em curso</div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Volume de Reservas</div>
                <div className="stat-value">{myBookings.length}</div>
                <div className="stat-sub">Histórico Vendifree</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Nível de Acesso</div>
                <div className="stat-value">Premium</div>
                <div className="stat-sub">Early Entry Ativo</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Valor sob Gestão</div>
                <div className="stat-value">€{myBookings.reduce((s, b) => s + b.totalPrice, 0).toLocaleString()}</div>
                <div className="stat-sub">Capital Alocado</div>
              </div>
            </div>

            <div className="dash-card" style={{ marginTop: '1.5rem' }}>
              <div className="dash-card-title">Registo de Atividade</div>
              {myBookings.length === 0 ? (
                <div style={{ color: 'rgba(248,250,252,0.4)', fontSize: '0.85rem', padding: '1rem 0' }}>
                  Sem reservas ativas no momento. Explore o marketplace para novas oportunidades.
                </div>
              ) : (
                myBookings.map(booking => (
                  <div key={booking.id} className="booking-item">
                    <div>
                      <div className="booking-guest">{booking.propertyTitle}</div>
                      <div className="booking-prop">
                        {booking.checkIn} {booking.checkOut ? `→ ${booking.checkOut}` : ''} · {booking.guests} convidados
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div className="booking-amount">
                        €{booking.totalPrice >= 1000000
                          ? `${(booking.totalPrice / 1000000).toFixed(2)}M`
                          : booking.totalPrice.toLocaleString()}
                      </div>
                      <span className={`booking-status status-${booking.status}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* FAVOURITES */}
        {tab === 'user-favourites' && (
          <div>
            <div className="admin-page-title">Ativos em Observação</div>
            <div className="admin-page-sub">Oportunidades guardadas para análise de investimento</div>

            <div className="dash-card" style={{ maxWidth: '600px' }}>
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(248,250,252,0.4)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--gold)' }}>✦</div>
                <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Lista de Favoritos Vazia</div>
                <div style={{ fontSize: '0.75rem' }}>Marque os ativos com a estrela para os visualizar aqui.</div>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE / CADASTRO COMPLETO */}
        {tab === 'user-profile' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div>
                <div className="admin-page-title">Cadastro de Cliente</div>
                <div className="admin-page-sub">Gestão de credenciais e informações de faturação</div>
              </div>
              {!editingProfile && (
                <button className="btn-luxury" style={{ fontSize: '0.7rem' }} onClick={() => setEditingProfile(true)}>
                  Editar Informações
                </button>
              )}
            </div>

            <div className="dash-card" style={{ maxWidth: '700px' }}>
              {!editingProfile ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  {[
                    { label: 'Nome Completo', value: currentUser?.name },
                    { label: 'E-mail', value: currentUser?.email },
                    { label: 'Telefone / Contacto', value: currentUser?.phone || 'Não definido' },
                    { label: 'NIF / Contribuinte', value: currentUser?.nif || 'Não definido' },
                    { label: 'Morada Completa', value: currentUser?.address || 'Não definida' },
                    { label: 'Cidade', value: currentUser?.city || 'Não definida' },
                    { label: 'Código Postal', value: currentUser?.postalCode || 'Não definido' },
                    { label: 'Tipo de Membro', value: 'Investidor Premium' },
                  ].map(field => (
                    <div key={field.label}>
                      <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(248,250,252,0.35)', marginBottom: '0.3rem' }}>{field.label}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--white-pearl)' }}>{field.value}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block' }}>Nome Completo</label>
                    <input type="text" className="booking-input" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block' }}>Telefone</label>
                    <input type="text" className="booking-input" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block' }}>NIF</label>
                    <input type="text" className="booking-input" value={profileForm.nif} onChange={e => setProfileForm({...profileForm, nif: e.target.value})} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block' }}>Morada</label>
                    <input type="text" className="booking-input" value={profileForm.address} onChange={e => setProfileForm({...profileForm, address: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block' }}>Cidade</label>
                    <input type="text" className="booking-input" value={profileForm.city} onChange={e => setProfileForm({...profileForm, city: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block' }}>Código Postal</label>
                    <input type="text" className="booking-input" value={profileForm.postalCode} onChange={e => setProfileForm({...profileForm, postalCode: e.target.value})} />
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button className="btn-luxury" style={{ flex: 1 }} onClick={handleSaveProfile}>Guardar Alterações</button>
                    <button className="btn-luxury" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white' }} onClick={() => setEditingProfile(false)}>Cancelar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MY LISTINGS / UPLOAD */}
        {tab === 'user-listings' && (
          <div>
            <div className="admin-page-title">Centro de Publicação Vendifree</div>
            <div className="admin-page-sub">Qualquer utilizador pode publicar ativos gratuitamente no marketplace global</div>
            
            <div style={{ marginTop: '2rem' }}>
              {isProfileComplete ? (
                <AssetUpload role="user" onCancel={() => setTab('user-bookings')} onSuccess={handleUploadSuccess} />
              ) : (
                <div className="dash-card" style={{ maxWidth: '600px', textAlign: 'center', padding: '4rem 2rem', border: '1px dashed rgba(201,168,76,0.3)' }}>
                  <div style={{ fontSize: '2.5rem', color: 'var(--gold)', marginBottom: '1.5rem', opacity: 0.8 }}>✦</div>
                  <h3 style={{ color: 'var(--white-pearl)', marginBottom: '1rem', fontWeight: 600 }}>Cadastro Incompleto</h3>
                  <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                    Para garantir a segurança e transparência do marketplace Vendifree, 
                    é necessário completar as suas informações de contacto, NIF e morada 
                    antes de publicar o seu primeiro ativo.
                  </p>
                  <button 
                    className="btn-luxury" 
                    onClick={() => setTab('user-profile')}
                    style={{ padding: '0.8rem 2rem' }}
                  >
                    Completar Perfil Agora
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* GIFT CARDS */}
        {tab === 'user-gifts' && (
          <div>
            {!showGiftStore ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="admin-page-title">Meus Luxury Vouchers</div>
                    <div className="admin-page-sub">Ofereça estadias e experiências luxury a quem desejar</div>
                  </div>
                  <button className="btn-luxury" onClick={() => setShowGiftStore(true)}>
                    ✦ Comprar Novo Gift Card
                  </button>
                </div>

                <div className="dash-card" style={{ marginTop: '1.5rem' }}>
                  <div className="dash-card-title">Vouchers Ativos</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                    {myGifts.length > 0 ? myGifts.map(card => (
                      <div 
                        key={card.id} 
                        className="ranking-item" 
                        style={{ cursor: 'pointer', border: '1px solid rgba(201,168,76,0.1)' }}
                        onClick={() => setSelectedGift(card)}
                      >
                        <div style={{ fontSize: '1.5rem', marginRight: '1rem' }}>
                          {card.type === 'stay' ? '🏨' : card.type === 'trip' ? '✈️' : '💎'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: 'var(--white-pearl)' }}>€{card.value}</div>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(248,250,252,0.4)' }}>Cód: {card.code}</div>
                        </div>
                        <div className="amb-score">
                          <div className="score-label" style={{ color: 'var(--gold)' }}>Ver/Enviar</div>
                        </div>
                      </div>
                    )) : (
                      <div style={{ color: 'rgba(248,250,252,0.4)', fontSize: '0.85rem' }}>Ainda não adquiriu nenhum voucher.</div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <GiftCardStore 
                onCancel={() => setShowGiftStore(false)} 
                onPurchase={(card) => {
                  setMyGifts([card, ...myGifts]);
                  setShowGiftStore(false);
                  setSelectedGift(card);
                }} 
              />
            )}
          </div>
        )}

        {selectedGift && (
          <GiftCardModal 
            card={selectedGift} 
            onClose={() => setSelectedGift(null)} 
          />
        )}
      </div>
    </div>
  );
};
