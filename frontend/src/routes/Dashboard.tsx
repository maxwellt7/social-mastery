import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card'
import { FileText, Layers, Megaphone, TrendingUp } from 'lucide-react'
import { useOffers } from '../hooks/useOffer'
import { useTemplates } from '../hooks/useTemplates'
import { useCampaigns } from '../hooks/useCampaigns'
import Loader from '../components/common/Loader'

export default function Dashboard() {
  const { data: offers, isLoading: offersLoading } = useOffers()
  const { data: templates, isLoading: templatesLoading } = useTemplates()
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns()

  if (offersLoading || templatesLoading || campaignsLoading) {
    return <Loader text="Loading dashboard..." />
  }

  const stats = [
    {
      name: 'Active Offers',
      value: offers?.length || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Templates',
      value: templates?.length || 0,
      icon: Layers,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Active Campaigns',
      value: campaigns?.filter(c => c.status === 'active').length || 0,
      icon: Megaphone,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Total Posts',
      value: campaigns?.reduce((acc, c) => acc + (c.scripts?.length || 0), 0) || 0,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of your AI content creation platform
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/offers"
              className="block p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-semibold text-gray-900">Upload New Offer</h4>
              <p className="text-sm text-gray-600">
                Create an AI Marketing Director profile from your PDF
              </p>
            </a>
            <a
              href="/discovery"
              className="block p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-semibold text-gray-900">Discover Content</h4>
              <p className="text-sm text-gray-600">
                Find high-performing Instagram content for templates
              </p>
            </a>
            <a
              href="/campaigns"
              className="block p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-semibold text-gray-900">Create Campaign</h4>
              <p className="text-sm text-gray-600">
                Generate scripts and videos for your campaigns
              </p>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Activity feed will appear here once you start creating content.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
