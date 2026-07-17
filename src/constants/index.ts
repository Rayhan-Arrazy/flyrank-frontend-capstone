import { AssetCategory } from '../types'

export const CATEGORIES: { key: AssetCategory | 'all'; label: string; color: string }[] = [
  { key: 'all', label: 'All Assets', color: 'bg-slate-800 text-white' },
  { key: 'commodity', label: 'Commodities', color: 'bg-amber-500 text-slate-900' },
  { key: 'crypto', label: 'Crypto', color: 'bg-purple-500 text-white' },
  { key: 'currency', label: 'Currencies', color: 'bg-blue-500 text-white' },
]

export const COMMODITIES = [
  { id: 'gold', name: 'Gold', symbol: 'XAU', unit: 'oz' },
  { id: 'silver', name: 'Silver', symbol: 'XAG', unit: 'oz' },
  { id: 'platinum', name: 'Platinum', symbol: 'XPT', unit: 'oz' },
  { id: 'palladium', name: 'Palladium', symbol: 'XPD', unit: 'oz' },
  { id: 'copper', name: 'Copper', symbol: 'XCU', unit: 'lb' },
  { id: 'wti', name: 'Crude Oil WTI', symbol: 'WTI', unit: 'bbl' },
  { id: 'ng', name: 'Natural Gas', symbol: 'NG', unit: 'MMBtu' },
] as const

export const CRYPTO_ASSETS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', unit: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', unit: 'ETH' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', unit: 'SOL' },
  { id: 'ripple', name: 'Ripple', symbol: 'XRP', unit: 'XRP' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', unit: 'ADA' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', unit: 'DOGE' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', unit: 'DOT' },
] as const

export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'IDR', name: 'Indonesian Rupiah' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'SGD', name: 'Singapore Dollar' },
] as const

export type CommoditySymbol = (typeof COMMODITIES)[number]['symbol']
export type CryptoCurrency = (typeof CRYPTO_ASSETS)[number]['symbol']
export type CurrencyCode = (typeof CURRENCIES)[number]['code']
