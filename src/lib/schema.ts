import { z } from "zod";

/**
 * Password is optional (e.g. "leave blank to keep current password" on an
 * edit-profile screen), but if the user types anything at all, it must be
 * a valid 8+ character password. The `.or(z.literal(""))` lets an empty
 * field pass, while any non-empty value gets the real length check.
 */
export const settingsFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be 50 characters or fewer"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .union([
      z.literal(""),
      z.string().min(8, "Password must be at least 8 characters"),
    ])
    .optional(),
  role: z.enum(["Admin", "Editor", "Viewer"], {
    errorMap: () => ({ message: "Select a role" }),
  }),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export const ROLE_OPTIONS = ["Admin", "Editor", "Viewer"] as const;
