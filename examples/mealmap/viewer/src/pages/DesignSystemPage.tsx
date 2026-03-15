import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'

const brandColors = [
  { name: 'brand-50', hex: '#f0fdf4', textDark: true },
  { name: 'brand-100', hex: '#dcfce7', textDark: true },
  { name: 'brand-200', hex: '#bbf7d0', textDark: true },
  { name: 'brand-500', hex: '#22c55e', textDark: false },
  { name: 'brand-600', hex: '#16a34a', textDark: false },
  { name: 'brand-700', hex: '#15803d', textDark: false },
]

const grayColors = [
  { name: 'gray-50', hex: '#f9fafb', textDark: true },
  { name: 'gray-100', hex: '#f3f4f6', textDark: true },
  { name: 'gray-200', hex: '#e5e7eb', textDark: true },
  { name: 'gray-500', hex: '#6b7280', textDark: false },
  { name: 'gray-700', hex: '#374151', textDark: false },
  { name: 'gray-900', hex: '#111827', textDark: false },
]

const badgeVariants = ['default', 'done', 'in-progress', 'todo', 'blocked', 'qa'] as const

export const DesignSystemPage: React.FC = () => {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-light text-gray-900">Design System</h2>
        <p className="text-sm text-gray-500 mt-1">MealMap visual design tokens and components</p>
      </div>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-3">
            {brandColors.map(color => (
              <div key={color.name}>
                <div
                  className="h-16 rounded-lg mb-2 border border-gray-200"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="text-xs font-mono text-gray-600">{color.name}</div>
                <div className="text-xs text-gray-400">{color.hex}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gray Scale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-3">
            {grayColors.map(color => (
              <div key={color.name}>
                <div
                  className="h-16 rounded-lg mb-2 border border-gray-200"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="text-xs font-mono text-gray-600">{color.name}</div>
                <div className="text-xs text-gray-400">{color.hex}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-xs text-gray-400 mb-1">Heading / 2xl font-light</div>
            <div className="text-2xl font-light text-gray-900">MealMap — Meal Planning Made Simple</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Subheading / lg font-semibold</div>
            <div className="text-lg font-semibold text-gray-900">Recipe Management System</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Body / sm</div>
            <div className="text-sm text-gray-700">Plan meals for the week, generate shopping lists automatically, and scale recipes to any serving size.</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Mono / xs font-mono</div>
            <div className="text-xs font-mono text-gray-500">GET /api/recipes?category=dinner&page=1</div>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {badgeVariants.map(variant => (
              <Badge key={variant} variant={variant}>{variant}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Card Variants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Card variant="default">
              <CardContent>
                <div className="text-sm font-medium text-gray-900 mb-1">Default Card</div>
                <div className="text-xs text-gray-500">With shadow-subtle</div>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <div className="text-sm font-medium text-gray-900 mb-1">Outlined Card</div>
                <div className="text-xs text-gray-500">With border</div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent>
                <div className="text-sm font-medium text-gray-900 mb-1">Elevated Card</div>
                <div className="text-xs text-gray-500">With shadow-soft</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors">
              Primary
            </button>
            <button className="px-4 py-2 bg-white text-brand-600 text-sm font-medium rounded-lg border border-brand-500 hover:bg-brand-50 transition-colors">
              Outline
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
              Secondary
            </button>
            <button className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors">
              Danger
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
