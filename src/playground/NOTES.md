# NOTES.md — Accessibility Components

## My vs shadcn/ui Comparison

### Modal Dialog

**What I did:**

- Built from scratch with React + TypeScript
- role="dialog", aria-modal="true"
- Manual focus trap with useRef and useEffect
- Escape key and overlay click to close
- Focus returns to trigger on close

**What shadcn/ui does:**

- Uses Radix UI Dialog primitive
- Handles focus trapping automatically
- Manages scroll locking
- Portal rendering
- Animation support

**What shadcn handled that I missed:**

1. **Portal rendering** — shadcn/ui renders modals outside normal DOM to avoid z-index issues. I didn't implement this.
2. **Scroll locking** — shadcn/ui locks body scroll automatically with all edge cases handled.

### Tabs

**What I did:**

- Built from scratch with React + TypeScript
- role="tablist", role="tab", role="tabpanel"
- Manual keyboard navigation (arrows, Home, End)
- Manual focus management

**What shadcn/ui does:**

- Uses Radix UI Tabs primitive
- Handles keyboard navigation automatically
- Manages active state internally
- Supports both horizontal and vertical

**What shadcn handled that I missed:**

1. **Automatic keyboard navigation** — shadcn/ui handles arrow keys, Home, End without extra code. I wrote all this manually.
2. **Orientation handling** — shadcn/ui supports horizontal and vertical. I only built horizontal.

## Key Learnings

- Building accessible components from scratch requires deep knowledge of ARIA patterns
- Focus management is more complex than it looks
- shadcn/ui's Radix primitives handle many edge cases I didn't think about
- The ARIA Authoring Practices Guide is the ultimate source of truth

## Resources Used

- W3C ARIA Authoring Practices Guide (APG)
- React Aria documentation
- shadcn/ui source code
- MDN Web Docs on ARIA roles
