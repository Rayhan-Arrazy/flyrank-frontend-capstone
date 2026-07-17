import { Commodity, Currency, CacheEntry } from '../types'
import { fetchExchangeRates } from './currencyApi'
import { fetchCommodityPrices } from './commodityApi'

const cache: Record<string, CacheEntry<{ commodities: Commodity[]; currencies: Currency[] }>> = {}
const CACHE_DURATION = 30000

export async function fetchAllPrices(baseCurrency: string): Promise<{
  commodities: Commodity[]
  currencies: Currency[]
}> {
  const cacheKey = `all_${baseCurrency}`
  const now = Date.now()
  const cached = cache[cacheKey]

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  try {
    const [commodities, currencies] = await Promise.all([
      fetchCommodityPrices(),
      fetchExchangeRates(baseCurrency),
    ])

    const result = { commodities, currencies }
    cache[cacheKey] = { data: result, timestamp: now }
    return result
  } catch (error) {
    if (cached) {
      return cached.data
    }
    throw error
  }
}
