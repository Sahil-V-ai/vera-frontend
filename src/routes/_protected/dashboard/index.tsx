import { createFileRoute } from '@tanstack/react-router'
import { CircularProgress, CardBody } from '@heroui/react'
import { Card } from '@/components/Card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export const Route = createFileRoute('/_protected/dashboard/')({
  component: DashboardPage,
})

const trendData = [
  { date: 'Feb 18', value: 80 },
  { date: 'Feb 19', value: 84 },
  { date: 'Feb 20', value: 82 },
  { date: 'Feb 21', value: 87 },
  { date: 'Feb 22', value: 89 },
  { date: 'Feb 23', value: 91 },
  { date: 'Feb 24', value: 88 },
  { date: 'Feb 25', value: 92 },
]

function DashboardPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 sm:p-8">
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">
            Team Intelligence
          </h1>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody className="p-6 flex flex-row items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Green Flag Rate</p>
                <p className="text-3xl font-semibold text-emerald-500">92%</p>
              </div>
              <CircularProgress
                value={92}
                color="success"
                classNames={{
                  svg: "w-16 h-16",
                  indicator: "stroke-emerald-500",
                  track: "stroke-emerald-500/20",
                }}
                strokeWidth={3}
                aria-label="Green Flag Rate"
              />
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6 flex flex-row items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Unanswered Questions</p>
                <p className="text-3xl font-semibold text-red-500">13%</p>
              </div>
              <CircularProgress
                value={13}
                color="danger"
                classNames={{
                  svg: "w-16 h-16",
                  indicator: "stroke-red-500",
                  track: "stroke-red-500/20",
                }}
                strokeWidth={3}
                aria-label="Unanswered Questions"
              />
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6 flex flex-row items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Compliance Rate</p>
                <p className="text-3xl font-semibold text-emerald-500">94%</p>
              </div>
              <CircularProgress
                value={94}
                color="success"
                classNames={{
                  svg: "w-16 h-16",
                  indicator: "stroke-emerald-500",
                  track: "stroke-emerald-500/20",
                }}
                strokeWidth={3}
                aria-label="Compliance Rate"
              />
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6 flex flex-row items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Resolution Rate</p>
                <p className="text-3xl font-semibold text-emerald-500">89%</p>
              </div>
              <CircularProgress
                value={89}
                color="success"
                classNames={{
                  svg: "w-16 h-16",
                  indicator: "stroke-emerald-500",
                  track: "stroke-emerald-500/20",
                }}
                strokeWidth={3}
                aria-label="Resolution Rate"
              />
            </CardBody>
          </Card>
        </div>

        {/* Chart */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              Green Flag Trend (Last 7 Days)
            </h2>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  axisLine={true}
                  tickLine={true}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  domain={[70, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </main>
  )
}
