import { createFileRoute } from '@tanstack/react-router'
import {
    Button,
    Chip,
    CardBody,
} from '@heroui/react'
import { AlertCircle, AlertTriangle, Lightbulb } from 'lucide-react'
import { Card } from '#/components/Card'

export const Route = createFileRoute('/risk-center')({
    component: RiskCenterPage,
})

interface KnowledgeGap {
    id: string
    title: string
    severity: 'low' | 'medium' | 'high'
    calls: number
    percentage: number
}

interface RedFlag {
    id: string
    title: string
    severity: 'high' | 'critical'
    description: string
    instances: number
    percentageChange: number
    isIncreasing: boolean
}

const knowledgeGapsData: KnowledgeGap[] = [
    {
        id: '1',
        title: 'Refund processing timeline',
        severity: 'high',
        calls: 18,
        percentage: 12,
    },
    {
        id: '2',
        title: 'International shipping options',
        severity: 'medium',
        calls: 12,
        percentage: 5,
    },
    {
        id: '3',
        title: 'Product warranty details',
        severity: 'low',
        calls: 8,
        percentage: 2,
    },
    {
        id: '4',
        title: 'Subscription cancellation process',
        severity: 'high',
        calls: 15,
        percentage: 8,
    },
]

const redFlagsData: RedFlag[] = [
    {
        id: '1',
        title: 'Misquoting Policies',
        severity: 'high',
        description: 'Agents providing incorrect information about company policies',
        instances: 23,
        percentageChange: 12,
        isIncreasing: true,
    },
    {
        id: '2',
        title: 'Lying to Customers',
        severity: 'critical',
        description: 'Intentionally providing false information or making promises that can\'t be kept',
        instances: 5,
        percentageChange: 11,
        isIncreasing: true,
    },
]

function SeverityBadge({
    severity,
}: {
    severity: 'low' | 'medium' | 'high' | 'critical'
}) {
    const severityConfig = {
        low: { label: 'low', color: 'default' as const },
        medium: { label: 'medium', color: 'warning' as const },
        high: { label: 'high', color: 'danger' as const },
        critical: { label: 'critical', color: 'danger' as const },
    }

    const config = severityConfig[severity]
    return (
        <Chip
            size="sm"
            color={config.color}
            variant="solid"
            className="font-bold"
            radius="sm"
        >
            {config.label}
        </Chip>
    )
}

function RiskCenterPage() {
    return (
        <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-xl font-semibold mb-2">
                        Risk Center
                    </h1>
                </div>

                {/* Knowledge Gaps Section */}
                <Card className="mb-12 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Lightbulb size={24} />
                        <h2 className="text-lg font-medium ">
                            Knowledge Gaps
                        </h2>
                    </div>
                    <p className="text-gray-600 mb-6">
                        Topics customers frequently ask about that should be added to your knowledge base
                    </p>

                    <div className="space-y-3">
                        {knowledgeGapsData.map((gap) => (
                            <Card key={gap.id}>
                                <CardBody className="p-4 flex flex-row items-center justify-between hover:bg-content2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3>
                                                {gap.title}
                                            </h3>
                                            <SeverityBadge severity={gap.severity} />
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {gap.calls} calls • +{gap.percentage}% this week
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="bordered"
                                        className="font-medium"
                                    >
                                        Add to KB
                                    </Button>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </Card>

                {/* Red Flags Section */}
                <Card className='p-6'>
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle size={24} className="text-red-600" />
                        <h2 className="text-lg font-semibold">
                            Red Flags
                        </h2>
                    </div>
                    <p className="text-gray-600 mb-6 text-sm">
                        Critical issues requiring immediate attention
                    </p>

                    <div className="space-y-3">
                        {redFlagsData.map((flag) => (
                            <Card
                                key={flag.id}
                                color={flag.severity === 'critical' ? 'danger' : 'warning'}
                            >
                                <CardBody className="p-4">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3>
                                                        {flag.title}
                                                    </h3>
                                                    <SeverityBadge
                                                        severity={flag.severity}
                                                    />
                                                </div>
                                                <p className="text-gray-600 mb-3 text-sm">
                                                    {flag.description}
                                                </p>
                                                <p className="text-sm ">
                                                    <span className='font-semibold'>
                                                        {flag.instances}
                                                        &nbsp;
                                                    </span>
                                                    instances 
                                                        &nbsp;
                                                    <span
                                                        className={`${flag.isIncreasing
                                                                ? 'text-red-600'
                                                                : 'text-emerald-600'
                                                            }`}
                                                    >
                                                        {flag.isIncreasing ? '↗' : '↘'}{' '}
                                                        {flag.percentageChange}% this week
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="font-bold text-white bg-black hover:bg-gray-800 min-w-fit"
                                        >
                                            Review Cases
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </Card>
            </div>
        </main>
    )
}
