import React from 'react';
import { Booking, AdminStats } from '../types';

interface AdminDashboardProps {
  stats: AdminStats;
  recentBookings: Booking[];
}

const REVENUE_BARS = [
  { month: 'Oct', value: 180000 },
  { month: 'Nov', value: 240000 },
  { month: 'Dec', value: 320000 },
  { month: 'Jan', value: 190000 },
  { month: 'Feb', value: 284750 },
  { month: 'Mar', value: 410000 },
];

const MAX_REV = Math.max(...REVENUE_BARS.map(r => r.value));

function statusClass(status: string): string {
  const map: Record<string, string> = {
    confirmed: 'status-confirmed',
    pending: 'status-pending',
    completed: 'status-completed',
    cancelled: 'status-cancelled',
  };
  return map[status] || '';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats, recentBookings }) => {
  return (
    <div>
      <div className="admin-page-title">Analytics & Gestão em Tempo Real</div>
      <div className="admin-page-sub">Monitorização detalhada de ativos, propostas e embaixadores Vendifree</div>

      {/* Main Stats Summary */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Receita Acumulada</div>
          <div className="stat-value">€{(stats.totalRevenue / 1000000).toFixed(2)}M</div>
          <div className="stat-sub">Vendas e Alugueres</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Receita Premium</div>
          <div className="stat-value">€{(stats.premiumRevenue / 1000).toFixed(1)}K</div>
          <div className="stat-sub">Ads e Destaques</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Comissões Rede</div>
          <div className="stat-value">€{(stats.commissionRevenue / 1000).toFixed(1)}K</div>
          <div className="stat-sub">Parceiros Globais</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Propostas Pendentes</div>
          <div className="stat-value" style={{ color: 'var(--gold)' }}>{stats.pendingProposals}</div>
          <div className="stat-sub">Aguardam resposta</div>
        </div>
      </div>

      <div className="dash-grid">
        {/* Ativos por Status - Real Time */}
        <div className="dash-card">
          <div className="dash-card-title">Inventário & Status do Negócio</div>
          <div className="status-metric-grid">
            <div className="status-metric">
              <span className="dot" style={{ background: '#10b981' }} />
              <span className="label">Disponível</span>
              <span className="val">{stats.byStatus.disponível}</span>
            </div>
            <div className="status-metric">
              <span className="dot" style={{ background: '#f59e0b' }} />
              <span className="label">Reservado</span>
              <span className="val">{stats.byStatus.reservado}</span>
            </div>
            <div className="status-metric">
              <span className="dot" style={{ background: 'var(--gold)' }} />
              <span className="label">Negociação</span>
              <span className="val">{stats.byStatus.negociação}</span>
            </div>
            <div className="status-metric">
              <span className="dot" style={{ background: '#ef4444' }} />
              <span className="label">Vendido</span>
              <span className="val">{stats.byStatus.vendido}</span>
            </div>
            <div className="status-metric">
              <span className="dot" style={{ background: '#3b82f6' }} />
              <span className="label">Alugado</span>
              <span className="val">{stats.byStatus.alugado}</span>
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(248,250,252,0.02)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(248,250,252,0.4)', textAlign: 'center' }}>
              <strong>Eficácia de Fecho:</strong> {((stats.completedDeals / (stats.completedDeals + stats.pendingProposals)) * 100).toFixed(1)}% das propostas resultam em negócio.
            </div>
          </div>
        </div>

        {/* Ranking Embaixadores */}
        <div className="dash-card">
          <div className="dash-card-title">Top Embaixadores (Ranking)</div>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {[
              { name: 'Carlos Ferreira', score: 9.6, deals: 15, rev: '820K' },
              { name: 'Maria Santos', score: 9.2, deals: 8, rev: '450K' },
              { name: 'Julian Thorne', score: 8.9, deals: 12, rev: '320K' },
              { name: 'Elena Rossi', score: 8.5, deals: 5, rev: '280K' },
            ].map((amb, i) => (
              <div key={amb.name} className="ranking-item">
                <div className="rank-num">{i + 1}</div>
                <div className="amb-info">
                  <div className="amb-name">{amb.name}</div>
                  <div className="amb-meta">{amb.deals} negócios concluídos</div>
                </div>
                <div className="amb-score">
                  <div className="score-val">{amb.score}</div>
                  <div className="score-label">Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dash-card" style={{ gridColumn: '1 / -1' }}>
          <div className="dash-card-title">Atividade Recente & Auditoria</div>
          <table className="admin-table" style={{ marginTop: '0.5rem' }}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Interessado</th>
                <th>Ativo</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.slice(0, 5).map(b => (
                <tr key={b.id}>
                  <td style={{ fontSize: '0.75rem', color: 'rgba(248,250,252,0.4)' }}>{b.createdAt}</td>
                  <td>{b.guestName}</td>
                  <td style={{ fontWeight: 600 }}>{b.propertyTitle}</td>
                  <td>{b.type.toUpperCase()}</td>
                  <td style={{ color: 'var(--gold)' }}>€{b.totalPrice.toLocaleString()}</td>
                  <td>
                    <span className={`booking-status ${statusClass(b.status)}`}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
