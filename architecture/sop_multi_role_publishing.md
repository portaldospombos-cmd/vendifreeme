# SOP: Multi-Role Asset Publication

## Overview
This SOP defines the unified logic for asset publication across all user roles (User, Ambassador, Admin).

## 1. Access Control
- **User**: Locked by `sop_user_guard.md` (requires complete profile).
- **Ambassador**: Requires `active` status. Can list assets for their portfolio.
- **Admin**: Full access. Can list assets on behalf of corporate or sellers.

## 2. Implementation Logic
- All roles utilize the `AssetUpload` component.
- The `role` prop in `AssetUpload` determines the initial status:
  - `user` -> `pending_approval`
  - `ambassador` -> `disponível` (pre-verified trust)
  - `admin` -> `disponível`

## 3. Data Flow
- `onSuccess` callback must trigger a global state update or dashboard refresh to show the new listing in the correct context.
