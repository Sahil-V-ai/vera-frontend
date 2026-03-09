import { createFileRoute } from '@tanstack/react-router'
import {
    Button,
    Chip,
    CardBody,
    Code,
} from '@heroui/react'
import { Plus, Trash2, Play, Pause } from 'lucide-react'
import { Card } from '@/components/Card'
import CreateRuleModal from '@/components/CreateRuleModal'
import { useState, useEffect } from 'react'
import type { DynamoRule } from '@/lib/dynamodb'

export const Route = createFileRoute('/_protected/dashboard/custom-rules')({
    component: CustomRulesPage,
})

function CustomRulesPage() {
    const [rules, setRules] = useState<DynamoRule[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRules = async () => {
        try {
            const response = await fetch('/api/rules');
            if (!response.ok) {
                throw new Error('Failed to fetch rules');
            }
            const data = await response.json();
            setRules(data.rules || [initialRules]);
        } catch (error) {
            console.error('Error fetching rules:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const handleRuleCreated = (newRule: DynamoRule) => {
        setRules(prev => [...prev, newRule]);
    };

    const handleToggleStatus = async (rule: DynamoRule) => {
        try {
            const response = await fetch(`/api/rules?id=${rule.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    active: !rule.active,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update rule');
            }

            setRules(prev =>
                prev.map(r =>
                    r.id === rule.id
                        ? { ...r, active: !r.active }
                        : r
                )
            );
        } catch (error) {
            console.error('Error toggling rule status:', error);
        }
    };

    const handleDeleteRule = async (id: string) => {
        if (!confirm('Are you sure you want to delete this rule?')) return;

        try {
            const response = await fetch(`/api/rules?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete rule');
            }

            setRules(prev => prev.filter(rule => rule.id !== id));
        } catch (error) {
            console.error('Error deleting rule:', error);
            alert('Failed to delete rule');
        }
    };

    const formatCondition = (rule: DynamoRule): string => {
        const triggerLabels: Record<string, string> = {
            agents_says: 'Agent says',
            contains: 'Contains',
            mentions_keywords: 'Mentions Keywords',
            amount_threshold: 'Amount >',
            missing_tag: 'Missing tag',
            time_based: 'Time based',
        };
        const trigger = triggerLabels[rule.triggerType] || rule.triggerType;
        return `${trigger}: ${rule.conditionValue}`;
    };

    const formatAction = (rule: DynamoRule): string => {
        const parts = [`Flag ${rule.severity} Severity`];
        if (rule.sendNotification) {
            parts.push('+ Notify Manager');
        }
        return parts.join(' ');
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 sm:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-10">Loading rules...</div>
                </div>
            </main>
        );
    }

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
                        onPress={() => setIsModalOpen(true)}
                    >
                        Create Rule
                    </Button>
                </div>

                {/* Rules Section */}
                <Card className="p-6">
                    <h2 className="text-md font-semibold mb-6">
                        Active & Paused Rules
                    </h2>

                    {rules.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No rules created yet. Click "Create Rule" to get started.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {rules.map((rule) => (
                                <Card key={rule.id}>
                                    <CardBody className="p-6 text-sm hover:bg-content2">
                                        <div className="flex items-start justify-between mb-1">
                                            <div className="flex items-center gap-3">
                                                <h3>
                                                    {rule.name}
                                                </h3>
                                                <Chip
                                                    size="sm"
                                                    color={rule.active ? 'primary' : 'default'}
                                                    variant="solid"
                                                    className="font-bold text-xs"
                                                    radius="sm"
                                                >
                                                    {rule.active ? 'active' : 'paused'}
                                                </Chip>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    isIconOnly
                                                    variant="light"
                                                    size="sm"
                                                    className="text-gray-500"
                                                    onPress={() => handleToggleStatus(rule)}
                                                >
                                                    {rule.active ? <Pause size={18} /> : <Play size={18} />}
                                                </Button>
                                                <Button
                                                    isIconOnly
                                                    variant="light"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-700"
                                                    onPress={() => handleDeleteRule(rule.id)}
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
                                                {formatCondition(rule)}
                                            </p>
                                        </div>

                                        {/* THEN Action */}
                                        <div className="mb-4 flex gap-2">
                                            <Code className='text-xs'>
                                                THEN
                                            </Code>
                                            <p className="text-gray-700">
                                                {formatAction(rule)}
                                            </p>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 text-xs text-gray-600">
                                            <span>
                                                Triggered {rule.triggeredCount} times
                                            </span>
                                            {rule.lastTriggered && (
                                                <span>
                                                    Last: {rule.lastTriggered}
                                                </span>
                                            )}
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    )}
                </Card>

                <Card className="p-6 mt-8">
                    <h2 className="text-md font-semibold mb-6">
                        Rule Examples
                    </h2>
                    <div className="space-y-3">
                        <div className="bg-[#f0f4ff]/70 p-4 rounded-sm border-l-[3px] border-blue-600">
                            <h3 className="text-sm text-gray-800">Financial Risk Detection</h3>
                            <p className="text-xs text-gray-500 font-mono mt-1">IF refund promised &gt; $100 THEN flag High Severity</p>
                        </div>
                        <div className="bg-[#f0f4ff]/70 p-4 rounded-sm border-l-[3px] border-blue-600">
                            <h3 className="text-sm text-gray-800">Policy Override Alert</h3>
                            <p className="text-xs text-gray-500 font-mono mt-1">IF contains "exception" + no approval tag THEN flag High Severity + Notify</p>
                        </div>
                        <div className="bg-[#f0f4ff]/70 p-4 rounded-sm border-l-[3px] border-blue-600">
                            <h3 className="text-sm text-gray-800">Response Time Monitoring</h3>
                            <p className="text-xs text-gray-500 font-mono mt-1">IF first response &gt; 4 hours THEN flag Medium Severity</p>
                        </div>
                    </div>
                </Card>
            </div>

            <CreateRuleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRuleCreated={handleRuleCreated}
            />
        </main>
    )
}

const initialRules: DynamoRule[] = [
    {
        id: '1',
        name: 'High-Value Refund Alert',

        triggerType: 'agents_says',
        conditionValue: 'Refund promised > $100',
        triggeredCount: 23,
        lastTriggered: '2 hours ago',
        createdAt: '2022-01-01',
        createdBy: 'John Doe',
        sendNotification: false,
        severity: 'high',
        tenantId: '1',
    },
    {
        id: '2',
        name: 'Untagged Partial Refunds',

        triggerType: 'contains',
        conditionValue: 'Mentions \'partial refund\' without tag',
        triggeredCount: 15,
        lastTriggered: '4 hours ago',
        createdAt: '2022-01-01',
        createdBy: 'John Doe',
        sendNotification: false,
        severity: 'high',
        tenantId: '1',
    },
    {
        id: '3',
        name: 'Policy Override Detection',

        triggerType: 'mentions_keywords',
        conditionValue: 'Flag High Severity',
        triggeredCount: 8,
        lastTriggered: '1 day ago',
        createdAt: '2022-01-01',
        createdBy: 'John Doe',
        sendNotification: false,
        severity: 'high',
        tenantId: '1',
    },
    {
        id: '4',
        name: 'Extended Return Window',

        triggerType: 'contains',
        conditionValue: 'Flag Medium Severity',
        triggeredCount: 12,
        lastTriggered: '3 days ago',
        createdAt: '2022-01-01',
        createdBy: 'John Doe',
        sendNotification: false,
        severity: 'high',
        tenantId: '1',
    },
    {
        id: '5',
        name: 'Compliance Language Check',
        active: true,
        triggerType: 'mentions_keywords',
        conditionValue: 'Flag High Severity + Review',
        triggeredCount: 6,
        lastTriggered: '5 hours ago',
        createdAt: '2022-01-01',
        createdBy: 'John Doe',
        sendNotification: false,
        severity: 'high',
        tenantId: '1',
    },
]
