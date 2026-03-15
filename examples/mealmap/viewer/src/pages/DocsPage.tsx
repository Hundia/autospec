import React from 'react'
import { FileText } from 'lucide-react'
import { Card, CardContent } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'
import { docsManifest, sections, sectionLabels } from '../data/docs'

export const DocsPage: React.FC = () => {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-light text-gray-900">Docs</h2>
        <p className="text-sm text-gray-500 mt-1">Living documentation for MealMap</p>
      </div>

      <div className="space-y-8">
        {sections.map(section => {
          const docs = docsManifest.filter(d => d.section === section)
          return (
            <div key={section}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-base font-semibold text-gray-800">{sectionLabels[section]}</h3>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{docs.length}</span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {docs.map(doc => (
                  <Card key={doc.slug} variant="outlined" hoverable>
                    <CardContent>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText size={16} className="text-brand-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">{doc.title}</span>
                            <Badge variant="default" size="sm">{sectionLabels[doc.section as keyof typeof sectionLabels] ?? doc.section}</Badge>
                          </div>
                          <code className="text-xs text-gray-400 font-mono">docs/{doc.slug}.md</code>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
