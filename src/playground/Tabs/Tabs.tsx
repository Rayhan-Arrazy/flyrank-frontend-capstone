import React, { useState, useRef, useCallback } from 'react'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultActiveId?: string
  onChange?: (id: string) => void
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultActiveId, onChange }) => {
  const [activeId, setActiveId] = useState(defaultActiveId || tabs[0]?.id || '')
  const tabListRef = useRef<HTMLDivElement>(null)

  const activateTab = useCallback(
    (id: string) => {
      setActiveId(id)
      onChange?.(id)
    },
    [onChange]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = tabs.findIndex((t) => t.id === activeId)
    let nextIndex: number | null = null

    switch (e.key) {
      case 'ArrowLeft':
        nextIndex = currentIndex - 1
        if (nextIndex < 0) nextIndex = tabs.length - 1
        break
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % tabs.length
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = tabs.length - 1
        break
      default:
        return
    }

    e.preventDefault()
    const nextTab = tabs[nextIndex]
    if (nextTab) {
      activateTab(nextTab.id)
      const tabList = tabListRef.current
      if (tabList) {
        const tabButton = tabList.querySelector<HTMLButtonElement>(
          `[role="tab"][data-tab-id="${nextTab.id}"]`
        )
        tabButton?.focus()
      }
    }
  }

  return (
    <div>
      <div
        ref={tabListRef}
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className="flex border-b border-gray-200"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            data-tab-id={tab.id}
            id={`tab-${tab.id}`}
            aria-selected={tab.id === activeId}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => activateTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              tab.id === activeId
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`tabpanel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== activeId}
          className="p-4"
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}
