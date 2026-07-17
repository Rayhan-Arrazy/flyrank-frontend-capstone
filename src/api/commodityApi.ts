import { Asset } from '../types'
import { COMMODITIES } from '../constants'

const FALLBACK_PRICES: Record<string, { price: number; change24h: number; changePercent24h: number }> = {
  gold: { price: 2400.00, change24h: 12.50, changePercent24h: 0.52 },
  silver: { price: 28.50, change24h: -0.30, changePercent24h: -1.04 },
  platinum: { price: 950.00, change24h: 8.20, changePercent24h: 0.87 },
  palladium: { price: 1050.00, change24h: -15.00, changePercent24h: -1.41 },
  copper: { price: 4.20, change24h: 0.05, changePercent24h: 1.20 },
  wti: { price: 78.50, change24h: 1.20, changePercent24h: 1.55 },
  ng: { price: 2.80, change24h: -0.10, changePercent24h: -3.45 },
}

const TWELVE_SYMBOLS: Record<string, string> = {
  gold: 'XAU/USD',
  silver: 'XAG/USD',
  platinum: 'XPT/USD',
  palladium: 'XPD/USD',
  copper: 'XCU/USD',
  wti: 'WTI',
  ng: 'NG',
}

async function fetchFromTwelveData(): Promise<Asset[] | null> {
  const apiKey = import.meta.env.VITE_TWELVE_DATA_API_KEY
  if (!apiKey) return null

  try {
    const promises = Object.entries(TWELVE_SYMBOLS).map(async ([id, symbol]) => {
      const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
      if (!res.ok) return null
      const data = await res.json()
      if (data.status !== 'ok') return null

      const meta = COMMODITIES.find((c) => c.id === id)
      const price = parseFloat(data.close) || FALLBACK_PRICES[id]?.price || 0
      const prevClose = parseFloat(data.previous_close)
      const change = prevClose > 0 ? price - prevClose : 0
      const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0

      return {
        id,
        name: data.name || meta?.name || id,
        symbol: meta?.symbol || symbol,
        price,
        change24h: change,
        changePercent24h: changePercent,
        category: 'commodity' as const,
        unit: meta?.unit || '',
        lastUpdated: new Date().toISOString(),
      } as Asset
    })

    const results = await Promise.all(promises)
    const valid = results.filter(Boolean) as Asset[]
    return valid.length > 0 ? valid : null
  } catch {
    return null
  }
}

export async function fetchCommodityPrices(): Promise<Asset[]> {
  const apiData = await fetchFromTwelveData()
  if (apiData) return apiData

  const now = new Date().toISOString()
  return COMMODITIES.map((meta) => {
    const f = FALLBACK_PRICES[meta.id]
    return {
      id: meta.id,
      name: meta.name,
      symbol: meta.symbol,
      price: f?.price ?? 0,
      change24h: f?.change24h ?? 0,
      changePercent24h: f?.changePercent24h ?? 0,
      category: 'commodity' as const,
      unit: meta.unit,
      lastUpdated: now,
    }
  })
}
