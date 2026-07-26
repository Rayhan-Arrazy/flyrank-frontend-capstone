import { useState } from 'react'
import { Modal } from './Modal'
import { Tabs } from './Tabs'
import { Disclosure } from './Disclosure'

export const Playground = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const sampleTabs = [
    { id: 'tab1', label: 'Tab 1', content: <p>Content for Tab 1</p> },
    { id: 'tab2', label: 'Tab 2', content: <p>Content for Tab 2</p> },
    { id: 'tab3', label: 'Tab 3', content: <p>Content for Tab 3</p> },
  ]

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      <h1 className="text-3xl font-bold mb-6">Accessible Component Playground</h1>
      <p className="text-gray-500 mb-8">Testing FE-05 components.</p>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Modal</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Open Modal
        </button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
        >
          <p>This is an accessible modal dialog built with React and Tailwind CSS.</p>
        </Modal>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Tabs</h2>
        <Tabs tabs={sampleTabs} />
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold mb-4">Disclosure</h2>
        <Disclosure label="What is this project?">
          <p>This is an accessible component playground built with React and Tailwind CSS.</p>
        </Disclosure>
        <Disclosure label="How does it work?" defaultOpen>
          <p>Each component follows WAI-ARIA guidelines for accessibility.</p>
        </Disclosure>
      </section>
    </div>
  )
}
