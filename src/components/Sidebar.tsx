import { Link, useLocation } from '@tanstack/react-router'
import { Avatar, Button } from '@heroui/react'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Bot, 
  ShieldAlert, 
  BookOpen, 
  FileText, 
  Users, 
  Settings,
  Sparkles,
  Menu,
  Home
} from 'lucide-react'
import { useState } from 'react'

const routes = [
  { key: 'overview', label: 'Overview', href: '/', icon: Home },
  { key: 'conversations', label: 'Conversations', href: '/conversations', icon: MessageSquare },
  { key: 'agents', label: 'Agents', href: '/agents', icon: Bot },
  { key: 'risk-center', label: 'Risk Center', href: '/risk-center', icon: ShieldAlert },
  { key: 'knowledge-base', label: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen },
  { key: 'custom-rules', label: 'Custom Rules', href: '/custom-rules', icon: FileText },
  { key: 'users', label: 'Users', href: '/users', icon: Users },
  { key: 'settings', label: 'Settings', href: '/settings', icon: Settings },
]

const userAccount = {
  name: 'Rajesh Kumar',
  role: 'Admin',
  avatar: 'https://i.pravatar.cc/150?u=john'
}

export default function Sidebar({ className = '', onItemClick }: { className?: string; onItemClick?: () => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const currentPath = location.pathname

  return <>
          <div className="hidden sm:block fixed left-0 top-0 h-screen w-64 z-40">
    
    <aside className={`flex flex-col h-full bg-[#101828] ${className}`}>
      {/* Brand Section */}
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <Sparkles size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white">Vera</span>
            <span className="text-xs text-white/50">Intelligence</span>
          </div>
        </div>
      </div>

      {/* Routes Section */}
      <div className="flex-1 overflow-y-auto p-2">
        <nav className="flex flex-col gap-1">
          {routes.map((route) => {
            const isActive = currentPath === route.href
            return (
              <Link
                key={route.key}
                to={route.href}
                onClick={onItemClick}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <route.icon className="h-5 w-5 flex-shrink-0" />
                <span>{route.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* User Account Section */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <Avatar
            name={"RK"}
            size="sm"
            className="flex-shrink-0 text-white font-bold"
            showFallback
            color='primary'
          />
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-medium text-white">{userAccount.name}</span>
            <span className="truncate text-xs text-white/50">{userAccount.role}</span>
          </div>
        </div>
      </div>
    </aside>
      </div>
      {/* Mobile Hamburger Button */}
      <Button
        isIconOnly
        variant="light"
        aria-label="Toggle menu"
        className="fixed top-3 left-3 z-50 sm:hidden"
        onPress={() => setIsMobileMenuOpen(true)}
      >
        <Menu />
      </Button>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50 sm:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 z-50 h-screen w-72 sm:hidden">
            <Sidebar onItemClick={() => setIsMobileMenuOpen(false)} />
          </div>
        </>
      )}
  </>

}
