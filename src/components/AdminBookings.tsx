import React, { useState } from 'react';
import { Booking } from '../types';

interface AdminBookingsProps {
  bookings: Booking[];
}

function statusClass(status: string): string {
  const map: Record<string, string> = {
    confirmed: 'status-confirmed',
    pending: 'status-pending',
    completed: 'status-completed',
    cancelled: 'status-cancelled',
  };
  return map[status] || '';
}

export const AdminBookings: React.FC<AdminBookingsProps> = ({ bookings }) => {
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = bookings.filter(b => statusFilter === 'all' || b.status === statusFilter);
  const totalRevenue = filtered.reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div>
      <div className="admin-page-title">Bookings</div>
      <div className="admin-page-sub">Manage all reservations and inquiries</div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '4px',
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              textTransform: 'capitalize',
              cursor: 'pointer',
              border: '1px solid',
              borderColor: statusFilter === s ? 'rgba(201,168,76,0.6)' : 'rgba(255,255,255,0.1)',
              background: statusFilter === s ? 'rgba(201,168,76,0.15)' : 'transparent',
              color: statusFilter === s ? 'rgba(201,168,76,1)' : 'rgba(248,250,252,0.5)',
            }}
          >
            {s === 'all' ? `All (${bookings.length})` : `${s} (${bookings.filter(b => b.status === s).length})`}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'rgba(248,250,252,0.5)' }}>
          Total:
          <span style={{ color: 'rgba(201,168,76,1)', fontWeight: 700 }}>
            ${totalRevenue >= 1000000 ? `${(totalRevenue / 1000000).toFixed(2)}M` : totalRevenue.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Property</th>
              <th>Dates</th>
              <th>Guests</th>
              <th>Value</th>
              <th>Status</th>
              <th>Ambassador</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id}>
                <td>
                  <div style={{ fontWeight: 600, color: 'rgba(248,250,252,0.9)' }}>{b.guestName}</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(248,250,252,0.35)' }}>{b.guestEmail}</div>
                </td>
                <td>{b.propertyTitle}</td>
                <td>
                  <div>{b.checkIn}</div>
                  {b.checkOut !== b.checkIn && (
                    <div style={{ fontSize: '0.7rem', color: 'rgba(248,250,252,0.35)' }}>→ {b.checkOut}</div>
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>{b.guests}</td>
                <td style={{ color: 'rgba(201,168,76,1)', fontWeight: 600 }}>
                  ${b.totalPrice >= 1000000 ? `${(b.totalPrice / 1000000).toFixed(2)}M` : b.totalPrice.toLocaleString()}
                </td>
                <td>
                  <span className={`booking-status ${statusClass(b.status)}`}>{b.status}</span>
                </td>
                <td style={{ color: 'rgba(248,250,252,0.4)', fontSize: '0.72rem' }}>
                  {b.ambassadorId ? `#${b.ambassadorId}` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
