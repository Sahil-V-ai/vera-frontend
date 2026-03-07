import { createFileRoute } from '@tanstack/react-router'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    CardBody,
    Select,
    SelectItem,
    Avatar,
    CardHeader,
} from '@heroui/react'
import { Settings, TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '@/components/Card'

export const Route = createFileRoute('/_protected/dashboard/agents')({
    component: AgentsPage,
})

interface Agent {
    id: string
    name: string
    initials: string
    color: string
    qualityScore: number
    riskRate: number
    trend: 'up' | 'down'
}

const agentsData: Agent[] = [
    {
        id: '1',
        name: 'Priya Sharma',
        initials: 'PS',
        color: 'bg-blue-500',
        qualityScore: 89,
        riskRate: 2.1,
        trend: 'up',
    },
    {
        id: '2',
        name: 'Amit Patel',
        initials: 'AP',
        color: 'bg-purple-500',
        qualityScore: 76,
        riskRate: 5.2,
        trend: 'down',
    },
    {
        id: '3',
        name: 'Neha Singh',
        initials: 'NS',
        color: 'bg-cyan-500',
        qualityScore: 91,
        riskRate: 1.3,
        trend: 'up',
    },
    {
        id: '4',
        name: 'Raj Malhotra',
        initials: 'RM',
        color: 'bg-pink-500',
        qualityScore: 88,
        riskRate: 1.8,
        trend: 'up',
    },
    {
        id: '5',
        name: 'Kavya Reddy',
        initials: 'KR',
        color: 'bg-green-500',
        qualityScore: 93,
        riskRate: 0.9,
        trend: 'up',
    },
    {
        id: '6',
        name: 'Arjun Verma',
        initials: 'AV',
        color: 'bg-orange-500',
        qualityScore: 82,
        riskRate: 3.4,
        trend: 'down',
    },
]

function AgentsPage() {
    return (
        <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 sm:p-8">
            <div >
                {/* Header */}
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-semibold mb-2 ">
                            Agents
                        </h1>
                        <p className="text-gray-600">
                            Track individual performance and identify patterns
                        </p>
                    </div>
                    <Select
                        className="w-32"
                        defaultSelectedKeys={['last-week']}
                        size="sm"
                        variant="bordered"
                    >
                        <SelectItem key="last-week">
                            Last Week
                        </SelectItem>
                        <SelectItem key="last-month">
                            Last Month
                        </SelectItem>
                        <SelectItem key="last-quarter">
                            Last Quarter
                        </SelectItem>
                    </Select>
                </div>

                {/* Table */}
                <Card className="p-6">
                    <CardHeader className='font-medium'>All Agents</CardHeader>
                    <CardBody className="p-0">
                        <Table
                            aria-label="Agents table"
                            classNames={{ tr: 'border-b border-b-content3 hover:bg-content2' }}
                        >
                            <TableHeader className="bg-transparent text-foreground/80 font-bold">
                                {[
                                    'Name',
                                    'Quality Score',
                                    'Risk Rate',
                                    'Trend',
                                    '',
                                    '',
                                ].map((label, idx) => (
                                    <TableColumn
                                        key={idx}
                                        className={`bg-transparent text-sm font-bold ${idx === 0 ? 'w-12' : ''
                                            }`}
                                    >
                                        {label}
                                    </TableColumn>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {agentsData.map((agent) => (
                                    <TableRow key={agent.id}>
                                        <TableCell className="md:pr-6">
                                            <div className=" flex items-center gap-3">

                                                <Avatar
                                                    name={agent.initials}
                                                    size="sm"
                                                    showFallback
                                                    className='w-8 font-medium'
                                                />
                                                <span className='whitespace-nowrap'>

                                                {agent.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={` ${agent.qualityScore >= 85
                                                        ? 'text-emerald-600'
                                                        : agent.qualityScore >= 80
                                                            ? 'text-yellow-600'
                                                            : 'text-red-600'
                                                    }`}
                                            >
                                                {agent.qualityScore}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`font-semibold ${agent.riskRate <= 2
                                                        ? 'text-emerald-600'
                                                        : agent.riskRate <= 4
                                                            ? 'text-yellow-600'
                                                            : 'text-red-600'
                                                    }`}
                                            >
                                                {agent.riskRate.toFixed(1)}%
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {agent.trend === 'up' ? (
                                                    <TrendingUp
                                                        size={20}
                                                        className="text-emerald-600"
                                                    />
                                                ) : (
                                                    <TrendingDown
                                                        size={20}
                                                        className="text-red-600"
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                variant="light"
                                                className="font-medium text-sm"
                                            >
                                                View Calls
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                isIconOnly
                                                variant="light"
                                                size="sm"
                                            >
                                                <Settings size={18} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>
            </div>
        </main>
    )
}
