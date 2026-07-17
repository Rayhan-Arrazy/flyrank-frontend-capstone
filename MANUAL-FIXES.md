# Valuo — Manual Fixes

## API Response Structure Mismatches
- Gold-API returns metals in `data.metals` object with metal names as keys; mapped to commodity symbols
- Twelve Data returns different field names (`close`, `previous_close`) vs. Gold-API (`price`)
- Frankfurter API returns rates relative to base; converted to direct exchange rates
- Normalized all to `Commodity` interface with `price`, `change24h`, `changePercent24h`

## Rate Limiting Issues
- Added 30-second cache to all API calls to reduce request frequency
- Implemented exponential backoff retry (1s, 2s, 4s, 8s, 16s) in real-time hook
- Graceful degradation: cached data returned on API failure instead of showing errors

## Accessibility Improvements
- Added `aria-label` to all icon buttons (star, remove, swap, clear search)
- Semantic HTML structure with `<header>`, `<main>` landmarks
- Proper heading hierarchy (h1, h3)
- Focus states on interactive elements (focus:ring-2)
- Color not sole indicator of change (arrow icons indicate direction)

## Responsive Design Adjustments
- Dashboard: 1 column mobile, 1 column tablet, 3 columns desktop (lg breakpoint)
- Header: hidden refresh/update on mobile, shown below
- Commodity cards: 1 column mobile, 2 columns tablet/sm
- SearchBar: full width on mobile, max-width on desktop
- Chart: responsive container with 300px height

## Other Manual Fixes
- Fixed React import ordering in App.tsx (ErrorBoundary used before React import)
- Ensured empty vitesvg is available or created fallback
- Verified Tailwind CSS v4 @import syntax works
- Confirmed Zustand persist middleware key matches localStorage read key
- Added TypeScript build info files to .gitignore
- Removed unused variables to satisfy strict TypeScript config
