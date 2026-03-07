import { createFileRoute } from '@tanstack/react-router'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Avatar,
    CardBody,
    Tabs,
    Tab,
} from '@heroui/react'
import { Plus, Shield, Users as UsersIcon } from 'lucide-react'
import { Card } from '@/components/Card'
import { Chip } from '@/components/Chip'

export const Route = createFileRoute('/_protected/dashboard/users')({
    component: UsersPage,
})

interface User {
    id: string
    name: string
    email: string
    role: 'Admin' | 'Agent' | 'Manager'
    status: 'active' | 'inactive'
    initials: string
}

const usersData: User[] = [
    {
        id: '1',
        name: 'Rajesh Kumar',
        email: 'rajesh@company.com',
        role: 'Admin',
        status: 'active',
        initials: 'RK',
    },
    {
        id: '2',
        name: 'Priya Sharma',
        email: 'priya@company.com',
        role: 'Agent',
        status: 'active',
        initials: 'PS',
    },
    {
        id: '3',
        name: 'Amit Patel',
        email: 'amit@company.com',
        role: 'Agent',
        status: 'active',
        initials: 'AP',
    },
    {
        id: '4',
        name: 'Neha Singh',
        email: 'neha@company.com',
        role: 'Manager',
        status: 'active',
        initials: 'NS',
    },
    {
        id: '5',
        name: 'Raj Malhotra',
        email: 'raj@company.com',
        role: 'Agent',
        status: 'active',
        initials: 'RM',
    },
    {
        id: '6',
        name: 'Kavya Reddy',
        email: 'kavya@company.com',
        role: 'Manager',
        status: 'active',
        initials: 'KR',
    },
]

function UsersPage() {
    return (
        <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl text-gray-900 mb-2">
                            Users
                        </h1>
                        <p className="text-gray-600">
                            Manage access and permissions
                        </p>
                    </div>
                    <Button
                        className="bg-black text-white hover:bg-gray-800 font-semibold"
                        startContent={<Plus size={20} />}
                        size='sm'
                    >
                        Invite User
                    </Button>
                </div>

                {/* Tabs */}
                <Tabs
                    aria-label="User management tabs"
                    className="mb-8"
                >
                    <Tab key="users" title="Users">
                        {/* Users Count */}
                        <Card className='p-6'>
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900">
                                    All Users ({usersData.length})
                                </h3>
                            </div>

                            {/* Users Table */}
                            <CardBody className="p-0">
                                <Table
                                    aria-label="Users table"
                                    classNames={{
                                        tr: 'border-b border-b-content3 hover:bg-content2',
                                    }}
                                >
                                    <TableHeader className="bg-transparent text-foreground-50 font-bold">
                                        {[
                                            'Name',
                                            'Email',
                                            'Role',
                                            'Status',
                                            '',
                                        ].map((label, idx) => (
                                            <TableColumn
                                                key={idx}
                                                className="bg-transparent text-sm font-bold"
                                            >
                                                {label}
                                            </TableColumn>
                                        ))}
                                    </TableHeader>
                                    <TableBody>
                                        {usersData.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar
                                                            name={user.name}
                                                            size="sm"
                                                            showFallback
                                                        />
                                                        <span className="font-medium text-gray-900">
                                                            {user.name}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    {user.email}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        size="sm"
                                                        variant="solid"
                                                        className="font-medium"
                                                        startContent={
                                                            <Shield size={12} />
                                                        }
                                                        color={user.role === 'Admin' ? 'default' : 'normal'}
                                                        radius='sm'
                                                    >
                                                        {user.role}
                                                    </Chip>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        size="sm"

                                                        variant="solid"
                                                        className="font-bold"
                                                        radius="sm"
                                                    >
                                                        {user.status}
                                                    </Chip>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="light"
                                                        className="font-medium text-primary"
                                                    >
                                                        Edit
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Tab>

                    <Tab key="roles" title="Roles & Permissions">
                        <div className="text-center py-12">
                            <p className="text-gray-600">
                                Role management coming soon
                            </p>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </main>
    )
}
