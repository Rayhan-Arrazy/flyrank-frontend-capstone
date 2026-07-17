import { useValuoStore } from '../store/valuoStore'

export default function Watchlist() {
  const watchlist = useValuoStore((s) => s.watchlist)
  const commodities = useValuoStore((s) => s.commodities)
  const currencies = useValuoStore((s) => s.currencies)
  const removeFromWatchlist = useValuoStore((s) => s.removeFromWatchlist)

  const getItemData = (item: (typeof watchlist)[0]) => {
    if (item.type === 'commodity') {
      const c = commodities.find((c) => `commodity-${c.id}` === item.id)
      if (!c) return null
      return {
        name: c.name,
        symbol: c.symbol,
        price: c.price,
        change24h: c.change24h,
        changePercent24h: c.changePercent24h,
        type: 'commodity' as const,
      }
    }
    const c = currencies.find((c) => c.code === item.symbol)
    if (!c) return null
    return {
      name: c.name,
      symbol: c.code,
      price: c.exchangeRate,
      change24h: c.change24h,
      changePercent24h: 0,
      type: 'currency' as const,
    }
  }

  if (watchlist.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Watchlist</h3>
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
          <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          <p className="text-sm">Your watchlist is empty</p>
          <p className="text-xs mt-1">Star items to add them here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Watchlist</h3>
        <span className="text-xs text-gray-400">{watchlist.length} items</span>
      </div>

      <div className="space-y-2">
        {watchlist.map((item) => {
          const data = getItemData(item)
          if (!data) return null

          const isPositive = data.change24h >= 0
          const changeColor = data.change24h === 0 ? 'text-gray-500' : isPositive ? 'text-emerald-500' : 'text-rose-500'

          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-150"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                    data.type === 'commodity' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50'
                  }`}
                >
                  {data.type === 'commodity' ? 'CMD' : 'CUR'}
                </span>
                <div>
                  <div className="text-sm font-medium text-slate-800">{data.symbol}</div>
                  <div className="text-xs text-gray-400">{data.name}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-800">
                    {data.type === 'commodity'
                      ? `$${data.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      : data.price.toFixed(4)}
                  </div>
                  <div className={`text-xs ${changeColor}`}>
                    {isPositive ? '+' : ''}{data.change24h.toFixed(2)} ({isPositive ? '+' : ''}{data.changePercent24h.toFixed(2)}%)
                  </div>
                </div>
                <button
                  onClick={() => removeFromWatchlist(item.id)}
                  className="p-1.5 text-gray-300 hover:text-rose-500 transition-colors duration-200"
                  aria-label={`Remove ${data.symbol} from watchlist`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
