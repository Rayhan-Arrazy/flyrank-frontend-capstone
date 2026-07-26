# FE-05 Notes: Accessible Component Comparison

## Overview

Compare my hand-rolled accessible components with shadcn/ui's implementations.

| Component | My Implementation | shadcn/ui | Notes |
|-----------|------------------|-----------|-------|
| Modal     |                  |           |       |
| Tabs      |                  |           |       |
| Disclosure|                  |           |       |

## ARIA Patterns

### Modal (Dialog)
- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby` / `aria-describedby`
- Focus trapping
- Escape to close
- Body scroll lock

### Tabs (Tabpanel)
- `role="tablist"`, `role="tab"`, `role="tabpanel"`
- `aria-selected`, `aria-controls`, `aria-labelledby`
- `aria-orientation`
- Keyboard navigation (arrow keys, Home, End)

### Disclosure
- `aria-expanded`, `aria-controls`
- `aria-hidden` on panel
- Button + region pattern

## Keyboard Support Checklist

| Feature | Modal | Tabs | Disclosure |
|---------|-------|------|------------|
| Tab     |       |      |            |
| Escape  |       |      |            |
| Enter   |       |      |            |
| Arrows  |       |      |            |
| Home/End|       |      |            |

## Differences from shadcn/ui

### Modal

### Tabs

### Disclosure
