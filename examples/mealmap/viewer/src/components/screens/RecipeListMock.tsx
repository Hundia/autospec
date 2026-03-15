import React, { useState } from 'react'
import { mockRecipes } from '../../data/screens'

const allTags = Array.from(new Set(mockRecipes.flatMap(r => r.tags)))

export const RecipeListMock: React.FC = () => {
  const [search, setSearch] = useState('')
  const [activeTags, setActiveTags] = useState<string[]>([])

  const toggleTag = (tag: string) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const filtered = mockRecipes.filter(r => {
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase())
    const matchTags = activeTags.length === 0 || activeTags.some(t => r.tags.includes(t))
    return matchSearch && matchTags
  })

  const difficultyColor = { easy: 'text-green-600 bg-green-50', medium: 'text-amber-600 bg-amber-50', hard: 'text-red-600 bg-red-50' }

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-1.5">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
              activeTags.includes(tag)
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Recipe Cards */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map(recipe => (
          <div key={recipe.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-20 flex items-center justify-center text-3xl" style={{ backgroundColor: recipe.imageColor }}>
              {recipe.tags.includes('Italian') ? '🍝' : recipe.tags.includes('Asian') ? '🍜' : recipe.tags.includes('Mexican') ? '🌮' : recipe.tags.includes('Salad') ? '🥗' : recipe.tags.includes('Breakfast') ? '🥑' : '🍽️'}
            </div>
            <div className="p-2.5">
              <div className="font-medium text-sm text-gray-900 mb-1">{recipe.title}</div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{recipe.prepTime + recipe.cookTime}min</span>
                <span className={`px-1.5 py-0.5 rounded text-xs ${difficultyColor[recipe.difficulty]}`}>{recipe.difficulty}</span>
              </div>
              <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
                <span>{recipe.calories} cal</span>
                <span>·</span>
                <span>{recipe.servings} servings</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
