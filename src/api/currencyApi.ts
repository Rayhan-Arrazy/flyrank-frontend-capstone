import { Currency } from '../types'
import { CURRENCIES } from '../constants'

interface FrankfurterResponse {
  amount: number
  base: string
  date: string
  rates: Record<string, number>
}

let lastFetch = 0
let cachedRates: Currency[] = []
const CACHE_DURATION = 30000

export async function fetchExchangeRates(baseCurrency: string): Promise<Currency[]> {
  const now = Date.now()
  if (now - lastFetch < CACHE_DURATION && cachedRates.length > 0) {
    return cachedRates
  }

  const url = `https://api.frankfurter.app/latest?from=${baseCurrency}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Frankfurter API returned ${response.status}`)
    }
    const data: FrankfurterResponse = await response.json()

    const currencies: Currency[] = CURRENCIES.map((c) => {
      const rate = c.code === baseCurrency ? 1 : data.rates[c.code] ?? 0
      return {
        code: c.code,
        name: c.name,
        exchangeRate: rate,
        change24h: 0,
      }
    })

    cachedRates = currencies
    lastFetch = now
    return currencies
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error)
    if (cachedRates.length > 0) {
      return cachedRates
    }
    throw error
  }
}
