import { type Component, type ParentProps } from 'solid-js'
import { useAuth } from '../contexts/AuthContext'
import Login from '../pages/Login'

const ProtectedRoute: Component<ParentProps> = (props) => {
  const auth = useAuth()
  
  if (!auth.isAuthenticated()) {
    return <Login />
  }
  
  if (!auth.isAdmin()) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p class="text-gray-600 mb-4">You need administrator privileges to access this area.</p>
          <button
            onClick={auth.logout}
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    )
  }
  
  return <>{props.children}</>
}

export default ProtectedRoute