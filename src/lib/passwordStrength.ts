export type StrengthLevel = 0 | 1 | 2 | 3 | 4;

export interface StrengthResult {
  level: StrengthLevel;
  label: "Too short" | "Weak" | "Fair" | "Good" | "Strong";
}

const LABELS: StrengthResult["label"][] = [
  "Too short",
  "Weak",
  "Fair",
  "Good",
  "Strong",
];

/**
 * Lightweight heuristic scorer — no external dependency needed for a
 * capstone project. Scores 0-4 based on length + character variety.
 */
export function getPasswordStrength(password: string): StrengthResult {
  if (!password || password.length < 8) {
    return { level: 0, label: "Too short" };
  }

  let score = 1; // meets minimum length

  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const level = Math.min(score, 4) as StrengthLevel;
  return { level, label: LABELS[level] };
}
