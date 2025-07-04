import { type Component, createSignal, onMount } from 'solid-js'
import { Card, Button, Layout } from '../components'
import { apiClient } from '../lib/api'

const Dashboard: Component = () => {
  const [serverData, setServerData] = createSignal<any>(null)
  const [loading, setLoading] = createSignal(false)
  
  const fetchServerData = async () => {
    setLoading(true)
    const response = await apiClient.hello()
    if (response.data) {
      setServerData(response.data)
    }
    setLoading(false)
  }
  
  onMount(() => {
    fetchServerData()
  })
  
  return (
    <Layout title="Admin Dashboard">
      <div class="space-y-6">
        <div class="text-center">
          <p class="text-lg text-gray-600">
            Administrative Dashboard
          </p>
        </div>
        
        <Card class="mb-6">
          <div class="text-center">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">
              System Status
            </h2>
            <Button 
              onClick={fetchServerData} 
              loading={loading()}
              class="mb-4"
            >
              Refresh System Data
            </Button>
            {serverData() && (
              <div class="text-sm text-gray-600 space-y-2">
                <p><strong>Status:</strong> {serverData().message}</p>
                <p><strong>Server Time:</strong> {serverData().server_time}</p>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
                  <div class="bg-gray-50 p-2 rounded">
                    <p class="font-medium">CPU Usage</p>
                    <p>{serverData().load_data.cpu_usage}%</p>
                  </div>
                  <div class="bg-gray-50 p-2 rounded">
                    <p class="font-medium">Memory Usage</p>
                    <p>{serverData().load_data.memory_usage}%</p>
                  </div>
                  <div class="bg-gray-50 p-2 rounded">
                    <p class="font-medium">Disk Usage</p>
                    <p>{serverData().load_data.disk_usage}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card>
            <h2 class="text-xl font-semibold text-gray-900 mb-4">
              User Management
            </h2>
            <p class="text-gray-600 mb-4">
              Manage user accounts, permissions, and authentication settings.
            </p>
            <a href="/users" class="text-blue-600 hover:text-blue-800 font-medium">
              View Users →
            </a>
          </Card>
          
          <Card>
            <h2 class="text-xl font-semibold text-gray-900 mb-4">
              Permission System
            </h2>
            <p class="text-gray-600 mb-4">
              Configure user roles and access permissions across the system.
            </p>
            <a href="/permissions" class="text-blue-600 hover:text-blue-800 font-medium">
              Manage Permissions →
            </a>
          </Card>
          
          <Card>
            <h2 class="text-xl font-semibold text-gray-900 mb-4">
              System Settings
            </h2>
            <p class="text-gray-600 mb-4">
              Configure application settings and system preferences.
            </p>
            <a href="/settings" class="text-blue-600 hover:text-blue-800 font-medium">
              System Settings →
            </a>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard