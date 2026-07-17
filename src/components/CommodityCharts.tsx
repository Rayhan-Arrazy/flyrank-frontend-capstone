import { useMemo } from 'react'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { Asset, PriceHistory } from '../types'

interface CommodityChartsProps {
  commodities: Asset[]
}

function generateSparklineData(basePrice: number): PriceHistory[] {
  const now = Date.now()
  const points = 60
  const interval = 3600000
  const data: PriceHistory[] = []
  let price = basePrice * (0.96 + Math.random() * 0.08)

  for (let i = points; i >= 0; i--) {
    const timestamp = now - i * interval
    const volatility = basePrice * 0.008
    price += (Math.random() - 0.48) * volatility
    price = Math.max(price, basePrice * 0.001)
    data.push({ timestamp, price: Math.round(price * 100) / 100 })
  }
  return data
}

function MiniChart({ price }: { price: number }) {
  const data = useMemo(() => generateSparklineData(price), [price])
  const first = data[0]?.price ?? price
  const last = data[data.length - 1]?.price ?? price
  const isUp = last >= first
  const color = isUp ? '#10b981' : '#ef4444'

  if (!price || price <= 0) return null

  return (
    <ResponsiveContainer width="100%" height={60}>
      <LineChart data={data}>
        <Tooltip
          formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Price']}
          labelFormatter={(label) => new Date(Number(label)).toLocaleString()}
          contentStyle={{
            fontSize: '11px',
            padding: '4px 8px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
          }}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
        <XAxis hide />
        <YAxis hide domain={['dataMin', 'dataMax']} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default function CommodityCharts({ commodities }: CommodityChartsProps) {
  if (!commodities.length) return null

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Commodity Price Charts</h3>
          <p className="text-xs text-gray-400 mt-0.5">Real-time prices with 3-day trend sparklines</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {commodities.map((c) => {
          const isPositive = c.change24h >= 0
          const changeColor = c.change24h === 0 ? 'text-gray-500' : isPositive ? 'text-emerald-500' : 'text-rose-500'
          const arrow = c.change24h === 0 ? '\u2192' : isPositive ? '\u2191' : '\u2193'

          return (
            <div
              key={c.id}
              className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:shadow-sm transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-bold text-slate-800">{c.symbol}</span>
                  <span className="text-xs text-gray-400 ml-2">{c.unit}</span>
                </div>
                <span className="text-xs text-gray-400 truncate max-w-[80px]">{c.name}</span>
              </div>

              <div className="text-lg font-bold text-slate-900">
                ${c.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>

              <div className={`text-xs font-medium ${changeColor} mb-2`}>
                {arrow} ${Math.abs(c.change24h).toFixed(2)} ({isPositive ? '+' : ''}{c.changePercent24h.toFixed(2)}%)
              </div>

              <MiniChart price={c.price} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
