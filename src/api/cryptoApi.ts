import { Asset } from '../types'
import { CRYPTO_ASSETS } from '../constants'

const FALLBACK_PRICES: Record<string, { price: number; change24h: number; changePercent24h: number }> = {
  bitcoin: { price: 65420.00, change24h: 1250.00, changePercent24h: 1.95 },
  ethereum: { price: 3520.00, change24h: -85.00, changePercent24h: -2.36 },
  solana: { price: 145.80, change24h: 5.60, changePercent24h: 4.01 },
  ripple: { price: 0.55, change24h: 0.02, changePercent24h: 3.77 },
  cardano: { price: 0.45, change24h: -0.01, changePercent24h: -2.17 },
  dogecoin: { price: 0.12, change24h: 0.01, changePercent24h: 9.09 },
  polkadot: { price: 7.25, change24h: -0.30, changePercent24h: -3.97 },
}

const COINGECKO_IDS: Record<string, string> = {
  bitcoin: 'bitcoin',
  ethereum: 'ethereum',
  solana: 'solana',
  ripple: 'ripple',
  cardano: 'cardano',
  dogecoin: 'dogecoin',
  polkadot: 'polkadot',
}

async function fetchFromCoinGecko(): Promise<Asset[] | null> {
  const ids = Object.values(COINGECKO_IDS).join(',')
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) throw new Error(`CoinGecko returned ${res.status}`)
    const data = await res.json()
    const now = new Date().toISOString()

    return CRYPTO_ASSETS.map((meta) => {
      const coinId = COINGECKO_IDS[meta.id]
      const coin = data[coinId]
      return {
        id: meta.id,
        name: meta.name,
        symbol: meta.symbol,
        price: coin?.usd ?? 0,
        change24h: 0,
        changePercent24h: coin?.usd_24h_change ?? 0,
        category: 'crypto' as const,
        unit: meta.unit,
        lastUpdated: now,
      }
    })
  } catch {
    return null
  }
}

export async function fetchCryptoPrices(): Promise<Asset[]> {
  const apiData = await fetchFromCoinGecko()
  if (apiData) return apiData

  const now = new Date().toISOString()
  return CRYPTO_ASSETS.map((meta) => {
    const fallback = FALLBACK_PRICES[meta.id]
    return {
      id: meta.id,
      name: meta.name,
      symbol: meta.symbol,
      price: fallback?.price ?? 0,
      change24h: fallback?.change24h ?? 0,
      changePercent24h: fallback?.changePercent24h ?? 0,
      category: 'crypto' as const,
      unit: meta.unit,
      lastUpdated: now,
    }
  })
}
