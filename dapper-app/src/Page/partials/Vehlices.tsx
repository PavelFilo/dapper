import { useState } from 'react'
import { Input } from '../../components/Input'
import { Sidebar } from '../../components/Sidebar'

export const Vehlices = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button
        className="z-400 absolute right-4 top-5"
        onClick={() => setIsOpen(true)}
      >
        open
      </button>

      <Sidebar className="px-4 py-5" isOpen={isOpen} side="right">
        <div className="h-full flex flex-col">
          <div className="gap-2 flex-1 flex-col flex items-start">
            <div className="flex w-full justify-end">
              <button className="float-right" onClick={() => setIsOpen(false)}>
                close
              </button>
            </div>

            <Input type="number" label="Number of vehicles" />
          </div>

          <div className="flex items-start">
            <button>GENERTE ROUTES</button>
          </div>
        </div>
      </Sidebar>
    </>
  )
}
