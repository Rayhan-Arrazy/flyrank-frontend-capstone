import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Commodity, Currency, WatchlistItem } from '../types'
import { fetchAllPrices } from '../api/combinedApi'

interface ValuoState {
  commodities: Commodity[]
  currencies: Currency[]
  watchlist: WatchlistItem[]
  baseCurrency: string
  isLoading: boolean
  error: string | null
  lastUpdated: string | null
}

interface ValuoActions {
  fetchAllPrices: () => Promise<void>
  addToWatchlist: (item: WatchlistItem) => void
  removeFromWatchlist: (id: string) => void
  setBaseCurrency: (currency: string) => void
  refreshPrices: () => Promise<void>
}

type ValuoStore = ValuoState & ValuoActions

export const useValuoStore = create<ValuoStore>()(
  persist(
    (set, get) => ({
      commodities: [],
      currencies: [],
      watchlist: [],
      baseCurrency: 'USD',
      isLoading: false,
      error: null,
      lastUpdated: null,

      fetchAllPrices: async () => {
        const { baseCurrency } = get()
        set({ isLoading: true, error: null })

        try {
          const data = await fetchAllPrices(baseCurrency)
          set({
            commodities: data.commodities,
            currencies: data.currencies,
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

      refreshPrices: async () => {
        await get().fetchAllPrices()
      },
    }),
    {
      name: 'valuo-storage',
      partialize: (state) => ({
        watchlist: state.watchlist,
        baseCurrency: state.baseCurrency,
      }),
    }
  )
)
