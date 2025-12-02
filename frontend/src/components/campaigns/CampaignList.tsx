import { Campaign } from '../../types/campaign'
import { Megaphone, Play, Pause, CheckCircle } from 'lucide-react'

interface CampaignListProps {
  campaigns: Campaign[]
  onSelectCampaign?: (campaign: Campaign) => void
}

export default function CampaignList({ campaigns, onSelectCampaign }: CampaignListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4 text-green-600" />
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-600" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <div
          key={campaign.id}
          onClick={() => onSelectCampaign?.(campaign)}
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Megaphone className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{campaign.name}</h3>
                {campaign.objective && (
                  <p className="text-sm text-gray-600 mb-2">Objective: {campaign.objective}</p>
                )}
                <p className="text-xs text-gray-500">
                  Created {new Date(campaign.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(campaign.status)}
              {getStatusBadge(campaign.status)}
            </div>
          </div>
        </div>
      ))}

      {campaigns.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No campaigns found. Create your first campaign to start posting content.
        </div>
      )}
    </div>
  )
}

