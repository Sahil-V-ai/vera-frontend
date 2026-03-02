import { Card } from '@heroui/react'
import { createFileRoute } from '@tanstack/react-router'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export const Route = createFileRoute('/')({ component: App })

// Sample data for the area chart
const chartData = [
  { date: 'Feb 18', greenFlag: 82 },
  { date: 'Feb 19', greenFlag: 83 },
  { date: 'Feb 20', greenFlag: 81 },
  { date: 'Feb 21', greenFlag: 85 },
  { date: 'Feb 22', greenFlag: 87 },
  { date: 'Feb 23', greenFlag: 86 },
  { date: 'Feb 24', greenFlag: 88 },
  { date: 'Feb 25', greenFlag: 90 },
]

// Metric Card Component
interface MetricCardProps {
  label: string
  value: string
  percentage: number
  color: 'green' | 'red' | 'blue'
}

function MetricCard({ label, value, percentage, color }: MetricCardProps) {
  const colorClasses = {
    green: 'text-emerald-500',
    red: 'text-red-500',
    blue: 'text-blue-500',
  }

  return (
    <Card
      className={`rounded-xl shadow-sm p-6 `}
    >
      <p className="text-sm font-medium text-gray-600 mb-4">{label}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className={`text-4xl font-bold ${colorClasses[color]}`}>
            {value}
          </p>
        </div>
        <div className="relative w-16 h-16">
          <svg className="transform -rotate-90 w-16 h-16" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              className="stroke-gray-200"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              className={`stroke-current transition-all duration-500 ${colorClasses[color]}`}
              strokeWidth="3"
              strokeDasharray={`${(percentage / 100) * 100} 100`}
            />
          </svg>
          <span
            className={`absolute inset-0 flex items-center justify-center text-xs font-semibold ${colorClasses[color]}`}
          >
            {percentage}%
          </span>
        </div>
      </div>
    </Card>
  )
}

function App() {
  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 sm:p-8">
      <div >
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Team Intelligence
          </h1>
          <p className="text-gray-600">
            Monitor your team's performance metrics and trends
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            label="Green Flag Rate"
            value="92%"
            percentage={92}
            color="green"
          />
          <MetricCard
            label="Unanswered Questions"
            value="13%"
            percentage={13}
            color="red"
          />
          <MetricCard
            label="Compliance Rate"
            value="94%"
            percentage={94}
            color="green"
          />
          <MetricCard
            label="Resolution Rate"
            value="89%"
            percentage={89}
            color="green"
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Green Flag Trend (Last 7 Days)
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorGreenFlag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} domain={[70, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                cursor={{ stroke: '#10b981', strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="greenFlag"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorGreenFlag)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  )
}
