export const COMMODITIES = [
  { id: 'gold', name: 'Gold', symbol: 'XAU', unit: 'oz' },
  { id: 'silver', name: 'Silver', symbol: 'XAG', unit: 'oz' },
  { id: 'platinum', name: 'Platinum', symbol: 'XPT', unit: 'oz' },
  { id: 'palladium', name: 'Palladium', symbol: 'XPD', unit: 'oz' },
  { id: 'copper', name: 'Copper', symbol: 'XCU', unit: 'lb' },
  { id: 'crude-oil', name: 'Crude Oil WTI', symbol: 'WTI', unit: 'bbl' },
  { id: 'natural-gas', name: 'Natural Gas', symbol: 'NG', unit: 'MMBtu' },
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
export type CurrencyCode = (typeof CURRENCIES)[number]['code']
