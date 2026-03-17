# SOP: User Profile Validation (Publication Guard)

## Overview
This SOP defines the logic for enforcing profile completeness before a user can perform primary actions (like listing an asset).

## 1. Required Fields
A profile is considered **Complete** if and only if the following fields are non-empty:
- `name`
- `phone`
- `nif` (Tax Identification Number)
- `address`

## 2. Logic Implementation
```typescript
const isProfileComplete = (user: UserAccount): boolean => {
  return !!(user.name && user.phone && user.nif && user.address);
};
```

## 3. Behavioral Rules
- **UI Block**: If `isProfileComplete` is `false`, the `AssetUpload` component must be disabled or hidden.
- **CTA Prompt**: Display a professional call-to-action guiding the user to the "Perfil" tab.

## 4. Triggers
- **Trigger**: User navigates to "Meus Anúncios" or "Listar Ativo".
- **Condition**: `!isProfileComplete`.
- **Outcome**: Display Guard View.
