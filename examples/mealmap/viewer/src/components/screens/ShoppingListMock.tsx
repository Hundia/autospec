import React, { useState } from 'react'
import { mockShoppingList, MockShoppingGroup } from '../../data/screens'

export const ShoppingListMock: React.FC = () => {
  const [groups, setGroups] = useState<MockShoppingGroup[]>(
    JSON.parse(JSON.stringify(mockShoppingList))
  )
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggleItem = (groupIdx: number, itemIdx: number) => {
    setGroups(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as MockShoppingGroup[]
      next[groupIdx].items[itemIdx].checked = !next[groupIdx].items[itemIdx].checked
      return next
    })
  }

  const toggleCollapse = (category: string) => {
    setCollapsed(prev => ({ ...prev, [category]: !prev[category] }))
  }

  const totalItems = groups.reduce((sum, g) => sum + g.items.length, 0)
  const checkedItems = groups.reduce((sum, g) => sum + g.items.filter(i => i.checked).length, 0)

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Shopping List</h3>
        <span className="text-xs text-gray-500">{checkedItems}/{totalItems} items</span>
      </div>

      {/* Progress */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-brand-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${totalItems > 0 ? (checkedItems / totalItems) * 100 : 0}%` }}
        />
      </div>

      {/* Groups */}
      {groups.map((group, gi) => {
        const groupChecked = group.items.filter(i => i.checked).length
        const isCollapsed = collapsed[group.category]
        return (
          <div key={group.category} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleCollapse(group.category)}
              className="w-full flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>{group.icon}</span>
                <span className="text-sm font-medium text-gray-900">{group.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{groupChecked}/{group.items.length}</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            {!isCollapsed && (
              <div className="divide-y divide-gray-100">
                {group.items.map((item, ii) => (
                  <div
                    key={item.name}
                    onClick={() => toggleItem(gi, ii)}
                    className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                      item.checked ? 'opacity-50' : ''
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      item.checked
                        ? 'bg-brand-500 border-brand-500'
                        : 'border-gray-300'
                    }`}>
                      {item.checked && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {item.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 font-mono whitespace-nowrap">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
