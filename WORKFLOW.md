# AI-Assisted Workflow Drill - FE-03

## Overview

This document compares two approaches to building a settings form using AI:

1. Vague prompt → accept output (branch: `vague-prompt-approach`)
2. Precise prompt + verification (branch: `precise-prompt-approach`)

## Round One: Vague Prompt

**Prompt:** "Create a settings form for a web app with validation."

**What AI Generated:**

- Basic React form component with inline validation
- No TypeScript types
- No accessibility attributes
- No tests
- Basic Tailwind styling

**Issues Found:**

- Email validation only checked for empty string, not format
- Password was required (should be optional)
- No ARIA labels or keyboard support
- No unit tests

**Review Effort:**

- Time spent fixing: ~45 minutes
- Lines of code changed: ~120

## Round Two: Precise Prompt

**Prompt:** "Create a React settings form component with TypeScript, Tailwind CSS, React Hook Form, and Zod validation. Fields: Full Name (required, min 2 chars), Email (required, valid email), Password (optional, min 8 chars, show strength indicator), Role (dropdown: Admin/Editor/Viewer). Include proper labels, error messages, ARIA attributes for accessibility, responsive design, and password strength meter with aria-live. Submit button disabled until valid. Write unit tests with Vitest and ensure they pass."

**What AI Generated:**

- `SettingsForm.tsx` — full component with TypeScript, Tailwind, React Hook Form
- `schema.ts` — Zod schema with proper validation
- `passwordStrength.ts` — strength scorer with a monospace-tinted meter
- `SettingsForm.test.tsx` — 24 tests covering the form behavior
- `schema.test.ts` — tests for validation logic

**Improvements Over Round One:**

- TypeScript types everywhere
- Proper Zod schema with edge cases handled
- ARIA attributes and accessibility
- 24/24 tests passing

**AI Mistakes I Caught:**

- Password validation: AI used `z.string().min(8).optional()` which breaks for empty strings. Fixed with `z.union([z.literal(""), z.string().min(8)])`
- Missing aria-live on strength meter — added it manually

## Comparison

| **Aspect**    | **Vague Prompt** | **Precise Prompt** |
| :------------ | :--------------- | :----------------- |
| Correctness   | 6/10             | 10/10              |
| Accessibility | 2/10             | 9/10               |
| Edge Cases    | 3/10             | 10/10              |
| Review Effort | High (45 min)    | Low (5 min)        |
| Code Quality  | 5/10             | 9/10               |

**Specific Diffs:**

- Vague had inline validation that broke on edge cases; precise used Zod with proper schema
- Vague had no tests; precise had 24 passing tests
- Vague required 120 lines of fixes; precise required 5 minutes of review
- Vague had no accessibility; precise had full ARIA support

## Key Lesson

A precise prompt with explicit requirements saves 40+ minutes of fixing bad code. The AI can handle complex edge cases when you tell it exactly what you want.

## Conclusion

Always use detailed prompts with verification steps. The precise approach was production-ready in 5 minutes. The vague approach took 45 minutes to fix and still had gaps. Never using a vague prompt again.
