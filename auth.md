# Authentication System Documentation

## Overview

This project implements a comprehensive authentication system using **NextAuth.js v5** with multiple authentication providers, two-factor authentication (2FA), email verification, and role-based access control. The system is built on top of a PostgreSQL database using Prisma ORM.

## Architecture Overview

### Core Components

1. **NextAuth.js Configuration** (`auth.ts`, `auth.config.ts`)
2. **Middleware Protection** (`middleware.ts`)
3. **Database Schema** (`prisma/schema.prisma`)
4. **Authentication Components** (`src/components/auth/`)
5. **Route Protection** (`routes.ts`)
6. **Email Services** (`src/lib/mail.ts`)
7. **Token Management** (`src/lib/tokens.ts`)

## Authentication Providers

### 1. Credentials Provider
- **File**: `auth.config.ts:45-58`
- **Validation**: Uses Zod schema validation (`LoginSchema`)
- **Password Hashing**: bcryptjs for password comparison
- **Flow**:
  1. Validates email/password format
  2. Retrieves user by email
  3. Compares hashed password
  4. Returns user object if valid

### 2. Google OAuth Provider
- **File**: `auth.config.ts:11-25`
- **Configuration**:
  - Client ID/Secret from environment variables
  - Consent prompt for offline access
  - Custom profile mapping to include username
  - Auto email verification for OAuth users

### 3. Facebook OAuth Provider
- **File**: `auth.config.ts:26-37`
- **Configuration**:
  - Client ID/Secret from environment variables
  - Custom profile mapping
  - Fallback email generation for users without email
  - Auto email verification

## Database Schema

### User Model
```prisma
model User {
  id                    String                 @id @default(cuid())
  username              String?
  email                 String?                @unique
  emailVerified         DateTime?
  image                 String?
  password              String?
  role                  UserRole              @default(USER)
  accounts              Account[]
  isTwoFactorEnabled    Boolean               @default(false)
  twoFactorConfirmation TwoFactorConfirmation?
  teams                 Team[]                @relation("TeamMembers")
}
```

### Authentication-Related Models

1. **Account**: OAuth provider account linking
2. **VerificationToken**: Email verification tokens
3. **PasswordResetToken**: Password reset tokens
4. **TwoFactorToken**: 2FA verification codes
5. **TwoFactorConfirmation**: 2FA session confirmation

### User Roles
```prisma
enum UserRole {
  ADMIN
  USER
}
```

## Authentication Flow

### 1. Registration Flow
**File**: `src/components/auth/join/action.ts`

1. **Validation**: Zod schema validation (`RegisterSchema`)
2. **Duplicate Check**: Verify email doesn't exist
3. **Password Hashing**: bcryptjs with salt rounds of 10
4. **User Creation**: Store in database
5. **Email Verification**: Generate token and send verification email

```typescript
// Registration validation schema
export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});
```

### 2. Login Flow
**File**: `src/components/auth/login/action.ts`

#### Standard Login
1. **Validation**: Email/password format validation
2. **User Lookup**: Find user by email
3. **Email Verification Check**: Ensure email is verified
4. **2FA Check**: Handle two-factor authentication if enabled
5. **Credential Verification**: Password comparison
6. **Session Creation**: NextAuth session establishment

#### Two-Factor Authentication Flow
1. **First Login Attempt**: Generate and send 2FA token
2. **Token Verification**: Validate 6-digit code
3. **Confirmation Creation**: Create 2FA confirmation record
4. **Session Establishment**: Complete login process

### 3. OAuth Flow
**File**: `auth.ts:47-56`

1. **Provider Redirect**: User redirects to OAuth provider
2. **Authorization**: User grants permissions
3. **Account Linking**: Link OAuth account to user
4. **Email Verification**: Auto-verify email for OAuth users
5. **Session Creation**: Establish authenticated session

## Session Management

### JWT Strategy
**File**: `auth.ts:125`
```typescript
session: { strategy: "jwt" }
```

### Session Callbacks
**File**: `auth.ts:88-108`

#### JWT Callback
- Enriches JWT token with user data
- Fetches fresh user data on each request
- Includes role, 2FA status, and OAuth status

#### Session Callback
- Maps JWT token data to session object
- Provides type-safe session data to client

### Extended Session Type
**File**: `next-auth.d.ts`
```typescript
interface Session extends DefaultSession {
  user: {
    id: string
    role: UserRole
    isTwoFactorEnabled: boolean
    isOAuth: boolean
  } & DefaultSession["user"]
}
```

## Route Protection

### Middleware Protection
**File**: `middleware.ts`

#### Route Categories
1. **Public Routes**: Accessible without authentication
   - `/`, `/new-verification`, `/admin`, `/client`, `/server`, `/setting`

2. **Auth Routes**: Redirect authenticated users
   - `/login`, `/register`, `/error`, `/reset`, `/new-password`

3. **Protected Platform Routes**: Require authentication
   - `/dashboard/*`, `/project/*`, `/task/*`, `/wallet/*`, `/daily/*`, `/resource/*`

4. **API Auth Routes**: NextAuth internal endpoints
   - `/api/auth/*`

#### Protection Logic
```typescript
// Platform route protection
if (isPlatformRoute && !isLoggedIn) {
  const callbackUrl = pathname + nextUrl.search
  const encodedCallbackUrl = encodeURIComponent(callbackUrl)
  return Response.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl))
}
```

### Layout-Level Protection
**File**: `src/app/(platform)/layout.tsx:30-35`

Server-side authentication check at layout level:
```typescript
const session = await auth();
if (!session) {
  redirect('/login?callbackUrl=/dashboard');
}
```

## Email Services

### Email Provider
**Service**: Resend API
**Configuration**: `src/lib/mail.ts`

### Email Types

1. **Verification Email**
   - Sent during registration
   - 24-hour expiration
   - Confirms email ownership

2. **Password Reset Email**
   - Sent on password reset request
   - 1-hour expiration
   - Secure token-based reset

3. **Two-Factor Authentication Email**
   - 6-digit numeric code
   - 5-minute expiration
   - Required for 2FA-enabled accounts

## Token Management

### Token Types
**File**: `src/lib/tokens.ts`

1. **Verification Token**
   - UUID format
   - 24-hour expiration
   - Email verification

2. **Password Reset Token**
   - UUID format
   - 1-hour expiration
   - Password reset flow

3. **Two-Factor Token**
   - 6-digit numeric code
   - 5-minute expiration
   - 2FA verification

### Token Generation
```typescript
// 2FA Token Example
export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);
  // ... database operations
}
```

## Security Features

### 1. Password Security
- **Hashing**: bcryptjs with salt rounds of 10
- **Minimum Length**: 6 characters
- **Validation**: Zod schema validation

### 2. Session Security
- **HTTP-Only Cookies**: Prevent XSS attacks
- **Secure Cookies**: HTTPS in production
- **SameSite**: Lax policy for CSRF protection

### 3. Token Security
- **Expiration**: All tokens have expiration times
- **Single Use**: Tokens deleted after use
- **Cryptographic**: Secure random generation

### 4. Two-Factor Authentication
- **Optional**: User can enable/disable
- **Time-Limited**: 5-minute token expiration
  - **Numeric Codes**: 6-digit verification codes## Environment Variables### Required Variables**File**: `src/lib/env-check.ts````bash# OAuth ProvidersFACEBOOK_CLIENT_ID=FACEBOOK_CLIENT_SECRET=GOOGLE_CLIENT_ID=GOOGLE_CLIENT_SECRET=# NextAuthAUTH_SECRET=NEXT_PUBLIC_APP_URL=# DatabaseDATABASE_URL=# Email ServiceRESEND_API_KEY=```## Dependencies### Core Authentication DependenciesTo implement this authentication system in another project, you'll need to install the following packages using **pnpm**:#### Required Dependencies```bashpnpm add next-auth@5.0.0-beta.25pnpm add @auth/prisma-adapter@^2.8.0pnpm add @prisma/client@6.5.0pnpm add prisma@^6.5.0pnpm add bcryptjs@^3.0.0pnpm add resend@^4.1.2pnpm add zod@^3.24.2pnpm add uuid@^11.0.5pnpm add react-hook-form@^7.54.2pnpm add @hookform/resolvers@^4.1.3```#### Required Dev Dependencies```bashpnpm add -D @types/bcryptjs@^2.4.6pnpm add -D @types/uuid@^10.0.0```### Package Details| Package | Version | Purpose ||---------|---------|---------|| `next-auth` | `5.0.0-beta.25` | Core authentication library for Next.js || `@auth/prisma-adapter` | `^2.8.0` | Prisma adapter for NextAuth.js || `@prisma/client` | `6.5.0` | Prisma client for database operations || `prisma` | `^6.5.0` | Prisma CLI and schema management || `bcryptjs` | `^3.0.0` | Password hashing library || `resend` | `^4.1.2` | Email service provider || `zod` | `^3.24.2` | Runtime type validation and schema validation || `uuid` | `^11.0.5` | UUID generation for tokens || `react-hook-form` | `^7.54.2` | Form handling and validation || `@hookform/resolvers` | `^4.1.3` | Zod resolver for react-hook-form |### Optional UI DependenciesIf you want to use the same UI components, also install:```bashpnpm add @radix-ui/react-dropdown-menu@^2.1.6pnpm add @radix-ui/react-dialog@^1.1.6pnpm add @radix-ui/react-label@^2.1.2pnpm add @radix-ui/react-avatar@^1.1.3pnpm add @radix-ui/react-switch@^1.1.3pnpm add lucide-react@^0.475.0pnpm add sonner@^2.0.1pnpm add class-variance-authority@^0.7.1pnpm add tailwind-merge@^3.0.1pnpm add clsx@^2.1.1```### Database SetupYou'll also need to set up a PostgreSQL database. The authentication system is configured to work with:- **PostgreSQL** (via `DATABASE_URL`)- **Prisma ORM** for database operations- **Neon Database** (optional, for serverless deployment)### Installation CommandsFor a fresh project, run these commands in order:```bash# Install core auth dependenciespnpm add next-auth@5.0.0-beta.25 @auth/prisma-adapter@^2.8.0# Install database dependenciespnpm add @prisma/client@6.5.0 prisma@^6.5.0# Install security and validationpnpm add bcryptjs@^3.0.0 zod@^3.24.2 uuid@^11.0.5# Install form handlingpnpm add react-hook-form@^7.54.2 @hookform/resolvers@^4.1.3# Install email servicepnpm add resend@^4.1.2# Install dev dependenciespnpm add -D @types/bcryptjs@^2.4.6 @types/uuid@^10.0.0# Initialize Prismapnpx prisma init```### Single Command InstallationYou can also install all required dependencies at once:```bash# Core auth dependenciespnpm add next-auth@5.0.0-beta.25 @auth/prisma-adapter@^2.8.0 @prisma/client@6.5.0 prisma@^6.5.0 bcryptjs@^3.0.0 resend@^4.1.2 zod@^3.24.2 uuid@^11.0.5 react-hook-form@^7.54.2 @hookform/resolvers@^4.1.3# Dev dependenciespnpm add -D @types/bcryptjs@^2.4.6 @types/uuid@^10.0.0```### Version Compatibility Notes- **NextAuth.js v5**: This implementation uses the beta version of NextAuth.js v5, which has breaking changes from v4- **React 19**: The project uses React 19, but the auth system is compatible with React 18+- **Next.js 15**: Uses Next.js 15 with App Router, but compatible with Next.js 13.4+- **Prisma 6**: Uses Prisma 6, which requires Node.js 18.18+- **pnpm**: This project uses pnpm as the package manager for faster installs and better disk efficiency## Utility Functions

### Current User Helpers
**File**: `src/lib/auth.ts`

```typescript
export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();
  return session?.user?.role;
};
```

### Client-Side Hooks
**Files**: `src/components/auth/use-current-user.ts`, `src/components/auth/use-current-role.ts`

```typescript
export const useCurrentUser = () => {
  const session = useSession();
  return session.data?.user;
};

export const useCurrentRole = () => {
  const session = useSession();
  return session.data?.user?.role;
};
```

## Role-Based Access Control

### Role Gate Component
**File**: `src/components/auth/role-gate.tsx`

Provides component-level role protection:
```typescript
interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}
```

### Admin Actions
**File**: `src/components/auth/admin-action.ts`

Server actions restricted to admin users.

## Error Handling

### Authentication Errors
**File**: `auth.ts:95-105`

Handles various authentication error types:
- `CredentialsSignin`: Invalid credentials
- Generic errors: Fallback error handling

### Form Validation
**Components**: `form-error.tsx`, `form-success.tsx`

Provides user feedback for authentication operations.

## UI Components

### Authentication Forms
1. **Login Form**: `src/components/auth/login/form.tsx`
2. **Registration Form**: `src/components/auth/join/form.tsx`
3. **Verification Form**: `src/components/auth/verification/form.tsx`

### User Interface
1. **User Button**: Dropdown with user info and logout
2. **Login Button**: Redirect to login page
3. **Logout Button**: Sign out functionality
4. **Social Buttons**: OAuth provider buttons

## API Routes

### NextAuth Endpoints
**File**: `src/app/api/auth/[...nextauth]/route.ts`

Exports NextAuth handlers for:
- `/api/auth/signin`
- `/api/auth/signout`
- `/api/auth/callback/*`
- `/api/auth/session`

## Development and Debugging

### Debug Mode
**File**: `auth.ts:139`
```typescript
debug: true, // Enabled for detailed error information
```

### Logging
Comprehensive logging throughout the authentication flow:
- Sign-in attempts
- OAuth account linking
- Email sending operations
- Error tracking

## Best Practices Implemented

1. **Type Safety**: Full TypeScript integration with extended types
2. **Validation**: Zod schemas for all form inputs
3. **Security**: Proper password hashing and token management
4. **User Experience**: Comprehensive error handling and feedback
5. **Scalability**: Modular component architecture
6. **Monitoring**: Extensive logging for debugging

## Common Authentication Flows

### New User Registration
1. User fills registration form
2. Form validation (client + server)
3. Check for existing email
4. Hash password and create user
5. Generate verification token
6. Send verification email
7. User clicks email link
8. Email verified, user can login

### Existing User Login
1. User enters credentials
2. Validate email/password format
3. Check if email is verified
4. Handle 2FA if enabled
5. Verify password
6. Create session
7. Redirect to dashboard

### OAuth Login
1. User clicks OAuth provider button
2. Redirect to provider
3. User authorizes application
4. Provider redirects back with code
5. Exchange code for tokens
6. Create/link user account
7. Auto-verify email
8. Create session

This authentication system provides a robust, secure, and user-friendly authentication experience with support for multiple authentication methods, comprehensive security features, and proper error handling. 