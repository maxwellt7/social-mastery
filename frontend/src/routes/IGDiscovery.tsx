import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card'
import Button from '../components/common/Button'
import { Search } from 'lucide-react'

export default function IGDiscovery() {
  const [hashtags, setHashtags] = useState('')
  const [minLikes, setMinLikes] = useState('')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Instagram Discovery</h1>
        <p className="mt-2 text-gray-600">
          Find high-performing content to convert into templates
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hashtags (comma-separated)
            </label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="e.g., marketing, contentcreation, socialmedia"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Likes
            </label>
            <input
              type="number"
              value={minLikes}
              onChange={(e) => setMinLikes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="e.g., 1000"
            />
          </div>

          <Button>
            <Search className="w-4 h-4 mr-2" />
            Search High Performers
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Search results will appear here. Connect your Instagram Business Account in Settings to enable discovery.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
