import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card'
import Button from '../components/common/Button'

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Configure your integrations and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Integrations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Instagram Business Account</h4>
            <p className="text-sm text-gray-600 mb-3">
              Connect your Instagram Business Account to enable content discovery and publishing.
            </p>
            <Button variant="outline">Connect Instagram</Button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Creatify API</h4>
            <p className="text-sm text-gray-600 mb-3">
              Configure your Creatify API credentials for video generation.
            </p>
            <Button variant="outline">Configure Creatify</Button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Kodey.ai Agents</h4>
            <p className="text-sm text-gray-600 mb-3">
              Set up AI agents for content analysis and script generation.
            </p>
            <Button variant="outline">Configure Kodey.ai</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Risk Level
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
              <option>Safe</option>
              <option>Moderate</option>
              <option>Aggressive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Pillars (comma-separated)
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="e.g., Education, Entertainment, Inspiration"
            />
          </div>

          <Button>Save Preferences</Button>
        </CardContent>
      </Card>
    </div>
  )
}
