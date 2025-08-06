import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex">
              <div className="flex space-x-8">
                <Link
                  to="/dashboard"
                  className={`py-4 px-2 text-gray-700 border-b-4 font-semibold hover:text-blue-500 transition duration-300 ${
                    isActive('/dashboard')
                      ? 'border-blue-500 text-blue-500'
                      : 'border-transparent'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/analytics"
                  className={`py-4 px-2 text-gray-700 border-b-4 font-semibold hover:text-blue-500 transition duration-300 ${
                    isActive('/analytics')
                      ? 'border-blue-500 text-blue-500'
                      : 'border-transparent'
                  }`}
                >
                  Analytics
                </Link>
                <Link
                  to="/reports"
                  className={`py-4 px-2 text-gray-700 border-b-4 font-semibold hover:text-blue-500 transition duration-300 ${
                    isActive('/reports')
                      ? 'border-blue-500 text-blue-500'
                      : 'border-transparent'
                  }`}
                >
                  Reports
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-700">Hello, {user?.email}</span>
              <button
                onClick={handleSignOut}
                className="py-2 px-4 bg-red-500 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4">{children}</main>
    </div>
  )
}