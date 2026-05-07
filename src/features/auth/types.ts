import type { Profile } from '@/shared/types/database';

export type { Profile };

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpInput extends AuthCredentials {
  fullName?: string;
}
