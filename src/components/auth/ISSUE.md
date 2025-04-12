# Authentication Issues Tracker

## Current Issues

### Critical
- [x] Facebook OAuth redirects to error page
  - **Root Cause**: Mismatch between callback URL in Facebook Developer Console and application
  - **Solution**: Update the callback URL in Facebook Developer Console to match `http://localhost:3000/api/auth/callback/facebook` for local development
  - **Status**: In Progress

### High Priority
- [ ] Conflicting Facebook Client ID values in `.env` and `.env.local`
  - **Solution**: Use only one set of Facebook OAuth credentials, preferably in `.env.local` for local development
  - **Status**: Pending

- [ ] Missing error handling in Facebook OAuth profile mapping
  - **Solution**: Add try/catch block in the Facebook profile function in `auth.config.ts`
  - **Status**: Pending

### Medium Priority
- [ ] Improve debugging for OAuth authentication
  - **Solution**: Add more detailed logging in the auth callbacks
  - **Status**: Pending

- [ ] Enhance error messages in auth error page
  - **Solution**: Add more specific error messages based on error types
  - **Status**: Pending

## Planned Enhancements

### Authentication
- [ ] Add more OAuth providers (GitHub, Apple)
- [ ] Implement remember me functionality
- [ ] Add rate limiting for failed login attempts
- [ ] Enhance session security with refresh tokens

### User Management
- [ ] Create admin dashboard for user management
- [ ] Add user profile customization options
- [ ] Implement account deletion functionality

### Security
- [ ] Regular security audit of authentication flow
- [ ] Implement CSRF protection
- [ ] Set up monitoring for suspicious login activities

## Completed Tasks
- [x] Basic NextAuth setup with Google OAuth
- [x] Facebook OAuth provider integration
- [x] Email/password authentication
- [x] Two-factor authentication
- [x] Email verification flow
- [x] Password reset functionality
- [x] Role-based access control

## Testing Notes
- When testing OAuth login, ensure you're using the correct environment variables
- Facebook OAuth requires testing with valid app credentials and proper callback URL configuration
- Test all auth flows (login, register, reset password, 2FA) in development before deploying
