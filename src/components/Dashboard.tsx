import { useState, useCallback } from 'react'
import { useValuoStore } from '../store/valuoStore'
import { useRealtimePrices } from '../hooks/useRealtimePrices'
import AssetCard from './AssetCard'
import CategoryTabs from './CategoryTabs'
import UnifiedConverter from './UnifiedConverter'
import CommodityCharts from './CommodityCharts'
import PortfolioPanel from './PortfolioPanel'
import SearchBar from './SearchBar'
import Watchlist from './Watchlist'
import { Asset, WatchlistItem, PortfolioHolding } from '../types'

export default function Dashboard() {
  const assets = useValuoStore((s) => s.assets)
  const watchlist = useValuoStore((s) => s.watchlist)
  const portfolio = useValuoStore((s) => s.portfolio)
  const selectedCategory = useValuoStore((s) => s.selectedCategory)
  const addToWatchlist = useValuoStore((s) => s.addToWatchlist)
  const removeFromWatchlist = useValuoStore((s) => s.removeFromWatchlist)
  const addToPortfolio = useValuoStore((s) => s.addToPortfolio)
  const removeFromPortfolio = useValuoStore((s) => s.removeFromPortfolio)
  const setSelectedCategory = useValuoStore((s) => s.setSelectedCategory)
  const isLoading = useValuoStore((s) => s.isLoading)
  const error = useValuoStore((s) => s.error)
  const lastUpdated = useValuoStore((s) => s.lastUpdated)
  const refreshPrices = useValuoStore((s) => s.refreshPrices)

  const [showPortfolio, setShowPortfolio] = useState(false)

  useRealtimePrices(15000)

  const filteredAssets = selectedCategory === 'all'
    ? assets
    : assets.filter((a) => a.category === selectedCategory)

  const categoryCounts: Record<string, number> = {
    all: assets.length,
    commodity: assets.filter((a) => a.category === 'commodity').length,
    crypto: assets.filter((a) => a.category === 'crypto').length,
    currency: assets.filter((a) => a.category === 'currency').length,
  }

  const commodities = assets.filter((a) => a.category === 'commodity')

  const handleToggleWatchlist = useCallback(
    (item: WatchlistItem) => {
      const exists = watchlist.find((w) => w.id === item.id)
      if (exists) {
        removeFromWatchlist(item.id)
      } else {
        addToWatchlist(item)
      }
    },
    [watchlist, addToWatchlist, removeFromWatchlist]
  )

  const handleAddToPortfolio = useCallback(
    (asset: Asset) => {
      const existing = portfolio.find((h) => h.assetId === asset.id || h.assetId === asset.symbol)
      const holding: PortfolioHolding = {
        id: `holding-${asset.id}-${Date.now()}`,
        assetId: asset.id,
        name: asset.name,
        symbol: asset.symbol,
        quantity: (existing?.quantity || 0) + 1,
        buyPrice: asset.price,
        boughtAt: new Date().toISOString(),
        category: asset.category,
      }
      addToPortfolio(holding)
    },
    [portfolio, addToPortfolio]
  )

  const isInWatchlist = (assetId: string, cat: string) =>
    watchlist.some((w) => w.id === `${cat}-${assetId}`)

  const isInPortfolio = (assetId: string) =>
    portfolio.some((h) => h.assetId === assetId || h.assetId === assetId)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-800 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight">Valuo</h1>
              <span className="hidden sm:inline text-sm text-slate-400">One-Stop Asset Platform</span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <SearchBar />
              <div className="flex items-center gap-3 text-xs text-slate-400">
                {lastUpdated && (
                  <span>Updated: {new Date(lastUpdated).toLocaleTimeString()}</span>
                )}
                <button
                  onClick={() => setShowPortfolio(!showPortfolio)}
                  className={`px-3 py-1.5 font-medium rounded-lg transition-colors duration-200 text-xs ${
                    showPortfolio
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Portfolio {portfolio.length > 0 && `(${portfolio.length})`}
                </button>
                <button
                  onClick={refreshPrices}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-amber-500 text-slate-900 font-medium rounded-lg hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-xs"
                >
                  {isLoading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-rose-700">{error}</span>
            </div>
            <button
              onClick={refreshPrices}
              className="px-3 py-1.5 bg-rose-100 text-rose-700 font-medium rounded-lg hover:bg-rose-200 transition-colors duration-200 text-sm"
            >
              Retry
            </button>
          </div>
        )}

        <div className="flex md:hidden items-center justify-between mb-4 text-xs text-gray-400">
          {lastUpdated && <span>Updated: {new Date(lastUpdated).toLocaleTimeString()}</span>}
          <div className="flex gap-2">
            <button
              onClick={() => setShowPortfolio(!showPortfolio)}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors duration-200 text-xs ${
                showPortfolio ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Portfolio {portfolio.length > 0 && `(${portfolio.length})`}
            </button>
            <button
              onClick={refreshPrices}
              disabled={isLoading}
              className="px-3 py-1.5 bg-amber-500 text-slate-900 font-medium rounded-lg hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-xs"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <CategoryTabs
            selected={selectedCategory}
            onChange={setSelectedCategory}
            counts={categoryCounts}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {showPortfolio ? (
              <PortfolioPanel
                holdings={portfolio}
                assets={assets}
                onRemove={removeFromPortfolio}
              />
            ) : (
              <Watchlist />
            )}

            {isLoading && filteredAssets.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
                    <div className="flex justify-between mb-3">
                      <div className="h-5 bg-gray-200 rounded w-20" />
                      <div className="h-5 bg-gray-200 rounded w-5" />
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-28 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-36" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredAssets.map((asset) => (
                  <AssetCard
                    key={`${asset.category}-${asset.id}`}
                    asset={asset}
                    isInWatchlist={isInWatchlist(asset.id, asset.category)}
                    isInPortfolio={isInPortfolio(asset.id)}
                    onToggleWatchlist={handleToggleWatchlist}
                    onAddToPortfolio={handleAddToPortfolio}
                    onClick={() => {}}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <UnifiedConverter assets={assets} />
          </div>
        </div>

        {commodities.length > 0 && (
          <div className="mt-6">
            <CommodityCharts commodities={commodities} />
          </div>
        )}
      </main>
    </div>
  )
}
