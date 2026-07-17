import { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { PriceHistory } from '../types'

interface PriceChartProps {
  data: PriceHistory[]
  symbol: string
  price?: number
  isLoading?: boolean
}

type TimeRange = '1D' | '1W' | '1M' | '3M'

function generateMockData(basePrice: number, days: number, pointsPerDay: number): PriceHistory[] {
  const now = Date.now()
  const totalPoints = days * pointsPerDay
  const interval = (days * 86400000) / totalPoints
  const data: PriceHistory[] = []
  let price = basePrice * (0.95 + Math.random() * 0.1)

  for (let i = totalPoints; i >= 0; i--) {
    const timestamp = now - i * interval
    const volatility = basePrice * 0.015
    price += (Math.random() - 0.49) * volatility
    price = Math.max(price, basePrice * 0.001)
    data.push({ timestamp, price: Math.round(price * 100) / 100 })
  }
  return data
}

const RANGES: Record<TimeRange, { ms: number; days: number; ppd: number }> = {
  '1D': { ms: 86400000, days: 1, ppd: 48 },
  '1W': { ms: 604800000, days: 7, ppd: 24 },
  '1M': { ms: 2592000000, days: 30, ppd: 8 },
  '3M': { ms: 7776000000, days: 90, ppd: 4 },
}

export default function PriceChart({ data, symbol, price, isLoading }: PriceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('1W')

  const displayData = useMemo(() => {
    if (data.length > 0) return data
    if (price && price > 0) {
      const cfg = RANGES['3M']
      return generateMockData(price, cfg.days, cfg.ppd)
    }
    return []
  }, [data, price])

  const filteredData = useMemo(() => {
    if (!displayData.length) return []
    const now = Date.now()
    const cutoff = now - RANGES[timeRange].ms
    return displayData.filter((d) => d.timestamp >= cutoff)
  }, [displayData, timeRange])

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    switch (timeRange) {
      case '1D':
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      case '1W':
        return d.toLocaleDateString([], { weekday: 'short', hour: '2-digit' })
      case '1M':
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
      case '3M':
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const formatPrice = (value: number) =>
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-32" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded w-12" />
            ))}
          </div>
          <div className="h-64 bg-gray-100 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold text-slate-800">{symbol} Price Chart</h3>
        {price && <span className="text-sm text-slate-500">${price.toFixed(2)}</span>}
      </div>

      <div className="flex gap-2 mb-4">
        {(['1D', '1W', '1M', '3M'] as TimeRange[]).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
              timeRange === range
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {!displayData.length ? (
        <p className="text-gray-400 text-center py-16">No chart data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTime}
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatPrice}
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip
              formatter={(value) => [formatPrice(Number(value)), 'Price']}
              labelFormatter={(label) => new Date(Number(label)).toLocaleString()}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#f59e0b' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
