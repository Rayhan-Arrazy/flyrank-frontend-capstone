import { useState, useEffect, useRef, useCallback } from 'react'
import { useValuoStore } from '../store/valuoStore'
import { COMMODITIES, CURRENCIES } from '../constants'

interface SearchResult {
  type: 'commodity' | 'currency'
  id: string
  symbol: string
  name: string
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currencies = useValuoStore((s) => s.currencies)
  const commodities = useValuoStore((s) => s.commodities)

  const handleChange = useCallback((value: string) => {
    setQuery(value)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(value)
    }, 300)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const results: SearchResult[] = (() => {
    if (!debouncedQuery.trim()) return []
    const q = debouncedQuery.toLowerCase()

    const commodityResults: SearchResult[] = COMMODITIES
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
      )
      .map((c) => ({
        type: 'commodity' as const,
        id: c.id,
        symbol: c.symbol,
        name: c.name,
      }))

    const currencyResults: SearchResult[] = CURRENCIES
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
      )
      .map((c) => ({
        type: 'currency' as const,
        id: c.code,
        symbol: c.code,
        name: c.name,
      }))

    return [...commodityResults, ...currencyResults]
  })()

  const getCurrentPrice = (result: SearchResult): string => {
    if (result.type === 'commodity') {
      const c = commodities.find((c) => c.symbol === result.symbol)
      return c ? `$${c.price.toLocaleString()}` : ''
    }
    const c = currencies.find((c) => c.code === result.symbol)
    return c ? `${c.exchangeRate.toFixed(4)}` : ''
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            handleChange(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search commodities or currencies..."
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setDebouncedQuery('')
              setIsOpen(false)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && debouncedQuery.trim() && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden"
        >
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-400 text-sm">
              No results found for "{debouncedQuery}"
            </div>
          ) : (
            <ul>
              {results.map((result) => (
                <li
                  key={`${result.type}-${result.id}`}
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors duration-150"
                  onClick={() => {
                    setQuery('')
                    setDebouncedQuery('')
                    setIsOpen(false)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-semibold uppercase px-1.5 py-0.5 rounded ${
                        result.type === 'commodity'
                          ? 'text-amber-600 bg-amber-50'
                          : 'text-blue-600 bg-blue-50'
                      }`}
                    >
                      {result.type === 'commodity' ? 'CMD' : 'CUR'}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-slate-800">{result.symbol}</div>
                      <div className="text-xs text-gray-400">{result.name}</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-slate-700">{getCurrentPrice(result)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
