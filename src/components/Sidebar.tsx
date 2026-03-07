import { Link, useLocation } from '@tanstack/react-router'
import { Avatar, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from '@heroui/react'
import {
  MessageSquare,
  Bot,
  ShieldAlert,
  BookOpen,
  FileText,
  Users,
  Settings,
  Menu,
  Home,
  Upload,
  User,
  LogOut
} from 'lucide-react'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'

const routes = [
  { key: 'overview', label: 'Overview', href: '/dashboard', icon: Home },
  { key: 'conversations', label: 'Conversations', href: '/dashboard/conversations', icon: MessageSquare },
  { key: 'agents', label: 'Agents', href: '/dashboard/agents', icon: Bot },
  { key: 'risk-center', label: 'Risk Center', href: '/dashboard/risk-center', icon: ShieldAlert },
  { key: 'knowledge-base', label: 'Knowledge Base', href: '/dashboard/knowledge-base', icon: BookOpen },
  { key: 'custom-rules', label: 'Custom Rules', href: '/dashboard/custom-rules', icon: FileText },
  { key: 'users', label: 'Users', href: '/dashboard/users', icon: Users },
  { key: 'settings', label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar({ className = '', onItemClick }: { className?: string; onItemClick?: () => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const currentPath = location.pathname
  const { data: session, isPending } = authClient.useSession()

  const handleSignOut = async () => {
    await authClient.signOut()
    window.location.href = '/login'
  }

  return <>
    <div className="hidden sm:block fixed left-0 top-0 h-screen w-64 z-40">

      <aside className={`flex flex-col h-full bg-[#101828] ${className}`}>
        {/* Brand Section */}
        <div className="border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="logo" className="h-10 w-10" />
            <div className="flex flex-col">
              <span className="text-lg  text-white">Vera</span>
              <span className="text-xs text-white/50">INTELLIGENCE    </span>
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
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
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
        <div className="border-t border-white/20 ">
          <Link to='/dashboard/upload-recordings' className='flex m-4 flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-md border-gray-600 hover:border-indigo-500 hover:bg-gray-800 transition-colors group'>
            <Upload className='h-5 w-5 text-gray-400 group-hover:text-indigo-500 mx-2 my-2' />
            <span className="text-xs text-gray-400 group-hover:text-indigo-400 text-center">Upload Recordings</span>
          </Link>
          {isPending ? (
            <div className="flex items-center gap-3 border-t border-white/20 mt-4 p-4">
              <div className="h-8 w-8 rounded-full bg-white/20 animate-pulse" />
              <div className="flex flex-col gap-1">
                <div className="h-4 w-24 bg-white/20 rounded animate-pulse" />
                <div className="h-3 w-16 bg-white/20 rounded animate-pulse" />
              </div>
            </div>
          ) : session?.user ? (
            <Dropdown placement="top-start" classNames={{ content: 'p-0', base: 'rounded-lg', }}>
              <DropdownTrigger>
                <div className="flex items-center gap-3 border-t border-white/20 mt-4 p-4 cursor-pointer hover:bg-white/5">
                  <Avatar
                    name={session.user.name || 'User'}
                    size="sm"
                    className="flex-shrink-0 text-white font-bold"
                    showFallback
                    color='primary'
                  />
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-medium text-white">{session.user.email}</span>
                    <span className="truncate text-xs text-white/50">{session.user.tenant?.name}</span>
                  </div>
                </div>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Account actions"
                className=" border border-white/10"
                classNames={{
                  base: "gap-3 rounded-md",
                }}
                bottomContent={true}
              >
                <DropdownSection showDivider>
                  <DropdownItem
                    key="my-account"
                    className='[&>span]:font-bold'
                  >
                    My Account
                  </DropdownItem>
                </DropdownSection>

                <DropdownSection showDivider>

                  <DropdownItem
                    key="settings"
                    startContent={<Settings className="h-4 w-4" />}
                    onPress={() => window.location.href = '/dashboard/settings'}
                  >
                    Settings
                  </DropdownItem>
                </DropdownSection>
                <DropdownItem
                  key="logout"
                  startContent={<LogOut className="h-4 w-4" />}
                  className="text-danger"
                  onPress={handleSignOut}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <div className="flex items-center gap-3 border-t-2 border-white/20 mt-4 p-4">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-xs font-medium text-white">?</span>
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-medium text-white">Not signed in</span>
              </div>
            </div>
          )}
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
