export type Theme = 'light' | 'dark' | 'system';

export type Language = 'en' | 'es' | 'fr' | 'de';

export interface UserSettings {
  displayName: string;
  email: string;
  bio: string;
  website: string;
  emailNotifications: boolean;
  marketingEmails: boolean;
  theme: Theme;
  language: Language;
}

export const DEFAULT_SETTINGS: UserSettings = {
  displayName: '',
  email: '',
  bio: '',
  website: '',
  emailNotifications: true,
  marketingEmails: false,
  theme: 'system',
  language: 'en',
};
