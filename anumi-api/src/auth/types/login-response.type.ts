import type { PublicUser } from '../../users/types/public-user.type';

export type LoginResponse = {
  accessToken: string;
  user: PublicUser;
};
