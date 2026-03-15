import React, { useState } from 'react'

export const LoginMock: React.FC = () => {
  const [email, setEmail] = useState('jamie@example.com')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="max-w-sm mx-auto py-8">
      <div className="text-center mb-6">
        <div className="text-3xl mb-2">🍽️</div>
        <h2 className="text-xl font-semibold text-gray-900">Welcome to MealMap</h2>
        <p className="text-sm text-gray-500 mt-1">Sign in to plan your meals</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <button className="w-full py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">
          Sign In
        </button>
        <div className="text-center">
          <span className="text-sm text-gray-500">Don't have an account? </span>
          <button className="text-sm text-brand-600 font-medium hover:text-brand-700">Register</button>
        </div>
      </div>
    </div>
  )
}
