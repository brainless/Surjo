import { type Component, createSignal, onMount, For } from 'solid-js'
import { Card, Layout, Button, Input, Modal } from '../components'
import { apiClient } from '../lib/api'
import { type components } from '../types/api'

const Users: Component = () => {
  const [users, setUsers] = createSignal<components['schemas']['UserResponse'][]>([])
  const [loading, setLoading] = createSignal(false)
  const [showCreateModal, setShowCreateModal] = createSignal(false)
  const [createLoading, setCreateLoading] = createSignal(false)
  const [formData, setFormData] = createSignal({
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  })
  
  const fetchUsers = async () => {
    setLoading(true)
    const response = await apiClient.getUsers()
    if (response.data) {
      setUsers(response.data)
    }
    setLoading(false)
  }
  
  const handleCreateUser = async () => {
    const data = formData()
    if (!data.email || !data.password) return
    
    setCreateLoading(true)
    const response = await apiClient.createUser({
      email: data.email,
      password: data.password,
      first_name: data.first_name || null,
      last_name: data.last_name || null,
    })
    
    if (response.data) {
      setShowCreateModal(false)
      setFormData({ email: '', password: '', first_name: '', last_name: '' })
      await fetchUsers()
    }
    setCreateLoading(false)
  }
  
  onMount(() => {
    fetchUsers()
  })
  
  return (
    <Layout title="User Management" maxWidth="6xl">
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Users</h1>
            <p class="text-gray-600">Manage user accounts and permissions</p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            class="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add User
          </Button>
        </div>
        
        <Card>
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900">
              User List
            </h2>
            <Button 
              onClick={fetchUsers} 
              loading={loading()}
              variant="outline"
            >
              Refresh
            </Button>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <For each={users()} fallback={
                  <tr>
                    <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                      {loading() ? 'Loading...' : 'No users found'}
                    </td>
                  </tr>
                }>
                  {(user) => (
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span class="text-sm font-medium text-gray-700">
                                {user.first_name?.charAt(0) || user.last_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">
                              {user.first_name || user.last_name ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'No name'}
                            </div>
                            <div class="text-sm text-gray-500">
                              ID: {user.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button class="text-blue-600 hover:text-blue-900 mr-3">
                          Edit
                        </button>
                        <button class="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </Card>
        
        <Modal 
          isOpen={showCreateModal()} 
          onClose={() => setShowCreateModal(false)}
          title="Create New User"
        >
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <Input
                type="email"
                value={formData().email}
                onInput={(value) => setFormData(prev => ({ ...prev, email: value }))}
                placeholder="user@example.com"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <Input
                type="password"
                value={formData().password}
                onInput={(value) => setFormData(prev => ({ ...prev, password: value }))}
                placeholder="Enter password"
                required
              />
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <Input
                  type="text"
                  value={formData().first_name}
                  onInput={(value) => setFormData(prev => ({ ...prev, first_name: value }))}
                  placeholder="First name"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <Input
                  type="text"
                  value={formData().last_name}
                  onInput={(value) => setFormData(prev => ({ ...prev, last_name: value }))}
                  placeholder="Last name"
                />
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateUser}
                loading={createLoading()}
                disabled={!formData().email || !formData().password}
              >
                Create User
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  )
}

export default Users