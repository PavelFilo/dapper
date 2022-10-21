interface ISidebarProps {
  isOpen: boolean
  side: 'left' | 'right'
}

export const Sidebar = ({ isOpen, side }: ISidebarProps) => {
  return <div className="flex">{/* TODO: sidebar */}</div>
}
