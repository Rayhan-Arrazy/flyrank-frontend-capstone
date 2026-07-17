import { useState, useMemo } from 'react'
import { useValuoStore } from '../store/valuoStore'
import { CURRENCIES } from '../constants'

export default function CurrencyConverter() {
  const currencies = useValuoStore((s) => s.currencies)
  const [amount, setAmount] = useState<number>(1)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')

  const fromRate = currencies.find((c) => c.code === fromCurrency)?.exchangeRate ?? 1
  const toRate = currencies.find((c) => c.code === toCurrency)?.exchangeRate ?? 1

  const convertedAmount = useMemo(() => {
    if (!fromRate || !toRate) return 0
    return (amount / fromRate) * toRate
  }, [amount, fromRate, toRate])

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Currency Converter</h3>

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
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSwap}
            className="mt-5 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors duration-200"
            aria-label="Swap currencies"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>

          <div>
            <label className="block text-sm text-gray-500 mb-1">To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="text-sm text-gray-500">
            {amount.toLocaleString()} {fromCurrency} =
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            1 {fromCurrency} = {toRate.toFixed(6)} {toCurrency}
          </div>
        </div>
      </div>
    </div>
  )
}
