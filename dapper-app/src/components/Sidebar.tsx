import { ReactNode } from 'react'

interface ISidebarProps {
  isOpen: boolean
  side: 'left' | 'right'
  children: ReactNode
}

export const Sidebar = ({ isOpen, side, children }: ISidebarProps) => {
  return (
    <div
      className={`z-1000 bg-blue absolute h-screen w-24 ${side}-0 ${
        side === 'right' ? '' : '-'
      }translate-x-${isOpen ? 'full' : '0'}`}
    >
      {children}
    </div>
  )
}
