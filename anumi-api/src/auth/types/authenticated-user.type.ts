export type AuthenticatedUser = {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
