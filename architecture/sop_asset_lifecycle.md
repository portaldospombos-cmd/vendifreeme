# SOP: Asset Lifecycle Management

## Overview
This SOP defines the deterministic transitions for asset status in the Vendifree marketplace.

## 1. Status Definitions
- **Disponível**: Default state after successful upload and admin approval.
- **Reservado**: Temporary block after a user performs a "Reserva" action.
- **Em Negociação**: Active state when a "Proposta" is submitted and accepted for review.
- **Vendido / Alugado**: Terminal state after transaction completion.

## 2. Transition Rules (State Machine)
- `disponível` → `reservado`: Triggered by `Booking(type='reserva')`.
- `reservado` → `negociação`: Triggered by `Proposal submission` or manual admin update.
- `negociação` → `vendido/alugado`: Triggered by `Booking(status='completed')`.
- `negociação` → `disponível`: Triggered if investigation/negotiation fails or expires.

## 3. UI Updates
- Status flags must be updated everywhere (Listings, Search, Dashboard) within the same re-render or session update.
