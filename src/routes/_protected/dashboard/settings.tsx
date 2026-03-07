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
import { Card } from '@/components/Card'
import { authClient } from '@/lib/auth-client'
import { useState, useEffect } from 'react'
import { timezones } from '@/lib/utils'

export const Route = createFileRoute('/_protected/dashboard/settings')({
    component: SettingsPage,
})

function SettingsPage() {
    const { data: session, isPending } = authClient.useSession()
    const tenant = session?.user?.tenant

    const [companyName, setCompanyName] = useState('')
    const [timezone, setTimezone] = useState('pst')
    const [industry, setIndustry] = useState('technology_software')
    const [emailAlerts, setEmailAlerts] = useState(true)
    const [piiMasking, setPiiMasking] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (tenant) {
            setCompanyName(tenant.name || '')
            setTimezone(tenant.timezone || 'pst')
            setIndustry(tenant.industry?.replace('_', ' ') || 'technology_software')
        }
    }, [tenant])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const response = await fetch('/api/tenant-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: companyName,
                    timezone,
                    industry: industry.replace(' ', '_'),
                }),
            })
            if (!response.ok) throw new Error('Failed to save settings')
            window.location.reload()
        } catch (error) {
            console.error('Failed to save settings:', error)
        } finally {
            setIsSaving(false)
        }
    }

    if (isPending) {
        return (
            <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 sm:p-8">
                <div className="max-w-3xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </main>
        )
    }
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
                                    value={companyName}
                                    onValueChange={setCompanyName}
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
                                        selectedKeys={[timezone]}
                                        onSelectionChange={(keys) => setTimezone(Array.from(keys)[0] as string)}
                                        variant="bordered"
                                        size="lg"
                                    >
                                        {timezones.map((option) => (
                                            <SelectItem key={option.key}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Industry
                                    </label>
                                    <Select
                                        selectedKeys={[industry.replace(' ', '_')]}
                                        onSelectionChange={(keys) => setIndustry(Array.from(keys)[0] as string)}
                                        variant="bordered"
                                        size="lg"
                                    >
                                        <SelectItem key="technology_software">
                                            Technology / Software
                                        </SelectItem>
                                        <SelectItem key="e_commerce_retail">
                                            E-commerce / Retail
                                        </SelectItem>
                                        <SelectItem key="finance">
                                            Finance
                                        </SelectItem>
                                        <SelectItem key="healthcare">
                                            Healthcare
                                        </SelectItem>
                                        <SelectItem key="education">
                                            Education
                                        </SelectItem>
                                        <SelectItem key="real_estate">
                                            Real Estate
                                        </SelectItem>
                                        <SelectItem key="telecommunication">
                                            Telecommunication
                                        </SelectItem>
                                        <SelectItem key="manufacturing">
                                            Manufacturing
                                        </SelectItem>
                                        <SelectItem key="professional_services">
                                            Professional Services
                                        </SelectItem>
                                        <SelectItem key="others">
                                            Others
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
                                    isSelected={emailAlerts}
                                    onValueChange={setEmailAlerts}
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
                                    isSelected={piiMasking}
                                    onValueChange={setPiiMasking}
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
                        size="sm"
                        className="bg-black text-white hover:bg-gray-800 font-semibold"
                        startContent={<Save size={20} />}
                        isLoading={isSaving}
                        onPress={handleSave}
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </main>
    )
}
