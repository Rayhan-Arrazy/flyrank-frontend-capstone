import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ROLE_OPTIONS,
  settingsFormSchema,
  type SettingsFormValues,
} from "./schema";
import { getPasswordStrength } from "./passwordStrength";

const STRENGTH_COLORS = [
  "bg-slate-200",
  "bg-rose-500",
  "bg-amber-500",
  "bg-lime-500",
  "bg-emerald-500",
] as const;

export default function SettingsForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: undefined,
    },
  });

  const passwordValue = watch("password") ?? "";
  const strength = useMemo(
    () => getPasswordStrength(passwordValue),
    [passwordValue],
  );

  const onSubmit = (data: SettingsFormValues) => {
    // No backend yet — log the payload so the flow can be verified in devtools.
    console.log("Settings form submitted:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mx-auto w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Account settings
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Update your profile details below.
        </p>
      </div>

      {/* Full Name */}
      <div>
        <label
          htmlFor="fullName"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Full name
        </label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          aria-invalid={errors.fullName ? "true" : "false"}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
          className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-offset-0 ${
            errors.fullName
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
              : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
          }`}
          {...register("fullName")}
        />
        {errors.fullName && (
          <p
            id="fullName-error"
            role="alert"
            className="mt-1.5 text-sm text-rose-600"
          >
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-offset-0 ${
            errors.email
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
              : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
          }`}
          {...register("email")}
        />
        {errors.email && (
          <p
            id="email-error"
            role="alert"
            className="mt-1.5 text-sm text-rose-600"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Password{" "}
          <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={errors.password ? "true" : "false"}
          aria-describedby={
            errors.password ? "password-error" : "password-strength"
          }
          className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-offset-0 ${
            errors.password
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
              : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
          }`}
          {...register("password")}
        />

        {errors.password ? (
          <p
            id="password-error"
            role="alert"
            className="mt-1.5 text-sm text-rose-600"
          >
            {errors.password.message}
          </p>
        ) : (
          passwordValue.length > 0 && (
            <div id="password-strength" className="mt-2" aria-live="polite">
              <div
                className="flex gap-1"
                role="img"
                aria-label={`Password strength: ${strength.label}`}
              >
                {[1, 2, 3, 4].map((bar) => (
                  <span
                    key={bar}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      bar <= strength.level
                        ? STRENGTH_COLORS[strength.level]
                        : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-slate-500">{strength.label}</p>
            </div>
          )
        )}
      </div>

      {/* Role */}
      <div>
        <label
          htmlFor="role"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Role
        </label>
        <select
          id="role"
          defaultValue=""
          aria-invalid={errors.role ? "true" : "false"}
          aria-describedby={errors.role ? "role-error" : undefined}
          className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-offset-0 ${
            errors.role
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
              : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
          }`}
          {...register("role")}
        >
          <option value="" disabled>
            Select a role
          </option>
          {ROLE_OPTIONS.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        {errors.role && (
          <p
            id="role-error"
            role="alert"
            className="mt-1.5 text-sm text-rose-600"
          >
            {errors.role.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isSubmitting ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
