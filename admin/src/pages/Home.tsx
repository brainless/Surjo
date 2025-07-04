import { type Component, createSignal, onMount } from 'solid-js'
import { Card, Button, Layout } from '../components'
import { apiClient } from '../lib/api'

const Dashboard: Component = () => {
  const [serverData, setServerData] = createSignal<any>(null)
  const [loading, setLoading] = createSignal(false)
  const [userCount, setUserCount] = createSignal(0)
  
  const fetchServerData = async () => {
    setLoading(true)
    const response = await apiClient.hello()
    if (response.data) {
      setServerData(response.data)
    }
    setLoading(false)
  }
  
  const fetchUserCount = async () => {
    const response = await apiClient.getUsers()
    if (response.data) {
      setUserCount(response.data.length)
    }
  }
  
  onMount(() => {
    fetchServerData()
    fetchUserCount()
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
                <p><strong>Server Time:</strong> {new Date(serverData().server_time).toLocaleString()}</p>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
                  <div class="bg-gray-50 p-2 rounded">
                    <p class="font-medium">CPU Usage</p>
                    <p>{serverData().load_data.cpu_usage.toFixed(1)}%</p>
                  </div>
                  <div class="bg-gray-50 p-2 rounded">
                    <p class="font-medium">Memory Usage</p>
                    <p>{serverData().load_data.memory_usage.toFixed(1)}%</p>
                  </div>
                  <div class="bg-gray-50 p-2 rounded">
                    <p class="font-medium">Total Memory</p>
                    <p>{(serverData().load_data.total_memory / 1024 / 1024 / 1024).toFixed(1)} GB</p>
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
            <div class="text-3xl font-bold text-blue-600 mb-2">
              {userCount()}
            </div>
            <p class="text-gray-500 text-sm mb-4">Total Users</p>
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
            <div class="text-3xl font-bold text-green-600 mb-2">
              2
            </div>
            <p class="text-gray-500 text-sm mb-4">Permission Types</p>
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
            <div class="text-3xl font-bold text-purple-600 mb-2">
              ⚙️
            </div>
            <p class="text-gray-500 text-sm mb-4">Configuration</p>
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