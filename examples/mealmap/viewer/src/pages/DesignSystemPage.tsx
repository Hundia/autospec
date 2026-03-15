import React, { useState } from 'react'
import { Card } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'
import { BrowserMockup } from '../components/screens/BrowserMockup'
import { LoginMock } from '../components/screens/LoginMock'
import { RecipeListMock } from '../components/screens/RecipeListMock'
import { RecipeDetailMock } from '../components/screens/RecipeDetailMock'
import { MealPlanMock } from '../components/screens/MealPlanMock'
import { ShoppingListMock } from '../components/screens/ShoppingListMock'

const brandColors = [
  { name: 'brand-50', hex: '#f0fdf4' },
  { name: 'brand-100', hex: '#dcfce7' },
  { name: 'brand-200', hex: '#bbf7d0' },
  { name: 'brand-500', hex: '#22c55e' },
  { name: 'brand-600', hex: '#16a34a' },
  { name: 'brand-700', hex: '#15803d' },
]

const grayColors = [
  { name: 'gray-50', hex: '#f9fafb' },
  { name: 'gray-100', hex: '#f3f4f6' },
  { name: 'gray-200', hex: '#e5e7eb' },
  { name: 'gray-500', hex: '#6b7280' },
  { name: 'gray-700', hex: '#374151' },
  { name: 'gray-900', hex: '#111827' },
]

const screens = [
  { id: 'login', label: 'Login', icon: '🔐' },
  { id: 'recipes', label: 'Recipe List', icon: '📖' },
  { id: 'detail', label: 'Recipe Detail', icon: '🍝' },
  { id: 'meal-plan', label: 'Meal Plan', icon: '📅' },
  { id: 'shopping', label: 'Shopping List', icon: '🛒' },
] as const

type ScreenId = typeof screens[number]['id']

export const DesignSystemPage: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('login')

  return (
    <div className="space-y-10">
      {/* Brand Colors */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Brand Colors</h2>
        <div className="grid grid-cols-6 gap-3">
          {brandColors.map(c => (
            <div key={c.name}>
              <div className="h-16 rounded-lg border border-gray-200" style={{ backgroundColor: c.hex }} />
              <div className="mt-1.5 text-xs font-medium text-gray-700">{c.name}</div>
              <div className="text-xs text-gray-400 font-mono">{c.hex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Gray Scale */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Gray Scale</h2>
        <div className="grid grid-cols-6 gap-3">
          {grayColors.map(c => (
            <div key={c.name}>
              <div className="h-16 rounded-lg border border-gray-200" style={{ backgroundColor: c.hex }} />
              <div className="mt-1.5 text-xs font-medium text-gray-700">{c.name}</div>
              <div className="text-xs text-gray-400 font-mono">{c.hex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Typography</h2>
        <div className="space-y-3 bg-white p-4 rounded-lg border border-gray-200">
          <div>
            <span className="text-xs text-gray-400 font-mono">text-2xl font-light</span>
            <div className="text-2xl font-light text-gray-900 mt-1">Heading Text</div>
          </div>
          <div>
            <span className="text-xs text-gray-400 font-mono">text-lg font-semibold</span>
            <div className="text-lg font-semibold text-gray-900 mt-1">Subheading</div>
          </div>
          <div>
            <span className="text-xs text-gray-400 font-mono">text-sm text-gray-600</span>
            <div className="text-sm text-gray-600 mt-1">Body text used for general content and descriptions across the application.</div>
          </div>
          <div>
            <span className="text-xs text-gray-400 font-mono">text-xs font-mono</span>
            <div className="text-xs font-mono text-gray-500 mt-1">const mealPlan = await db.query()</div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Badge Variants</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="done">Done</Badge>
          <Badge variant="in-progress">In Progress</Badge>
          <Badge variant="todo">Todo</Badge>
          <Badge variant="blocked">Blocked</Badge>
          <Badge variant="qa">QA Review</Badge>
        </div>
      </div>

      {/* Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Card Variants</h2>
        <div className="grid grid-cols-3 gap-3">
          <Card><div className="p-4 text-sm text-gray-600">Default Card</div></Card>
          <Card variant="outlined"><div className="p-4 text-sm text-gray-600">Outlined Card</div></Card>
          <Card variant="elevated"><div className="p-4 text-sm text-gray-600">Elevated Card</div></Card>
        </div>
      </div>

      {/* Buttons */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">Primary</button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">Outline</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">Secondary</button>
          <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">Danger</button>
        </div>
      </div>

      {/* App Screens */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">App Screens</h2>
        <p className="text-sm text-gray-500 mb-4">Interactive mockups of MealMap application screens</p>

        {/* Screen Selector */}
        <div className="flex gap-2 mb-4">
          {screens.map(screen => (
            <button
              key={screen.id}
              onClick={() => setActiveScreen(screen.id)}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                activeScreen === screen.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{screen.icon}</span>
              {screen.label}
            </button>
          ))}
        </div>

        {/* Active Screen */}
        <BrowserMockup
          title={screens.find(s => s.id === activeScreen)?.label || ''}
          url="mealmap.app"
        >
          {activeScreen === 'login' && <LoginMock />}
          {activeScreen === 'recipes' && <RecipeListMock />}
          {activeScreen === 'detail' && <RecipeDetailMock />}
          {activeScreen === 'meal-plan' && <MealPlanMock />}
          {activeScreen === 'shopping' && <ShoppingListMock />}
        </BrowserMockup>
      </div>
    </div>
  )
}
