export interface DocEntry {
  slug: string
  title: string
  section: string
}

export const docsManifest: DocEntry[] = [
  { slug: 'architecture', title: 'Architecture', section: 'system' },
  { slug: 'api', title: 'API Reference', section: 'system' },
  { slug: 'setup', title: 'Setup Guide', section: 'guides' },
]

export const sections = ['system', 'guides'] as const
export type DocSection = typeof sections[number]

export const sectionLabels: Record<DocSection, string> = {
  system: 'System',
  guides: 'Guides',
}
