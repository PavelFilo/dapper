import { useState } from 'react'
import { generateRoutes } from '../../api/endpoints'
import { Input } from '../../components/Input'
import { Sidebar } from '../../components/Sidebar'

interface IVehiclesProps {
  onFetchRoutes: (vehicleCount: number) => void
}

export const Vehlices = ({ onFetchRoutes }: IVehiclesProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState(1)
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

            <Input
              type="number"
              label="Number of vehicles"
              value={value}
              onChange={({ target: { value } }) => setValue(+value)}
            />
          </div>

          <div className="flex items-start">
            <button onClick={() => onFetchRoutes(value)}>GENERTE ROUTES</button>
          </div>
        </div>
      </Sidebar>
    </>
  )
}
