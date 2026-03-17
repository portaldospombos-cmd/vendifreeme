# SOP: Automated Commission Calculation

## Overview
This SOP defines the deterministic logic for calculating and distributing commissions within the Vendifree platform.

## 1. Input Data
- `totalValue`: The gross sale or rental price of the asset.
- `ambassadorId`: The unique identifier of the referring Ambassador.
- `commissionPercent`: Default is 0.30 (30%) of the gross value, or as defined in the Ambassador's contract.

## 2. Calculation Logic
1. **Gross Commission**: `totalValue * commissionPercent`.
2. **Net Amount to Seller**: `totalValue - Gross Commission - Service Fees`.
3. **Platform Share**: Variable percentage from `Gross Commission` (e.g., 20% of the commission stays with the platform, 80% to the Ambassador).

## 3. Triggers
- **Trigger A**: Status of `Booking` changes to `completed`.
- **Action**: Generate `Commission Ledger` entry and notification to Ambassador.

## 4. Edge Cases
- **Cancelled Deal**: If status changes from `negociação` to `cancelled`, no ledger entry is created.
- **Partial Payments**: Commissions are only calculated on the `totalValue` once the transaction is marked as fully paid.
