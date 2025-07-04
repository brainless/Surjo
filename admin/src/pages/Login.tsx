import { type Component, createSignal } from 'solid-js'
import { useAuth } from '../contexts/AuthContext'
import { Button, Input, Card } from '../components'

const Login: Component = () => {
  const auth = useAuth()
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [error, setError] = createSignal('')
  
  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setError('')
    
    if (!email() || !password()) {
      setError('Please fill in all fields')
      return
    }
    
    const success = await auth.login(email(), password())
    
    if (!success) {
      setError('Invalid credentials or insufficient permissions')
    }
  }
  
  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Access restricted to administrators only
          </p>
        </div>
        
        <Card class="mt-8">
          <form class="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                type="email"
                value={email()}
                onInput={setEmail}
                placeholder="Enter your email"
                required
                class="w-full"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                type="password"
                value={password()}
                onInput={setPassword}
                placeholder="Enter your password"
                required
                class="w-full"
              />
            </div>
            
            {error() && (
              <div class="text-red-600 text-sm text-center">
                {error()}
              </div>
            )}
            
            <Button
              type="submit"
              loading={auth.loading()}
              class="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign In
            </Button>
          </form>
        </Card>
        
        <div class="text-center text-sm text-gray-500">
          <p>Need admin access? Contact your system administrator.</p>
        </div>
      </div>
    </div>
  )
}

export default Login