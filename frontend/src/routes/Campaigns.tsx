import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card'
import { useCampaigns } from '../hooks/useCampaigns'
import Loader from '../components/common/Loader'
import Tag from '../components/common/Tag'
import { Megaphone } from 'lucide-react'
import { getStatusColor } from '../lib/utils'

export default function Campaigns() {
  const { data: campaigns, isLoading } = useCampaigns()

  if (isLoading) {
    return <Loader text="Loading campaigns..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="mt-2 text-gray-600">
            Manage your content campaigns and video generation
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {campaigns && campaigns.length > 0 ? (
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Megaphone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {campaign.objective} • {campaign.scripts?.length || 0} scripts
                        </p>
                      </div>
                    </div>
                    <Tag className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Tag>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              No campaigns yet. Create scripts from templates to start your first campaign.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
