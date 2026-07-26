import React, { useState } from 'react'

interface DisclosureProps {
  label: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export const Disclosure: React.FC<DisclosureProps> = ({ label, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {label} {isOpen ? '▼' : '▶'}
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  )
}
