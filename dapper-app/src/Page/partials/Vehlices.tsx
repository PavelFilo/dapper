import { useState } from 'react'
import { Sidebar } from '../../components/Sidebar'

export const Vehlices = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <div
        className="absolute right-2 top-2"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        abc
      </div>

      <Sidebar isOpen={isOpen} side="right">
        <div onClick={() => setIsOpen((prev) => !prev)}>abc</div>
      </Sidebar>
    </>
  )
}
