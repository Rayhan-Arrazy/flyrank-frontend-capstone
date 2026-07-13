import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSettingsStore } from '../../stores/settingsStore';
import type { UserSettings } from '../../types/settings';
import {
  CheckboxField,
  FormField,
  SelectInput,
  TextArea,
  TextInput,
} from './FormField';
import {
  settingsSchema,
  type SettingsFormValues,
} from './settingsSchema';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
];

/**
 * Maps validated form values into the persisted settings shape.
 */
function toUserSettings(values: SettingsFormValues): UserSettings {
  return {
    displayName: values.displayName,
    email: values.email,
    bio: values.bio ?? '',
    website: values.website ?? '',
    emailNotifications: values.emailNotifications,
    marketingEmails: values.marketingEmails,
    theme: values.theme,
    language: values.language,
  };
}

export function SettingsForm() {
  const { settings, lastSavedAt, updateSettings, resetSettings } = useSettingsStore();
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
    mode: 'onBlur',
  });

  useEffect(() => {
    reset(settings);
  }, [settings, reset]);

  const onSubmit = handleSubmit((values) => {
    updateSettings(toUserSettings(values));
    reset(values);
    setSaveMessage('Settings saved successfully.');
  });

  const handleReset = () => {
    resetSettings();
    setSaveMessage(null);
  };

  const emailNotifications = watch('emailNotifications');
  const marketingEmails = watch('marketingEmails');

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-8"
      aria-label="Account settings"
    >
      {saveMessage && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {saveMessage}
          {lastSavedAt && (
            <span className="mt-1 block text-emerald-700">
              Last saved {new Date(lastSavedAt).toLocaleString()}
            </span>
          )}
        </div>
      )}

      <section
        aria-labelledby="profile-heading"
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6">
          <h2 id="profile-heading" className="text-base font-semibold text-slate-900">
            Profile
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Update your public profile and contact details.
          </p>
        </div>

        <div className="space-y-5">
          <FormField
            id="displayName"
            label="Display name"
            error={errors.displayName?.message}
            hint="Shown on your profile and in team workspaces."
          >
            <TextInput
              id="displayName"
              type="text"
              autoComplete="name"
              hasError={Boolean(errors.displayName)}
              aria-invalid={Boolean(errors.displayName)}
              {...register('displayName')}
            />
          </FormField>

          <FormField
            id="email"
            label="Email address"
            error={errors.email?.message}
          >
            <TextInput
              id="email"
              type="email"
              autoComplete="email"
              hasError={Boolean(errors.email)}
              aria-invalid={Boolean(errors.email)}
              {...register('email')}
            />
          </FormField>

          <FormField
            id="bio"
            label="Bio"
            error={errors.bio?.message}
            hint="Optional. Up to 280 characters."
          >
            <TextArea
              id="bio"
              hasError={Boolean(errors.bio)}
              aria-invalid={Boolean(errors.bio)}
              {...register('bio')}
            />
          </FormField>

          <FormField
            id="website"
            label="Website"
            error={errors.website?.message}
            hint="Optional. Include https://"
          >
            <TextInput
              id="website"
              type="url"
              placeholder="https://example.com"
              hasError={Boolean(errors.website)}
              aria-invalid={Boolean(errors.website)}
              {...register('website')}
            />
          </FormField>
        </div>
      </section>

      <section
        aria-labelledby="notifications-heading"
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6">
          <h2 id="notifications-heading" className="text-base font-semibold text-slate-900">
            Notifications
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Choose which emails you want to receive.
          </p>
        </div>

        <div className="space-y-4">
          <CheckboxField
            id="emailNotifications"
            label="Product updates"
            description="Receive emails about new features and improvements."
            checked={emailNotifications}
            onChange={(checked) =>
              setValue('emailNotifications', checked, { shouldDirty: true })
            }
          />

          <CheckboxField
            id="marketingEmails"
            label="Marketing emails"
            description="Occasional tips, case studies, and promotional offers."
            checked={marketingEmails}
            onChange={(checked) =>
              setValue('marketingEmails', checked, { shouldDirty: true })
            }
          />
        </div>
      </section>

      <section
        aria-labelledby="preferences-heading"
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6">
          <h2 id="preferences-heading" className="text-base font-semibold text-slate-900">
            Preferences
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Customize your app experience.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id="theme"
            label="Theme"
            error={errors.theme?.message}
          >
            <SelectInput
              id="theme"
              options={THEME_OPTIONS}
              hasError={Boolean(errors.theme)}
              aria-invalid={Boolean(errors.theme)}
              {...register('theme')}
            />
          </FormField>

          <FormField
            id="language"
            label="Language"
            error={errors.language?.message}
          >
            <SelectInput
              id="language"
              options={LANGUAGE_OPTIONS}
              hasError={Boolean(errors.language)}
              aria-invalid={Boolean(errors.language)}
              {...register('language')}
            />
          </FormField>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          Reset to defaults
        </button>

        <button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSubmitting ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
