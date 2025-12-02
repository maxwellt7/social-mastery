import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card'
import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react'

export default function Analytics() {
  const stats = [
    { name: 'Total Reach', value: '0', icon: Eye, change: '+0%' },
    { name: 'Engagement Rate', value: '0%', icon: TrendingUp, change: '+0%' },
    { name: 'New Followers', value: '0', icon: Users, change: '+0%' },
    { name: 'Total Posts', value: '0', icon: BarChart3, change: '+0%' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-gray-600">
          Track performance and learn from your content
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Analytics data will appear here once you start publishing content.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
