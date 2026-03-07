import { createFileRoute } from '@tanstack/react-router'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Chip,
    CardBody,
} from '@heroui/react'
import { FilterIcon, Search } from 'lucide-react'
import { Card } from '@/components/Card'

export const Route = createFileRoute('/_protected/dashboard/conversations')({
    component: ConversationsPage,
})

interface Conversation {
    id: string
    agent: string
    channel: string
    flag: 'red' | 'green' | null
    date: string
    status: 'Completed' | 'Review Pending'
}

const conversationData: Conversation[] = [
    {
        id: '8881',
        agent: 'Priya Sharma',
        channel: 'Google Meet',
        flag: 'red',
        date: 'Feb 25, 2026',
        status: 'Review Pending',
    },
    {
        id: '8882',
        agent: 'Amit Patel',
        channel: 'Manual Upload',
        flag: 'green',
        date: 'Feb 25, 2026',
        status: 'Completed',
    },
    {
        id: '8883',
        agent: 'Neha Singh',
        channel: 'Google Meet',
        flag: 'green',
        date: 'Feb 24, 2026',
        status: 'Completed',
    },
    {
        id: '8884',
        agent: 'Raj Malhotra',
        channel: 'Manual Upload',
        flag: 'red',
        date: 'Feb 24, 2026',
        status: 'Review Pending',
    },
    {
        id: '8885',
        agent: 'Priya Sharma',
        channel: 'Google Meet',
        flag: 'green',
        date: 'Feb 24, 2026',
        status: 'Completed',
    },
    {
        id: '8886',
        agent: 'Amit Patel',
        channel: 'Google Meet',
        flag: 'green',
        date: 'Feb 23, 2026',
        status: 'Completed',
    },
    {
        id: '8887',
        agent: 'Neha Singh',
        channel: 'Manual Upload',
        flag: 'red',
        date: 'Feb 23, 2026',
        status: 'Review Pending',
    },
    {
        id: '8888',
        agent: 'Raj Malhotra',
        channel: 'Google Meet',
        flag: 'green',
        date: 'Feb 23, 2026',
        status: 'Completed',
    },
]

function ConversationsPage() {
    return (
        <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 sm:p-8">
            <div >
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Conversations
                    </h1>
                    <p className="text-gray-600">
                        Search and review all customer interactions
                    </p>
                </div>

                {/* Search and Filters */}
                <Card className="mb-8 ">
                    <CardBody className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <div className="flex-1 w-full">
                                <Input
                                    isClearable
                                    className="w-full"
                                    placeholder="Search by conversation ID, agent..."
                                    startContent={<Search size={18} className="text-gray-400" />}
                                    size="lg"
                                    variant="bordered"
                                />
                            </div>
                            <Button
                                variant="bordered"
                                className="min-w-fit hover"
                                size="lg"
                                startContent={<FilterIcon size={18} />}
                            >
                                Filters
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                {/* Table */}
                <Card >
                    <CardBody className="p-0">
                        <Table
                            aria-label="Conversations table"
                            classNames={{tr:'border-b border-b-content3 hover:bg-content2'}}
                        >
                            <TableHeader className='bg-transparent text-foreground-50 font-bold'>
                                {[
                                    "Conversation ID",
                                    "Agent",
                                    "Channel",
                                    "Flag",
                                    "Date",
                                    "Status",
                                    "",
                                ].map((labels) => (
                                    <TableColumn key={labels} className="bg-transparent text-sm text-foreground/80 font-bold">
                                        {labels}
                                    </TableColumn>))}
                            </TableHeader>
                            <TableBody>
                                {conversationData.map((conversation) => (
                                    <TableRow
                                        key={conversation.id}
                                    >
                                        <TableCell >
                                            {conversation.id}
                                        </TableCell>
                                        <TableCell >
                                            {conversation.agent}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant='bordered' size='sm' className='py-1 text-tiny font-semibold h-fit'>

                                            {conversation.channel}
                                            </Button>
                                            </TableCell>
                                        <TableCell className="text-center">
                                            {conversation.flag === 'red' ? (
                                                <span className="text-2xl">🚩</span>
                                            ) : conversation.flag === 'green' ? (
                                                <span className="inline-flex items-center justify-center w-4 h-4 bg-emerald-500 rounded-full" />
                                            ) : null}
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {conversation.date}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="sm"
                                                color={
                                                    conversation.status === 'Completed'
                                                        ? 'default'
                                                        : 'danger'
                                                }
                                                variant="solid"
                                                className="font-bold [&>span]:font-bold"
                                                radius='sm'
                                            >
                                                {conversation.status}
                                            </Chip>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant="bordered"
                                                className="font-semibold text-medium border-0"
                                            >
                                                View
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
