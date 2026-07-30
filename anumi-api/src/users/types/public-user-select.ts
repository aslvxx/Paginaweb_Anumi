import type { Prisma } from '../../generated/prisma/client';

export const publicUserSelect = {
  id: true,
  username: true,
  email: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;
