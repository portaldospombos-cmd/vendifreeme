import React, { useState } from 'react';
import { Property } from '../types';

interface BookingModalProps {
  property: Property;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ property, onClose }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const isForSale = property.priceUnit === 'sale';

  function calcTotal(): number {
    if (isForSale) return property.price;
    if (!checkIn || !checkOut) return property.price;
    const nights = Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));
    const multiplier = property.priceUnit === 'week' ? Math.ceil(nights / 7) : nights;
    return property.price * Math.max(1, multiplier);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep('success');
  }

  const total = calcTotal();

  if (step === 'success') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" onClick={e => e.stopPropagation()}>
          <div className="modal-success">
            <span className="modal-success-icon">✦</span>
            <div className="modal-success-title">Request Received</div>
            <p className="modal-success-text">
              Thank you, <strong style={{ color: 'rgba(248,250,252,0.8)' }}>{name}</strong>!<br />
              Our concierge team will contact you within 2 hours to confirm your booking for{' '}
              <strong style={{ color: 'rgba(248,250,252,0.8)' }}>{property.title}</strong>.
            </p>
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(201,168,76,0.1)', borderRadius: '6px', border: '1px solid rgba(201,168,76,0.2)' }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Reference Number</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'rgba(201,168,76,1)', fontFamily: 'monospace' }}>
                USVI-{Date.now().toString().slice(-6)}
              </div>
            </div>
            <button className="btn-luxury" style={{ marginTop: '1.5rem', width: '100%' }} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-title">{isForSale ? 'Request Property Viewing' : 'Book Now'}</div>
        <div className="modal-subtitle">{property.title}</div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-row">
            <div className="modal-field">
              <label>Full Name</label>
              <input
                type="text" required value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alexander Smith"
              />
            </div>
            <div className="modal-field">
              <label>Email</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alex@email.com"
              />
            </div>
          </div>

          {!isForSale && (
            <>
              <div className="modal-row">
                <div className="modal-field">
                  <label>Check-in</label>
                  <input type="date" required value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                </div>
                <div className="modal-field">
                  <label>Check-out</label>
                  <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                </div>
              </div>
              <div className="modal-field">
                <label>Guests</label>
                <input
                  type="number" min={1} max={property.guests || 20}
                  value={guests} onChange={e => setGuests(Number(e.target.value))}
                />
              </div>
            </>
          )}

          <div className="modal-total">
            <div>
              <div className="modal-total-label">{isForSale ? 'Listing Price' : 'Estimated Total'}</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.3)' }}>
                {isForSale ? 'Final price negotiated privately' : 'Subject to availability confirmation'}
              </div>
            </div>
            <div className="modal-total-amount">
              ${total >= 1000000 ? `${(total / 1000000).toFixed(2)}M` : total.toLocaleString()}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-confirm">
              {isForSale ? '📩 Request Viewing' : '✦ Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
