import { ReactNode } from 'react'

interface ISidebarProps {
  isOpen: boolean
  side: 'left' | 'right'
  children: ReactNode
}

export const Sidebar = ({ isOpen, side, children }: ISidebarProps) => {
  const translateMap = {
    right: isOpen ? 'translate-x-0' : 'translate-x-full',
    left: isOpen ? '-translate-x-0' : '-translate-x-full',
  }

  return (
    <div
      className={`${
        side === 'right' ? 'right-0' : 'left-0'
      } z-1000 bg-blue absolute h-screen w-24 ${translateMap[side]}`}
    >
      {children}
    </div>
  )
}
