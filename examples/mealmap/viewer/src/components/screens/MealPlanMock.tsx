import React from 'react'
import { mockMealPlan } from '../../data/screens'

export const MealPlanMock: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">This Week's Meal Plan</h3>
        <span className="text-xs text-gray-500">Mar 16 – 22, 2026</span>
      </div>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-1.5 min-w-[600px]">
          {/* Day Headers */}
          {mockMealPlan.map(day => (
            <div key={day.day} className="text-center text-xs font-semibold text-gray-500 pb-1 border-b border-gray-100">
              {day.dayShort}
            </div>
          ))}
          {/* Meal Rows */}
          {['Breakfast', 'Lunch', 'Dinner'].map(mealType => (
            <React.Fragment key={mealType}>
              {mockMealPlan.map(day => {
                const meal = day.meals.find(m => m.type === mealType)
                return (
                  <div
                    key={`${day.day}-${mealType}`}
                    className={`p-1.5 rounded-lg text-xs min-h-[52px] ${
                      meal?.recipe
                        ? 'bg-brand-50 border border-brand-200'
                        : 'bg-gray-50 border border-dashed border-gray-200'
                    }`}
                  >
                    {meal?.recipe ? (
                      <>
                        <div className="font-medium text-gray-900 text-[11px] leading-tight">{meal.recipe.title}</div>
                        <div className="text-gray-400 text-[10px] mt-0.5">{meal.recipe.prepTime}m prep</div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-300 text-lg">+</div>
                    )}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
        {/* Meal Type Labels */}
        <div className="flex gap-4 mt-2 text-[10px] text-gray-400">
          <span>Row 1: Breakfast</span>
          <span>Row 2: Lunch</span>
          <span>Row 3: Dinner</span>
        </div>
      </div>
    </div>
  )
}
