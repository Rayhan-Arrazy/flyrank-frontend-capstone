import React, { useState, useId } from 'react'

interface DisclosureProps {
  label: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export const Disclosure: React.FC<DisclosureProps> = ({ label, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const id = useId()
  const panelId = `disclosure-panel-${id}`
  const buttonId = `disclosure-button-${id}`

  return (
    <div>
      <button
        role="button"
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="font-medium">{label}</span>
        <span className="ml-2 text-sm">{isOpen ? '▼' : '▶'}</span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className="px-4 py-3 border border-gray-200 rounded-b-lg"
      >
        {children}
      </div>
    </div>
  )
}
