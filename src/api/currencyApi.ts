import { Asset } from '../types'
import { CURRENCIES } from '../constants'

const HARDCODED_RATES: Record<string, number> = {
  USD: 1.0000,
  EUR: 0.9200,
  GBP: 0.7900,
  JPY: 0.0067,
  IDR: 0.000064,
  AUD: 0.6500,
  CAD: 0.7300,
  CHF: 1.1000,
  SGD: 0.7400,
}

async function fetchFromFrankfurter(): Promise<Asset[] | null> {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD', {
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) throw new Error(`Frankfurter returned ${res.status}`)
    const data = await res.json()
    const now = new Date().toISOString()

    return CURRENCIES.map((c) => ({
      id: c.code,
      name: c.name,
      symbol: c.code,
      price: data.rates[c.code] ?? HARDCODED_RATES[c.code] ?? 0,
      change24h: 0,
      changePercent24h: 0,
      category: 'currency' as const,
      unit: c.code,
      lastUpdated: now,
    }))
  } catch {
    return null
  }
}

export async function fetchExchangeRates(_baseCurrency: string): Promise<Asset[]> {
  const apiData = await fetchFromFrankfurter()
  if (apiData) return apiData

  const now = new Date().toISOString()
  return CURRENCIES.map((c) => ({
    id: c.code,
    name: c.name,
    symbol: c.code,
    price: HARDCODED_RATES[c.code] ?? 0,
    change24h: 0,
    changePercent24h: 0,
    category: 'currency' as const,
    unit: c.code,
    lastUpdated: now,
  }))
}
