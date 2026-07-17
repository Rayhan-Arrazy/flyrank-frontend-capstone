import { useState, useEffect } from 'react'
import { Asset, AssetCategory } from '../types'

interface UnifiedConverterProps {
  assets: Asset[]
  initialFrom?: string
  initialTo?: string
}

const CATEGORY_LABELS: Record<string, string> = {
  commodity: 'CMD',
  crypto: 'CRYPTO',
  currency: 'CUR',
}

const CATEGORY_COLORS: Record<string, string> = {
  commodity: 'text-amber-600 bg-amber-50',
  crypto: 'text-purple-600 bg-purple-50',
  currency: 'text-blue-600 bg-blue-50',
}

const TABS: { key: AssetCategory | 'all'; label: string; color: string }[] = [
  { key: 'all', label: 'All', color: 'bg-slate-800 text-white' },
  { key: 'commodity', label: 'Commodities', color: 'bg-amber-500 text-white' },
  { key: 'crypto', label: 'Crypto', color: 'bg-purple-500 text-white' },
  { key: 'currency', label: 'Currencies', color: 'bg-blue-500 text-white' },
]

const DEFAULT_PAIRS: Record<string, { from: string; to: string }> = {
  all: { from: 'USD', to: 'XAU' },
  commodity: { from: 'XAU', to: 'XAG' },
  crypto: { from: 'BTC', to: 'ETH' },
  currency: { from: 'USD', to: 'EUR' },
}

export default function UnifiedConverter({ assets, initialFrom, initialTo }: UnifiedConverterProps) {
  const [filterCategory, setFilterCategory] = useState<AssetCategory | 'all'>('all')
  const [amount, setAmount] = useState<number>(1)
  const [fromAsset, setFromAsset] = useState<string>(initialFrom || DEFAULT_PAIRS.all.from)
  const [toAsset, setToAsset] = useState<string>(initialTo || DEFAULT_PAIRS.all.to)
  const [result, setResult] = useState<number>(0)

  useEffect(() => {
    if (initialFrom && assets.some((a) => a.symbol === initialFrom)) {
      setFromAsset(initialFrom)
    }
  }, [initialFrom])

  useEffect(() => {
    if (initialTo && assets.some((a) => a.symbol === initialTo)) {
      setToAsset(initialTo)
    }
  }, [initialTo])

  useEffect(() => {
    const pair = DEFAULT_PAIRS[filterCategory]
    if (pair && assets.some((a) => a.symbol === pair.from) && assets.some((a) => a.symbol === pair.to)) {
      setFromAsset(pair.from)
      setToAsset(pair.to)
    }
  }, [filterCategory])

  const filtered = filterCategory === 'all'
    ? assets
    : assets.filter((a) => a.category === filterCategory)

  const from = filtered.find((a) => a.symbol === fromAsset) || assets.find((a) => a.symbol === fromAsset)
  const to = filtered.find((a) => a.symbol === toAsset) || assets.find((a) => a.symbol === toAsset)
  const fromPrice = from?.price ?? 1
  const toPrice = to?.price ?? 1

  const handleConvert = () => {
    const numAmount = parseFloat(String(amount)) || 0
    setResult((numAmount * fromPrice) / toPrice)
  }

  useEffect(() => {
    if (amount && parseFloat(String(amount)) > 0) {
      handleConvert()
    }
  }, [amount, fromAsset, toAsset, filtered])

  const handleSwap = () => {
    setFromAsset(toAsset)
    setToAsset(fromAsset)
  }

  const sorted = [...filtered].sort((a, b) => {
    const order = { commodity: 0, crypto: 1, currency: 2 }
    const ca = order[a.category] ?? 0
    const cb = order[b.category] ?? 0
    return ca - cb || a.symbol.localeCompare(b.symbol)
  })

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-lg font-bold text-slate-800 mb-3">Converter</h3>

      <div className="flex gap-1 mb-4">
        {TABS.map((tab) => {
          const isActive = filterCategory === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setFilterCategory(tab.key)}
              className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                isActive
                  ? tab.color + ' shadow-sm'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            min={0}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div>
            <label className="block text-sm text-gray-500 mb-1">From</label>
            <select
              value={fromAsset}
              onChange={(e) => setFromAsset(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white text-sm"
            >
              {sorted.map((a) => (
                <option key={`from-${a.category}-${a.symbol}`} value={a.symbol}>
                  {a.symbol} — {a.name} ({CATEGORY_LABELS[a.category]})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSwap}
            className="mt-5 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors duration-200"
            aria-label="Swap assets"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>

          <div>
            <label className="block text-sm text-gray-500 mb-1">To</label>
            <select
              value={toAsset}
              onChange={(e) => setToAsset(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white text-sm"
            >
              {sorted.map((a) => (
                <option key={`to-${a.category}-${a.symbol}`} value={a.symbol}>
                  {a.symbol} — {a.name} ({CATEGORY_LABELS[a.category]})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            {from && (
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${CATEGORY_COLORS[from.category]}`}>
                {CATEGORY_LABELS[from.category]}
              </span>
            )}
            <span className="text-sm text-gray-500">
              {parseFloat(String(amount)).toLocaleString()} {fromAsset} =
            </span>
          </div>
          <div className="flex items-center gap-2">
            {to && (
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${CATEGORY_COLORS[to.category]}`}>
                {CATEGORY_LABELS[to.category]}
              </span>
            )}
            <div className="text-2xl font-bold text-slate-800">
              {result.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 6 })} {toAsset}
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            1 {fromAsset} = {(fromPrice / toPrice).toFixed(6)} {toAsset}
          </div>
        </div>
      </div>
    </div>
  )
}
