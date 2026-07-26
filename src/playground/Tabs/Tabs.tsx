import React, { useState } from 'react'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultActiveId?: string
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultActiveId }) => {
  const [activeId, setActiveId] = useState(defaultActiveId || tabs[0]?.id || '')
  return (
    <div>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => setActiveId(tab.id)}>
          {tab.label}
        </button>
      ))}
      {tabs.map(tab => (
        <div key={tab.id} style={{ display: tab.id === activeId ? 'block' : 'none' }}>
          {tab.content}
        </div>
      ))}
    </div>
  )
}
