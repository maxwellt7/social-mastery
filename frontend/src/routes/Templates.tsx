import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card'
import { useTemplates } from '../hooks/useTemplates'
import Loader from '../components/common/Loader'
import Tag from '../components/common/Tag'
import { Layers } from 'lucide-react'

export default function Templates() {
  const { data: templates, isLoading } = useTemplates()

  if (isLoading) {
    return <Loader text="Loading templates..." />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
        <p className="mt-2 text-gray-600">
          Manage your content templates and variable mappings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Templates</CardTitle>
        </CardHeader>
        <CardContent>
          {templates && templates.length > 0 ? (
            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Layers className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {template.structuralDescription}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {template.pillar} • {template.funnelStage}
                        </p>
                      </div>
                    </div>
                    {template.performanceTag && (
                      <Tag variant={template.performanceTag === 'winner' ? 'success' : 'default'}>
                        {template.performanceTag}
                      </Tag>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              No templates yet. Go to Discovery to create templates from high-performing content.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
