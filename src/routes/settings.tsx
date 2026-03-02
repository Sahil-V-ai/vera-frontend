import { createFileRoute } from '@tanstack/react-router'
import {
    Input,
    Select,
    SelectItem,
    Switch,
    Button,
    CardBody,
    Divider,
} from '@heroui/react'
import { Building2, Bell, Shield, Save, AlertCircle } from 'lucide-react'
import { Card } from '#/components/Card'

export const Route = createFileRoute('/settings')({
    component: SettingsPage,
})

function SettingsPage() {
    return (
        <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 sm:p-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                        Settings
                    </h1>
                    <p className="text-gray-600">
                        Configure your vera intelligence workspace
                    </p>
                </div>

                {/* Organization Section */}
                <Card className="mb-8">
                    <CardBody className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Building2 size={24} className="text-gray-700" />
                            <h2 className="text-lg font-semibold text-gray-900">
                                Organization
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Company Name
                                </label>
                                <Input
                                    placeholder="Enter company name"
                                    defaultValue="Acme Corporation"
                                    variant="bordered"
                                    size="lg"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Timezone
                                    </label>
                                    <Select
                                        defaultSelectedKeys={['pst']}
                                        variant="bordered"
                                        size="lg"
                                    >
                                        <SelectItem key="pst">
                                            Pacific Time (PST)
                                        </SelectItem>
                                        <SelectItem key="mst">
                                            Mountain Time (MST)
                                        </SelectItem>
                                        <SelectItem key="cst">
                                            Central Time (CST)
                                        </SelectItem>
                                        <SelectItem key="est">
                                            Eastern Time (EST)
                                        </SelectItem>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Industry
                                    </label>
                                    <Select
                                        defaultSelectedKeys={['saas']}
                                        variant="bordered"
                                        size="lg"
                                    >
                                        <SelectItem key="saas">
                                            SaaS
                                        </SelectItem>
                                        <SelectItem key="ecommerce">
                                            E-commerce
                                        </SelectItem>
                                        <SelectItem key="fintech">
                                            Fintech
                                        </SelectItem>
                                        <SelectItem key="healthcare">
                                            Healthcare
                                        </SelectItem>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Alerts & Notifications Section */}
                <Card className="mb-8">
                    <CardBody className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Bell size={24} className="text-gray-700" />
                            <h2 className=" font-semibold text-gray-900">
                                Alerts & Notifications
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-900 mb-1">
                                        Email Alerts
                                    </h3>
                                    <p className="text-xs text-gray-600">
                                        Receive email notifications for high-severity risks
                                    </p>
                                </div>
                                <Switch
                                    defaultSelected
                                    size="lg"
                                />
                            </div>

                            <Divider />

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-900 mb-1">
                                        Slack Integration
                                    </h3>
                                    <p className="text-xs text-gray-600">
                                        Send alerts to Slack channel
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="bordered"
                                    className="font-medium"
                                >
                                    Connect Slack
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Data & Privacy Section */}
                <Card className="mb-8">
                    <CardBody className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield size={24} className="text-gray-700" />
                            <h2 className=" font-semibold text-gray-900">
                                Data & Privacy
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-sm text-gray-900 mb-1">
                                    Data Retention Period
                                </h3>
                                <p className="text-xs text-gray-600 mb-3">
                                    Conversation data older than this will be automatically deleted
                                </p>
                                <Select
                                    defaultSelectedKeys={['90']}
                                    variant="bordered"
                                >
                                    <SelectItem key="30">
                                        30 days
                                    </SelectItem>
                                    <SelectItem key="60">
                                        60 days
                                    </SelectItem>
                                    <SelectItem key="90">
                                        90 days
                                    </SelectItem>
                                    <SelectItem key="180">
                                        180 days
                                    </SelectItem>
                                </Select>
                            </div>

                            <Divider />

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-900 mb-1">
                                        PII Masking
                                    </h3>
                                    <p className="text-xs text-gray-600">
                                        Automatically mask personally identifiable information
                                    </p>
                                </div>
                                <Switch
                                    defaultSelected
                                    size="lg"
                                />
                            </div>

                            <Divider />

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-900 mb-1">
                                        Audit Logs
                                    </h3>
                                    <p className="text-xs text-gray-600">
                                        Track all user actions and data access
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    className="font-medium text-primary"
                                    variant="bordered"
                                >
                                    View Logs
                                </Button>
                            </div>

                            <Divider />

                            <div>
                                <h3 className="font-semibold text-sm text-gray-900 mb-1">
                                    Data Deletion
                                </h3>
                                <p className="text-xs text-gray-600 mb-3">
                                    Permanently delete all organization data. This action cannot be undone.
                                </p>
                                <Button
                                    size="sm"
                                    color="danger"
                                    variant="solid"
                                    className="font-semibold"
                                    startContent={<AlertCircle size={18} />}
                                >
                                    Request Data Deletion
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button
                        size="lg"
                        className="bg-black text-white hover:bg-gray-800 font-semibold"
                        startContent={<Save size={20} />}
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </main>
    )
}
