export type PasswordResetEmail = {
  to: string;
  username: string;
  resetUrl: string;
  expiresInMinutes: number;
};
