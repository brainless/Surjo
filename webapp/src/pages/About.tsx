import { type Component } from 'solid-js'
import { Card, Layout } from '../components'

const About: Component = () => {
  return (
    <Layout title="About Surjo" maxWidth="2xl">
      <div class="space-y-6">
        <div class="text-center">
          <p class="text-lg text-gray-600">
            A modern full-stack web application built with Rust and SolidJS
          </p>
        </div>
        
        <Card>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Technology Stack
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-medium text-gray-900 mb-2">Backend</h3>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>• Rust with Actix Web</li>
                <li>• SQLite database</li>
                <li>• JWT authentication</li>
                <li>• OAuth integration</li>
                <li>• OpenAPI documentation</li>
              </ul>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 mb-2">Frontend</h3>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>• SolidJS with TypeScript</li>
                <li>• TailwindCSS styling</li>
                <li>• Vite build tool</li>
                <li>• Mobile-first design</li>
                <li>• Auto-generated API types</li>
              </ul>
            </div>
          </div>
        </Card>
        
        <Card>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Features
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="font-medium text-gray-900 mb-2">Authentication</h3>
              <p class="text-sm text-gray-600">
                Secure user authentication with JWT tokens and Google OAuth support.
              </p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="font-medium text-gray-900 mb-2">Type Safety</h3>
              <p class="text-sm text-gray-600">
                Full type safety from backend to frontend with auto-generated types.
              </p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="font-medium text-gray-900 mb-2">Mobile First</h3>
              <p class="text-sm text-gray-600">
                Responsive design optimized for mobile devices and touch interfaces.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default About