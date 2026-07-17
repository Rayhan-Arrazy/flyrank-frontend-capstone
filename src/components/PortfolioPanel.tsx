import { Asset, PortfolioHolding } from '../types'

interface PortfolioPanelProps {
  holdings: PortfolioHolding[]
  assets: Asset[]
  onRemove: (id: string) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  commodity: 'text-amber-600 bg-amber-50',
  crypto: 'text-purple-600 bg-purple-50',
  currency: 'text-blue-600 bg-blue-50',
}

export default function PortfolioPanel({ holdings, assets, onRemove }: PortfolioPanelProps) {
  const enriched = holdings
    .map((h) => {
      const asset = assets.find((a) => a.id === h.assetId || a.symbol === h.assetId)
      if (!asset) return null
      const currentValue = asset.price * h.quantity
      const costBasis = h.buyPrice * h.quantity
      const pnl = currentValue - costBasis
      const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0
      return { ...h, asset, currentValue, costBasis, pnl, pnlPercent }
    })
    .filter(Boolean) as (PortfolioHolding & {
    asset: Asset
    currentValue: number
    costBasis: number
    pnl: number
    pnlPercent: number
  })[]

  const totalValue = enriched.reduce((sum, h) => sum + h.currentValue, 0)
  const totalCost = enriched.reduce((sum, h) => sum + h.costBasis, 0)
  const totalPnl = totalValue - totalCost
  const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0

  if (!holdings.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Portfolio</h3>
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
          <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">Your portfolio is empty</p>
          <p className="text-xs mt-1">Click the + button on any asset to add it</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Portfolio</h3>
        <div className="text-right">
          <div className="text-sm font-bold text-slate-800">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className={`text-xs ${totalPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)} ({totalPnlPercent >= 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {enriched.map((h) => (
          <div
            key={h.id}
            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-150"
          >
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${CATEGORY_COLORS[h.category] || 'bg-gray-50 text-gray-600'}`}>
                {h.category === 'commodity' ? 'CMD' : h.category === 'crypto' ? 'CRYPTO' : 'CUR'}
              </span>
              <div>
                <div className="text-sm font-medium text-slate-800">{h.symbol}</div>
                <div className="text-xs text-gray-400">{h.name}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-slate-800">
                  {h.quantity.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </div>
                <div className={`text-xs ${h.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  ${h.currentValue.toFixed(2)} ({h.pnl >= 0 ? '+' : ''}{h.pnlPercent.toFixed(1)}%)
                </div>
              </div>
              <button
                onClick={() => onRemove(h.id)}
                className="p-1.5 text-gray-300 hover:text-rose-500 transition-colors duration-200"
                aria-label={`Sell ${h.symbol}`}
                title="Sell position"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
