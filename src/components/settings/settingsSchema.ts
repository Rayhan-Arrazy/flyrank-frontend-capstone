import { z } from 'zod';

export const settingsSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be 50 characters or fewer'),

  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),

  bio: z
    .string()
    .trim()
    .max(280, 'Bio must be 280 characters or fewer')
    .optional()
    .or(z.literal('')),

  website: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || z.string().url().safeParse(value).success,
      'Enter a valid URL (include https://)',
    ),

  emailNotifications: z.boolean(),

  marketingEmails: z.boolean(),

  theme: z.enum(['light', 'dark', 'system'], {
    required_error: 'Select a theme preference',
  }),

  language: z.enum(['en', 'es', 'fr', 'de'], {
    required_error: 'Select a language',
  }),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
