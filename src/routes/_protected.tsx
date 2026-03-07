import Sidebar from '@/components/Sidebar'
import { getSession } from '@/lib/auth-server'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
    loader: async () => {
        const session = await getSession()
        if (!session?.user) {
            throw redirect({ to: '/login' })
        }
        return session
    },
    component: RouteComponent,
})

function RouteComponent() {
    return <main className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <Sidebar />
        <main className="sm:pl-64">
            <Outlet />
        </main>
    </main>
}
