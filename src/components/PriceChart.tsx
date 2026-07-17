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
  isLoading?: boolean
}

type TimeRange = '1D' | '1W' | '1M'

export default function PriceChart({ data, symbol, isLoading }: PriceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('1W')

  const filteredData = useMemo(() => {
    if (!data.length) return []
    const now = Date.now()
    const ranges: Record<TimeRange, number> = {
      '1D': 86400000,
      '1W': 604800000,
      '1M': 2592000000,
    }
    const cutoff = now - ranges[timeRange]
    return data.filter((d) => d.timestamp >= cutoff)
  }, [data, timeRange])

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    switch (timeRange) {
      case '1D':
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      case '1W':
        return d.toLocaleDateString([], { weekday: 'short', hour: '2-digit' })
      case '1M':
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
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded w-12" />
            ))}
          </div>
          <div className="h-64 bg-gray-100 rounded" />
        </div>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-bold text-slate-800 mb-4">{symbol} Price Chart</h3>
        <p className="text-gray-400 text-center py-16">No chart data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-lg font-bold text-slate-800 mb-4">{symbol} Price Chart</h3>

      <div className="flex gap-2 mb-4">
        {(['1D', '1W', '1M'] as TimeRange[]).map((range) => (
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
    </div>
  )
}
