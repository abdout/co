import { User } from '@prisma/client';

export const mockUser: User = {
    id: '1',
    name: null,
    email: null,
    emailVerified: null,
    image: null,
    password: null,
    hashedPassword: null,
    salt: null,
    currentCountry: null,
    currentState: null,
    currentLocality: null,
    currentAdminUnit: null,
    currentNeighborhood: null,
    originalCountry: null,
    originalState: null,
    originalLocality: null,
    originalAdminUnit: null,
    originalNeighborhood: null,
    bio: null,
    gender: null,
    role: 'USER',
    isTwoFactorEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    oathAcknowledged: null
  } as User;