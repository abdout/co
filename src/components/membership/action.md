# Membership Actions API

This file documents the server actions for handling membership application status, onboarding status, and role-based logic in the membership system.

## Features
- **Application Status Control**
  - Initial status is `PENDING`.
  - Approve: Sets status to `APPROVED`.
  - Redo: If already approved, clicking approve again resets status to `PENDING`.
  - Reject: Sets status to `REJECTED`.
- **Access Control**
  - All authenticated users can approve, reject, redo, or set onboarding status for applications.
- **Onboarding Status Control**
  - Set onboarding status for a user.

---

## API

### `approveUserApplication(userId: string)`
- **Description:** Sets `applicationStatus` to `APPROVED` for the given user. If already approved, use `redoUserApplication` to reset to `PENDING`.
- **Access:** Any authenticated user
- **Returns:** `{ success: true }` or `{ error: string }`

### `rejectUserApplication(userId: string)`
- **Description:** Sets `applicationStatus` to `REJECTED` for the given user.
- **Access:** Any authenticated user
- **Returns:** `{ success: true }` or `{ error: string }`

### `redoUserApplication(userId: string)`
- **Description:** Resets `applicationStatus` to `PENDING` for the given user.
- **Access:** Any authenticated user
- **Returns:** `{ success: true }` or `{ error: string }`

### `setOnboardingStatus(userId: string, status: string)`
- **Description:** Sets the `onboardingStatus` for the given user.
- **Access:** Any authenticated user
- **Returns:** `{ success: true }` or `{ error: string }`

---

## Example Usage

```ts
import { approveUserApplication, rejectUserApplication, redoUserApplication, setOnboardingStatus } from "@/components/membership/action";

// Approve a user
await approveUserApplication(userId);

// Reject a user
await rejectUserApplication(userId);

// Redo (reset to pending)
await redoUserApplication(userId);

// Set onboarding status
await setOnboardingStatus(userId, "COMPLETED");
```

---

## Progress
- [x] Approve, reject, and redo actions implemented
- [x] All authenticated users can perform actions
- [x] Onboarding status setter
- [ ] UI integration for redo button (handled in component logic)
- [ ] Error handling in UI 