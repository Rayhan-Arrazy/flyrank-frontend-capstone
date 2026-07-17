import { Asset, CacheEntry } from '../types'
import { fetchExchangeRates } from './currencyApi'
import { fetchCommodityPrices } from './commodityApi'
import { fetchCryptoPrices } from './cryptoApi'

const cache: Record<string, CacheEntry<Asset[]>> = {}
const CACHE_DURATION = 30000

export async function fetchAllAssets(baseCurrency: string): Promise<Asset[]> {
  const cacheKey = `all_${baseCurrency}`
  const now = Date.now()
  const cached = cache[cacheKey]

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  const [commodities, crypto, currencies] = await Promise.all([
    fetchCommodityPrices(),
    fetchCryptoPrices(),
    fetchExchangeRates(baseCurrency),
  ])

  const result = [...commodities, ...crypto, ...currencies]
  cache[cacheKey] = { data: result, timestamp: now }
  return result
}
