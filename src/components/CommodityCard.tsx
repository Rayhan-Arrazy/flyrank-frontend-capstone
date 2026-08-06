import { Commodity, WatchlistItem } from '../types'

interface CommodityCardProps {
  commodity: Commodity
  isInWatchlist: boolean
  onToggleWatchlist: (item: WatchlistItem) => void
  onClick: (commodity: Commodity) => void
}

export default function CommodityCard({
  commodity,
  isInWatchlist,
  onToggleWatchlist,
  onClick,
}: CommodityCardProps) {
  const isPositive = commodity.change24h >= 0
  const changeColor = commodity.change24h === 0 ? 'text-gray-500' : isPositive ? 'text-emerald-500' : 'text-rose-500'
  const arrowIcon = commodity.change24h === 0 ? '→' : isPositive ? '↑' : '↓'

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleWatchlist({
      id: `commodity-${commodity.id}`,
      type: 'commodity',
      symbol: commodity.symbol,
      addedAt: new Date().toISOString(),
    })
  }

  return (
    <div
      onClick={() => onClick(commodity)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-amber-200 hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-slate-800">{commodity.symbol}</span>
          <span className="text-xs text-gray-400 uppercase tracking-wide">{commodity.name}</span>
        </div>
        <button
          onClick={handleStarClick}
          className={`p-1.5 rounded-lg transition-colors duration-200 ${
            isInWatchlist ? 'text-amber-400 hover:text-amber-500' : 'text-gray-300 hover:text-gray-400'
          }`}
          aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          <svg className="w-5 h-5" fill={isInWatchlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-bold text-slate-900">
          ${commodity.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${changeColor}`}>
            {arrowIcon} ${Math.abs(commodity.change24h).toFixed(2)}
          </span>
          <span className={`text-xs ${changeColor}`}>
            ({isPositive ? '+' : ''}{commodity.changePercent24h.toFixed(2)}%)
          </span>
          <span className="text-xs text-gray-400">/ {commodity.unit}</span>
        </div>
      </div>
    </div>
  )
}
