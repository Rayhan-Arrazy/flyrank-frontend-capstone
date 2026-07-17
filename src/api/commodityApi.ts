import axios from 'axios'
import { Commodity } from '../types'
import { COMMODITIES } from '../constants'

const GOLD_API_URL = 'https://www.gold-api.com/api/v1/latest/USD'

interface GoldApiMetal {
  price: number
  change24h?: number
  changePercent24h?: number
}

interface GoldApiResponse {
  status: string
  timestamp: number
  metals: Record<string, GoldApiMetal>
}

interface TwelveDataQuote {
  symbol: string
  name: string
  close: string
  previous_close: string
  change: string
  percent_change: string
  timestamp: number
  status: string
}

let lastFetch = 0
let cachedCommodities: Commodity[] = []
const CACHE_DURATION = 30000

export async function fetchCommodityPrices(): Promise<Commodity[]> {
  const now = Date.now()
  if (now - lastFetch < CACHE_DURATION && cachedCommodities.length > 0) {
    return cachedCommodities
  }

  const twelveDataKey = import.meta.env.VITE_TWELVE_DATA_API_KEY
  const nowISO = new Date().toISOString()

  try {
    const [goldApiResult, twelveDataResults] = await Promise.all([
      fetchGoldApiPrices(),
      twelveDataKey && twelveDataKey !== 'your_key_here'
        ? fetchTwelveDataPrices(twelveDataKey)
        : Promise.resolve({} as Record<string, Partial<Commodity>>),
    ])

    const commodities: Commodity[] = COMMODITIES.map((c) => {
      const goldData = goldApiResult[c.symbol]
      const twelveData = twelveDataResults[c.symbol]

      if (goldData) {
        return {
          id: c.id,
          name: c.name,
          symbol: c.symbol,
          price: goldData.price,
          change24h: goldData.change24h ?? 0,
          changePercent24h: goldData.changePercent24h ?? 0,
          unit: c.unit,
          lastUpdated: nowISO,
        }
      }

      if (twelveData) {
        return {
          id: c.id,
          name: c.name,
          symbol: c.symbol,
          price: twelveData.price ?? 0,
          change24h: twelveData.change24h ?? 0,
          changePercent24h: twelveData.changePercent24h ?? 0,
          unit: c.unit,
          lastUpdated: nowISO,
        }
      }

      return {
        id: c.id,
        name: c.name,
        symbol: c.symbol,
        price: 0,
        change24h: 0,
        changePercent24h: 0,
        unit: c.unit,
        lastUpdated: nowISO,
      }
    })

    cachedCommodities = commodities
    lastFetch = now
    return commodities
  } catch (error) {
    console.error('Failed to fetch commodity prices:', error)
    if (cachedCommodities.length > 0) {
      return cachedCommodities
    }
    throw error
  }
}

async function fetchGoldApiPrices(): Promise<Record<string, { price: number; change24h?: number; changePercent24h?: number }>> {
  try {
    const response = await fetch(GOLD_API_URL)
    if (!response.ok) {
      throw new Error(`Gold API returned ${response.status}`)
    }
    const data: GoldApiResponse = await response.json()
    const result: Record<string, { price: number; change24h?: number; changePercent24h?: number }> = {}

    if (data.metals) {
      const symbolMap: Record<string, string> = {
        XAU: 'gold',
        XAG: 'silver',
        XPT: 'platinum',
        XPD: 'palladium',
      }

      for (const [metal, info] of Object.entries(data.metals)) {
        const upper = metal.toUpperCase()
        if (symbolMap[upper]) {
          result[upper] = {
            price: info.price,
            change24h: info.change24h,
            changePercent24h: info.changePercent24h,
          }
        }
      }
    }

    return result
  } catch (error) {
    console.error('Gold API fetch failed:', error)
    return {}
  }
}

async function fetchTwelveDataPrices(apiKey: string): Promise<Record<string, Partial<Commodity>>> {
  const symbols = ['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM', 'WTI', 'NG', 'XCU']
  const result: Record<string, Partial<Commodity>> = {}

  try {
    const promises = symbols.map((sym) => {
      const url = `https://api.twelvedata.com/quote?symbol=${sym}&apikey=${apiKey}`
      return axios.get<TwelveDataQuote>(url).catch(() => null)
    })

    const responses = await Promise.all(promises)
    const symbolToCommodity: Record<string, string> = {
      GOLD: 'XAU',
      SILVER: 'XAG',
      PLATINUM: 'XPT',
      PALLADIUM: 'XPD',
      WTI: 'WTI',
      NG: 'NG',
      XCU: 'XCU',
    }

    responses.forEach((res, i) => {
      if (res?.data && res.data.status === 'ok') {
        const commoditySym = symbolToCommodity[symbols[i]]
        const price = parseFloat(res.data.close)
        const prevClose = parseFloat(res.data.previous_close)
        const change = price - prevClose
        const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0

        result[commoditySym] = {
          price,
          change24h: change,
          changePercent24h: changePercent,
        }
      }
    })

    return result
  } catch (error) {
    console.error('Twelve Data fetch failed:', error)
    return {}
  }
}
