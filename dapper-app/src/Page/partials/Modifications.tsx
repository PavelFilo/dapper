import { useState } from 'react'
import { Input } from '../../components/Input'
import { Sidebar } from '../../components/Sidebar'

export const Modifications = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="z-500 absolute left-4 top-5"
        onClick={() => setIsOpen(true)}
      >
        open
      </button>

      <Sidebar className="px-4 py-5" isOpen={isOpen} side="left">
        <div className="h-full flex flex-col">
          <div className="gap-2 flex-1 flex-col flex items-start">
            <button onClick={() => setIsOpen(false)}>close</button>

            <Input label="Layer 1" />
            <Input label="Layer 2" />
            <Input label="Layer 3" />
            <Input label="Layer 4" />
          </div>

          <div className="flex items-start">
            <button>GENERATE MAP</button>
          </div>
        </div>
      </Sidebar>
    </>
  )
}
