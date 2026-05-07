import type { Profile } from '@/shared/types/database';

export type { Profile };

export interface SettingsSection {
  id: 'profile' | 'account' | 'security' | 'data' | 'language';
  label: string;
}
