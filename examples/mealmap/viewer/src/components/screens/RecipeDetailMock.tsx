import React, { useState } from 'react'
import { mockRecipes } from '../../data/screens'

export const RecipeDetailMock: React.FC = () => {
  const recipe = mockRecipes[0] // Pasta Carbonara
  const [servings, setServings] = useState(recipe.servings)
  const scale = servings / recipe.servings

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="h-24 rounded-lg flex items-center justify-center text-5xl" style={{ backgroundColor: recipe.imageColor }}>
        🍝
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{recipe.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{recipe.description}</p>
      </div>

      {/* Stats */}
      <div className="flex gap-3">
        {[
          { label: 'Prep', value: `${recipe.prepTime}m` },
          { label: 'Cook', value: `${recipe.cookTime}m` },
          { label: 'Cal', value: `${Math.round(recipe.calories * scale)}` },
        ].map(stat => (
          <div key={stat.label} className="flex-1 p-2 bg-gray-50 rounded-lg text-center">
            <div className="text-xs text-gray-500">{stat.label}</div>
            <div className="text-sm font-semibold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Serving Scaler */}
      <div className="flex items-center justify-between p-3 bg-brand-50 rounded-lg">
        <span className="text-sm font-medium text-brand-700">Servings</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setServings(Math.max(1, servings - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-brand-200 text-brand-700 hover:bg-brand-100 transition-colors text-lg font-medium"
          >
            -
          </button>
          <span className="text-lg font-bold text-brand-700 w-6 text-center">{servings}</span>
          <button
            onClick={() => setServings(servings + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-brand-200 text-brand-700 hover:bg-brand-100 transition-colors text-lg font-medium"
          >
            +
          </button>
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Ingredients</h4>
        <div className="space-y-1.5">
          {recipe.ingredients.map(ing => (
            <div key={ing.name} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-700">{ing.name}</span>
              <span className="text-sm font-mono text-gray-500">
                {Math.round(ing.quantity * scale * 10) / 10} {ing.unit}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
