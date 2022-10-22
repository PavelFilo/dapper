import { useState } from 'react'
import { generateRoutes } from '../../api/endpoints'
import { Input } from '../../components/Input'
import { Sidebar } from '../../components/Sidebar'
import Vehicle from '../../assets/car-filled.svg';
import Close from '../../assets/close-big.svg';


interface IVehiclesProps {
  onFetchRoutes: (vehicleCount: number) => void
}

export const Vehlices = ({ onFetchRoutes }: IVehiclesProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState(1)
  return (
    <>
    {/* BUTTON vehilce */}
      <button
        className="z-400 absolute right-4 top-5 p-2 rounded-3xl bg-dark"
        onClick={() => setIsOpen(true)}
      >
        <img className='vehicle ' src={Vehicle} alt="" />        

      </button>

      <Sidebar className="px-4 py-5 bg-yellow-400" isOpen={isOpen} side="right">
        <div className="h-full flex flex-col">
        <div className='flex items-start justify-start pb-3'>
            <button className=' p-1 rounded-3xl bg-dark ' onClick={() => setIsOpen(false)}>
             <img className="close" src={Close} alt="" />
            </button>
            </div>

          <div className="gap-2 flex-1 flex-col flex items-start ">
            <Input
              type="number"
              label="Number of vehicles"
              value={value}
              onChange={({ target: { value } }) => setValue(+value)}
            />
          </div>

          <div className="flex items-center justify-center pb-5 ">
            <button className='bg-success font-extrabold' onClick={() => onFetchRoutes(value)}>GENERTE ROUTES</button>
          </div>
        </div>
      </Sidebar>
    </>
  )
}
