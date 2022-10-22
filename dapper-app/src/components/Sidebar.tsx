import { ReactNode } from 'react'

interface ISidebarProps {
  isOpen: boolean
  side: 'left' | 'right'
  children: ReactNode
  className?: string
}

export const Sidebar = ({
  className,
  isOpen,
  side,
  children,
}: ISidebarProps) => {
  const translateMap = {
    right: isOpen ? 'translate-x-0' : 'translate-x-full',
    left: isOpen ? '-translate-x-0' : '-translate-x-full',
  }

  return (
    <div
      className={`${
        side === 'right' ? 'right-0 rounded-l-lg' : 'left-0 rounded-r-lg'
      } z-1000 transition-transform bg-dark absolute h-screen w-80 ${
        translateMap[side]
      } ${className}`}
    >
      <div className="w-full h-full">{children}</div>
    </div>
  )
}
