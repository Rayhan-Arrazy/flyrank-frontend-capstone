import { AssetCategory } from '../types'
import { CATEGORIES } from '../constants'

interface CategoryTabsProps {
  selected: AssetCategory | 'all'
  onChange: (category: AssetCategory | 'all') => void
  counts: Record<string, number>
}

export default function CategoryTabs({ selected, onChange, counts }: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const count = counts[cat.key] ?? 0
        const isActive = selected === cat.key
        return (
          <button
            key={cat.key}
            onClick={() => onChange(cat.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              isActive
                ? cat.color + ' shadow-sm'
                : 'bg-white text-slate-600 border border-gray-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
            <span className={`ml-2 text-xs ${isActive ? 'opacity-80' : 'text-gray-400'}`}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
