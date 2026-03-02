import { createFileRoute } from '@tanstack/react-router'
import {
    Button,
    Chip,
    CardBody,
    Code,
} from '@heroui/react'
import { Plus, Edit2, Trash2, Play } from 'lucide-react'
import { Card } from '#/components/Card'

export const Route = createFileRoute('/custom-rules')({
    component: CustomRulesPage,
})

interface Rule {
    id: string
    title: string
    status: 'active' | 'paused'
    ifCondition: string
    thenAction: string
    triggeredCount: number
    lastTriggered: string
}

const rulesData: Rule[] = [
    {
        id: '1',
        title: 'High-Value Refund Alert',
        status: 'active',
        ifCondition: 'Refund promised > $100',
        thenAction: 'Flag High Severity',
        triggeredCount: 23,
        lastTriggered: '2 hours ago',
    },
    {
        id: '2',
        title: 'Untagged Partial Refunds',
        status: 'active',
        ifCondition: 'Mentions \'partial refund\' without tag',
        thenAction: 'Flag Medium Severity + Notify Manager',
        triggeredCount: 15,
        lastTriggered: '4 hours ago',
    },
    {
        id: '3',
        title: 'Policy Override Detection',
        status: 'active',
        ifCondition: 'Contains \'exception\' + no approval tag',
        thenAction: 'Flag High Severity',
        triggeredCount: 8,
        lastTriggered: '1 day ago',
    },
    {
        id: '4',
        title: 'Extended Return Window',
        status: 'paused',
        ifCondition: 'Return window > 30 days mentioned',
        thenAction: 'Flag Medium Severity',
        triggeredCount: 12,
        lastTriggered: '3 days ago',
    },
    {
        id: '5',
        title: 'Compliance Language Check',
        status: 'active',
        ifCondition: 'Missing required disclaimers',
        thenAction: 'Flag High Severity + Review',
        triggeredCount: 6,
        lastTriggered: '5 hours ago',
    },
]

function CustomRulesPage() {
    return (
        <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-semibold mb-2">
                            Custom Rules
                        </h1>
                        <p className="text-gray-600">
                            Create automated risk detection rules
                        </p>
                    </div>
                    <Button
                        className="bg-black text-white hover:bg-gray-800 font-semibold"
                        startContent={<Plus size={20} />}
                    >
                        Create Rule
                    </Button>
                </div>

                {/* Rules Section */}
                <Card className="p-6">
                    <h2 className="text-md font-semibold mb-6">
                        Active & Paused Rules
                    </h2>

                    <div className="space-y-4">
                        {rulesData.map((rule) => (
                            <Card key={rule.id} >
                                <CardBody className="p-6 text-sm hover:bg-content2">
                                    <div className="flex items-start justify-between mb-1">
                                        <div className="flex items-center gap-3">
                                            <h3>
                                                {rule.title}
                                            </h3>
                                            <Chip
                                                size="sm"
                                                color={rule.status === 'active' ? 'default' : 'default'}
                                                variant="solid"
                                                className="font-bold text-xs"
                                                radius="sm"
                                            >
                                                {rule.status}
                                            </Chip>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {rule.status === 'paused' && (
                                                <Button
                                                    isIconOnly
                                                    variant="light"
                                                    size="sm"
                                                    className="text-gray-500"
                                                >
                                                    <Play size={18} />
                                                </Button>
                                            )}
                                            <Button
                                                isIconOnly
                                                variant="light"
                                                size="sm"
                                                className="text-gray-500"
                                            >
                                                <Edit2 size={18} />
                                            </Button>
                                            <Button
                                                isIconOnly
                                                variant="light"
                                                size="sm"
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* IF Condition */}
                                    <div className="mb-1 flex gap-2">
                                        <Code className='text-xs'>
                                            IF
                                        </Code>
                                        <p className="text-gray-700">
                                            {rule.ifCondition}
                                        </p>
                                    </div>

                                    {/* THEN Action */}
                                    <div className="mb-4 flex gap-2">
                                        <Code className='text-xs'>
                                            THEN
                                        </Code>
                                        <p className="text-gray-700">
                                            {rule.thenAction}
                                        </p>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 text-xs text-gray-600">
                                        <span >
                                            Triggered {rule.triggeredCount} times
                                        </span>
                                        <span>
                                            Last: {rule.lastTriggered}
                                        </span>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </Card  >
            </div>
        </main>
    )
}
