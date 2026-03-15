import React from 'react'

interface BrowserMockupProps {
  title: string
  url?: string
  children: React.ReactNode
}

export const BrowserMockup: React.FC<BrowserMockupProps> = ({ title, url = 'mealmap.app', children }) => {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-soft bg-white">
      {/* Browser Chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-md text-xs text-gray-500 max-w-xs w-full">
            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {url}/{title.toLowerCase().replace(/\s+/g, '-')}
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
