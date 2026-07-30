import type { PasswordResetEmail } from '../types/password-reset-email.type';

export interface MailProvider {
  sendPasswordResetEmail(email: PasswordResetEmail): Promise<void>;
}
