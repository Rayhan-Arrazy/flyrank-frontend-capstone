import { describe, it, expect } from "vitest";
import { settingsFormSchema } from "./schema";
import { getPasswordStrength } from "./passwordStrength";

const validBase = {
  fullName: "Rayhan Arrazy",
  email: "rayhan@flyrank.com",
  password: "",
  role: "Editor" as const,
};

describe("settingsFormSchema", () => {
  it("accepts a fully valid submission", () => {
    const result = settingsFormSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it("accepts an empty password (optional field)", () => {
    const result = settingsFormSchema.safeParse({ ...validBase, password: "" });
    expect(result.success).toBe(true);
  });

  it("rejects full name shorter than 2 characters", () => {
    const result = settingsFormSchema.safeParse({
      ...validBase,
      fullName: "A",
    });
    expect(result.success).toBe(false);
  });

  it("rejects full name longer than 50 characters", () => {
    const result = settingsFormSchema.safeParse({
      ...validBase,
      fullName: "A".repeat(51),
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing full name", () => {
    const result = settingsFormSchema.safeParse({ ...validBase, fullName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email format", () => {
    const result = settingsFormSchema.safeParse({
      ...validBase,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing email", () => {
    const result = settingsFormSchema.safeParse({ ...validBase, email: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters when provided", () => {
    const result = settingsFormSchema.safeParse({
      ...validBase,
      password: "short1",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a password of 8+ characters", () => {
    const result = settingsFormSchema.safeParse({
      ...validBase,
      password: "longenough123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a role outside the allowed enum", () => {
    const result = settingsFormSchema.safeParse({
      ...validBase,
      role: "SuperAdmin",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing role", () => {
    const result = settingsFormSchema.safeParse({
      ...validBase,
      role: undefined,
    });
    expect(result.success).toBe(false);
  });
});

describe("getPasswordStrength", () => {
  it("returns level 0 for empty password", () => {
    expect(getPasswordStrength("").level).toBe(0);
  });

  it("returns level 0 for passwords under 8 characters", () => {
    expect(getPasswordStrength("abc123").level).toBe(0);
  });

  it("returns a low-but-nonzero level for a simple 8+ char password", () => {
    const result = getPasswordStrength("abcdefgh");
    expect(result.level).toBeGreaterThanOrEqual(1);
  });

  it("returns the max level for a long mixed-character password", () => {
    const result = getPasswordStrength("Abcdefgh123!@#");
    expect(result.level).toBe(4);
    expect(result.label).toBe("Strong");
  });

  it("increases score as character variety increases", () => {
    const weak = getPasswordStrength("abcdefgh");
    const strong = getPasswordStrength("Abcdefgh123!@#");
    expect(strong.level).toBeGreaterThan(weak.level);
  });
});
