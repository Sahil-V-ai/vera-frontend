import { createFileRoute } from '@tanstack/react-router'
import {
    Button,
    Chip,
    CardBody,
    Tabs,
    Tab,
} from '@heroui/react'
import { Plus, RotateCw } from 'lucide-react'
import { Card } from '#/components/Card'
import { FileText, Database, RefreshCw, Upload, Link2 } from 'lucide-react'

export const Route = createFileRoute('/knowledge-base')({
    component: KnowledgeBasePage,
})

interface KnowledgeSource {
    id: string
    name: string
    type: 'google-drive' | 'notion' | 'upload' | 'paste'
    status: 'Connected' | 'Synced'
    documents: number
    lastSynced: string
    icon: React.ReactNode
}

const knowledgeSources: KnowledgeSource[] = [
    {
        id: '1',
        name: 'Google Drive Files',
        type: 'google-drive',
        status: 'Connected',
        documents: 45,
        lastSynced: '2 hours ago',
        icon: '📁',
    },
    {
        id: '2',
        name: 'Policy Documents',
        type: 'upload',
        status: 'Synced',
        documents: 12,
        lastSynced: '1 day ago',
        icon: '📄',
    },
    {
        id: '3',
        name: 'Notion Workspace',
        type: 'notion',
        status: 'Connected',
        documents: 28,
        lastSynced: '4 hours ago',
        icon: '📝',
    },
]

const availableIntegrations = [
    {
        id: '1',
        name: 'Google Drive',
        icon: <Database size={24} className="text-gray-500" />,
    },
    {
        id: '2',
        name: 'Notion',
        icon: <Database size={24} className="text-gray-700" />,
    },
    {
        id: '3',
        name: 'Upload Files',
        icon: <Upload size={24} className="text-gray-700" />,
    },
    {
        id: '4',
        name: 'Paste Link',
        icon: <Link2 size={24} className="text-gray-700" />,
    },
]

function KnowledgeBasePage() {
    return (
        <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-semibold  mb-2">
                            Knowledge Base
                        </h1>
                        <p className="text-gray-600">
                            Manage your knowledge sources and indexed content
                        </p>
                    </div>
                    <Button
                        className="bg-black text-white hover:bg-gray-800 font-semibold"
                        startContent={<Plus size={20} />}
                    >
                        Add Knowledge
                    </Button>
                </div>

                {/* Tabs */}
                <Tabs
                    aria-label="Knowledge base tabs"
                    className="mb-8"
                >
                    <Tab key="sources" title="Sources">
                        <div className="space-y-4 sm:grid gap-4 sm:grid-cols-2">
                            {knowledgeSources.map((source) => (
                                <Card key={source.id}>
                                    <CardBody className="p-6 flex flex-row items-center justify-between">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="p-3 bg-gray-100 rounded-lg">
                                                {source.icon}
                                            </div>
                                            <div className='grow'>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold text-gray-900">
                                                        {source.name}
                                                    </h3>
                                                    <Chip
                                                        size="sm"
                                                        color="default"
                                                        variant="solid"
                                                        className="font-medium"
                                                        radius="sm"
                                                    >
                                                        {source.status}
                                                    </Chip>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Integration • {source.documents}{' '}
                                                    documents
                                                </p>
                                                <div className="mt-4 flex justify-between items-center w-full">
                                                    <p className="text-xs text-gray-600 mb-2">
                                                        Last synced:{' '}
                                                        {source.lastSynced}
                                                    </p>
                                                    <Button
                                                        isIconOnly
                                                        variant="light"
                                                        size="sm"
                                                    >
                                                        <RefreshCw size={18} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </Tab>
                    <Tab key="indexed" title="Indexed Knowledge">
                        <div className="text-center py-12">
                            <p className="text-gray-600">
                                No indexed knowledge yet. Sync your sources to begin.
                            </p>
                        </div>
                    </Tab>
                </Tabs>

                {/* Available Integrations */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-6">
                        Available Integrations
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {availableIntegrations.map((integration) => (
                            <Button variant='bordered' className="p-4 h-24  flex flex-col items-center justify-center text-center gap-4" key={integration.id}>
                                    <div >
                                        {integration.icon}
                                    </div>
                                    <h3 className="font-semibold text-gray-900">
                                        {integration.name}
                                    </h3>
                            </Button>
                        ))}
                    </div>
                </Card>
            </div>
        </main>
    )
}
