# Valuo — Prompts Used

## Setup
- "Create a Vite + React + TypeScript project with Tailwind CSS 4"
- "Install Zustand for state management, Recharts for charts, Axios for HTTP"
- "Configure tsconfig with strict mode and path aliases"
- "Set up Tailwind CSS with custom theme colors (slate-800 primary, amber accent)"

## API Integration
- "Build currencyApi.ts using Frankfurter API (https://api.frankfurter.app/latest?from=USD) with 30s caching and error handling"
- "Build commodityApi.ts using Gold-API (https://www.gold-api.com/api/v1/latest/USD) for precious metals and Twelve Data (https://api.twelvedata.com/quote) for energy/metals"
- "Create combinedApi.ts that calls both APIs with Promise.all and merges results"
- "Add environment variable VITE_TWELVE_DATA_API_KEY for Twelve Data API key"
- "Handle API response mismatches and normalize to Commodity interface"

## State Management
- "Create valuoStore.ts with Zustand: state for commodities, currencies, watchlist, baseCurrency, loading, error, lastUpdated"
- "Add persist middleware for watchlist and baseCurrency in localStorage"
- "Implement addToWatchlist, removeFromWatchlist, setBaseCurrency, refreshPrices, fetchAllPrices actions"

## Components
- "Build Dashboard layout: sticky header with SearchBar, 2-column responsive grid (watchlist + commodity cards left, converter + chart right)"
- "Create CommodityCard: display price, 24h change (green/red), star button for watchlist, click for chart, skeleton loading"
- "Build CurrencyConverter: amount input, From/To dropdowns, swap button, live conversion result"
- "Create PriceChart with Recharts: line chart, 1D/1W/1M time range buttons, tooltips, responsive, loading state"
- "Build SearchBar: debounced input (300ms), commodity + currency search, dropdown results, no-results state, clear button"
- "Create Watchlist: items with price + 24h change, remove button, empty state, real-time updates from store"

## Real-Time Updates
- "Create useRealtimePrices hook: 10s refresh interval, offline detection, exponential backoff retry, cleanup on unmount"
- "Auto-refresh Dashboard every 10 seconds with setInterval"
- "Show last updated timestamp in header"
