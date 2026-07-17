import { Asset, WatchlistItem } from '../types'

interface AssetCardProps {
  asset: Asset
  isInWatchlist: boolean
  isInPortfolio: boolean
  onToggleWatchlist: (item: WatchlistItem) => void
  onAddToPortfolio: (asset: Asset) => void
  onClick: (asset: Asset) => void
}

const CATEGORY_STYLES: Record<string, { badge: string; border: string }> = {
  commodity: { badge: 'bg-amber-50 text-amber-600', border: 'hover:border-amber-200' },
  crypto: { badge: 'bg-purple-50 text-purple-600', border: 'hover:border-purple-200' },
  currency: { badge: 'bg-blue-50 text-blue-600', border: 'hover:border-blue-200' },
}

export default function AssetCard({
  asset,
  isInWatchlist,
  isInPortfolio,
  onToggleWatchlist,
  onAddToPortfolio,
  onClick,
}: AssetCardProps) {
  const isPositive = asset.change24h >= 0
  const changeColor = asset.change24h === 0 ? 'text-gray-500' : isPositive ? 'text-emerald-500' : 'text-rose-500'
  const arrowIcon = asset.change24h === 0 ? '\u2192' : isPositive ? '\u2191' : '\u2193'
  const style = CATEGORY_STYLES[asset.category] || CATEGORY_STYLES.commodity

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleWatchlist({
      id: `${asset.category}-${asset.id}`,
      type: asset.category,
      symbol: asset.symbol,
      addedAt: new Date().toISOString(),
    })
  }

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToPortfolio(asset)
  }

  return (
    <div
      onClick={() => onClick(asset)}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${style.border} hover:-translate-y-0.5`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${style.badge}`}>
            {asset.category.toUpperCase()}
          </span>
          <span className="text-lg font-bold text-slate-800">{asset.symbol}</span>
          {asset.unit && asset.category === 'commodity' && (
            <span className="text-xs text-gray-400">/{asset.unit}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!isInPortfolio && (
            <button
              onClick={handleBuyClick}
              className="p-1.5 text-emerald-400 hover:text-emerald-500 transition-colors duration-200"
              aria-label={`Buy ${asset.symbol}`}
              title="Add to portfolio"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
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
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-2xl font-bold text-slate-900">
            ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${changeColor}`}>
              {arrowIcon} ${Math.abs(asset.change24h).toFixed(2)}
            </span>
            <span className={`text-xs ${changeColor}`}>
              ({isPositive ? '+' : ''}{asset.changePercent24h.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">{asset.name}</div>
        </div>
      </div>
    </div>
  )
}
