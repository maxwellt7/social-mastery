import { Template } from '../../types/template'
import { FileCode, TrendingUp, TrendingDown } from 'lucide-react'

interface TemplateListProps {
  templates: Template[]
  onSelectTemplate?: (template: Template) => void
}

export default function TemplateList({ templates, onSelectTemplate }: TemplateListProps) {
  const getPerformanceIcon = (tag?: string) => {
    if (tag === 'winner') return <TrendingUp className="w-4 h-4 text-green-600" />
    if (tag === 'loser') return <TrendingDown className="w-4 h-4 text-red-600" />
    return null
  }

  const getPerformanceBadge = (tag?: string) => {
    if (tag === 'winner')
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Winner</span>
    if (tag === 'loser')
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">Loser</span>
    return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">Test</span>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <div
          key={template.id}
          onClick={() => onSelectTemplate?.(template)}
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between mb-3">
            <FileCode className="w-6 h-6 text-primary-600" />
            <div className="flex items-center space-x-2">
              {getPerformanceIcon(template.performanceTag)}
              {getPerformanceBadge(template.performanceTag)}
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {template.structuralDescription}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {template.templateText}
          </p>

          <div className="flex flex-wrap gap-2">
            {template.funnelStage && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                {template.funnelStage}
              </span>
            )}
            {template.pillar && (
              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                {template.pillar}
              </span>
            )}
          </div>
        </div>
      ))}

      {templates.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500">
          No templates found. Start by discovering high-performing Instagram content.
        </div>
      )}
    </div>
  )
}

