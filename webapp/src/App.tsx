import { Router, Route } from '@solidjs/router'
import { lazy } from 'solid-js'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))

function App() {
  return (
    <Router>
      <div class="min-h-screen bg-gray-50">
        <nav class="bg-white shadow-lg">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
              <div class="flex items-center">
                <a href="/" class="text-xl font-semibold text-gray-900">
                  Surjo
                </a>
              </div>
              <div class="flex items-center space-x-4">
                <a href="/" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </a>
                <a href="/about" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  About
                </a>
              </div>
            </div>
          </div>
        </nav>
        
        <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
        </main>
      </div>
    </Router>
  )
}

export default App
