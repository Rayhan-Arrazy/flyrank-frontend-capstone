import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Asset, AssetCategory, WatchlistItem, PortfolioHolding } from '../types'
import { fetchAllAssets } from '../api/combinedApi'

interface ValuoState {
  assets: Asset[]
  watchlist: WatchlistItem[]
  portfolio: PortfolioHolding[]
  baseCurrency: string
  selectedCategory: AssetCategory | 'all'
  isLoading: boolean
  error: string | null
  lastUpdated: string | null
}

interface ValuoActions {
  fetchAllAssets: () => Promise<void>
  addToWatchlist: (item: WatchlistItem) => void
  removeFromWatchlist: (id: string) => void
  setBaseCurrency: (currency: string) => void
  setSelectedCategory: (category: AssetCategory | 'all') => void
  refreshPrices: () => Promise<void>
  addToPortfolio: (holding: PortfolioHolding) => void
  removeFromPortfolio: (id: string) => void
}

type ValuoStore = ValuoState & ValuoActions

export const useValuoStore = create<ValuoStore>()(
  persist(
    (set, get) => ({
      assets: [],
      watchlist: [],
      portfolio: [],
      baseCurrency: 'USD',
      selectedCategory: 'all',
      isLoading: false,
      error: null,
      lastUpdated: null,

      fetchAllAssets: async () => {
        const { baseCurrency } = get()
        set({ isLoading: true, error: null })

        try {
          const data = await fetchAllAssets(baseCurrency)
          set({
            assets: data,
            isLoading: false,
            lastUpdated: new Date().toISOString(),
          })
        } catch (err) {
          set({
            isLoading: false,
            error: err instanceof Error ? err.message : 'Failed to fetch prices',
          })
        }
      },

      addToWatchlist: (item: WatchlistItem) => {
        const { watchlist } = get()
        if (!watchlist.find((w) => w.id === item.id)) {
          set({ watchlist: [...watchlist, item] })
        }
      },

      removeFromWatchlist: (id: string) => {
        set({ watchlist: get().watchlist.filter((w) => w.id !== id) })
      },

      setBaseCurrency: (currency: string) => {
        set({ baseCurrency: currency })
      },

      setSelectedCategory: (category: AssetCategory | 'all') => {
        set({ selectedCategory: category })
      },

      refreshPrices: async () => {
        await get().fetchAllAssets()
      },

      addToPortfolio: (holding: PortfolioHolding) => {
        const { portfolio } = get()
        const existing = portfolio.find((h) => h.assetId === holding.assetId)
        if (existing) {
          const totalQty = existing.quantity + holding.quantity
          const avgPrice = (existing.buyPrice * existing.quantity + holding.buyPrice * holding.quantity) / totalQty
          set({
            portfolio: portfolio.map((h) =>
              h.id === existing.id
                ? { ...h, quantity: totalQty, buyPrice: avgPrice }
                : h
            ),
          })
        } else {
          set({ portfolio: [...portfolio, holding] })
        }
      },

      removeFromPortfolio: (id: string) => {
        set({ portfolio: get().portfolio.filter((h) => h.id !== id) })
      },
    }),
    {
      name: 'valuo-storage',
      partialize: (state) => ({
        watchlist: state.watchlist,
        portfolio: state.portfolio,
        baseCurrency: state.baseCurrency,
      }),
    }
  )
)
