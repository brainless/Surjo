import { type Component, type JSX } from 'solid-js'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './index'

interface LayoutProps {
  children: JSX.Element
  title?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '6xl' | 'full'
  class?: string
}

const Layout: Component<LayoutProps> = (props) => {
  const auth = useAuth()
  
  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full'
  }
  
  const maxWidth = () => props.maxWidth || 'full'
  
  return (
    <div class={`min-h-screen bg-gray-50 ${props.class || ''}`}>
      {/* Navigation Header */}
      <nav class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-4">
                <a href="/" class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </a>
                <a href="/users" class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Users
                </a>
              </div>
              
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">
                  {auth.user()?.email}
                </span>
                <Button
                  variant="outline"
                  onClick={auth.logout}
                  class="text-sm"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <div class={`mx-auto px-4 sm:px-6 lg:px-8 py-6 ${maxWidths[maxWidth()]}`}>
        {props.title && (
          <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
              {props.title}
            </h1>
          </div>
        )}
        {props.children}
      </div>
    </div>
  )
}

export default Layout