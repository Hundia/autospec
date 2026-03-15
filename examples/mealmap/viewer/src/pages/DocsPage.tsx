import React, { useState, useMemo } from 'react'
import { docsManifest, sections, sectionLabels, sectionIcons, DocSection } from '../data/docs'
import { Card } from '../components/primitives/Card'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export const DocsPage: React.FC = () => {
  const [selectedSlug, setSelectedSlug] = useState<string>(docsManifest[0]?.slug || '')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSection, setActiveSection] = useState<DocSection | 'all'>('all')

  const filteredDocs = useMemo(() => {
    return docsManifest.filter(doc => {
      const matchesSection = activeSection === 'all' || doc.section === activeSection
      const matchesSearch = !searchQuery ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSection && matchesSearch
    })
  }, [searchQuery, activeSection])

  const selectedDoc = docsManifest.find(d => d.slug === selectedSlug)

  return (
    <div className="flex gap-6 min-h-[calc(100vh-8rem)]">
      {/* Left Sidebar */}
      <div className="w-72 flex-shrink-0">
        <div className="sticky top-4 space-y-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search docs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />

          {/* Section Filter */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveSection('all')}
              className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                activeSection === 'all'
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {sections.map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                  activeSection === section
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {sectionIcons[section]} {sectionLabels[section]}
              </button>
            ))}
          </div>

          {/* Doc List */}
          <div className="space-y-1">
            {sections.map(section => {
              const sectionDocs = filteredDocs.filter(d => d.section === section)
              if (sectionDocs.length === 0) return null
              return (
                <div key={section} className="mb-3">
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wider px-2 mb-1">
                    {sectionIcons[section]} {sectionLabels[section]}
                  </div>
                  {sectionDocs.map(doc => (
                    <button
                      key={doc.slug}
                      onClick={() => setSelectedSlug(doc.slug)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        selectedSlug === doc.slug
                          ? 'bg-brand-50 text-brand-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-1.5">{doc.icon}</span>
                      {doc.title}
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {selectedDoc ? (
          <Card variant="outlined">
            <div className="p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xl">{selectedDoc.icon}</span>
                <span className="text-xs px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full">
                  {sectionLabels[selectedDoc.section]}
                </span>
              </div>
              <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-code:text-brand-700 prose-code:bg-brand-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-th:text-left prose-table:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {selectedDoc.content}
                </ReactMarkdown>
              </div>
            </div>
          </Card>
        ) : (
          <div className="text-center text-gray-400 py-20">
            Select a document from the sidebar
          </div>
        )}
      </div>
    </div>
  )
}
