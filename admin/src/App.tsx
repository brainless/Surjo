import { Router, Route, A } from '@solidjs/router'
import { lazy } from 'solid-js'

const Dashboard = lazy(() => import('./pages/Home'))
const Users = lazy(() => import('./pages/About'))

function App() {
  return (
    <Router>
      <div class="min-h-screen bg-gray-50">
        <nav class="bg-white shadow-lg">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
              <div class="flex items-center">
                <A href="/" class="text-xl font-semibold text-gray-900">
                  Surjo Admin
                </A>
              </div>
              <div class="flex items-center space-x-4">
                <A href="/" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </A>
                <A href="/users" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Users
                </A>
                <A href="/permissions" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Permissions
                </A>
                <A href="/settings" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Settings
                </A>
              </div>
            </div>
          </div>
        </nav>
        
        <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Route path="/" component={Dashboard} />
          <Route path="/users" component={Users} />
        </main>
      </div>
    </Router>
  )
}

export default App
