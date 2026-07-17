export interface Commodity {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  changePercent24h: number
  unit: string
  lastUpdated: string
}

export interface Currency {
  code: string
  name: string
  exchangeRate: number
  change24h: number
}

export interface PriceHistory {
  timestamp: number
  price: number
  volume?: number
}

export interface WatchlistItem {
  id: string
  type: 'commodity' | 'currency'
  symbol: string
  addedAt: string
}

export interface CacheEntry<T> {
  data: T
  timestamp: number
}
