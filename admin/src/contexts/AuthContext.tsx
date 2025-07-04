import { createContext, useContext, createSignal, createEffect, type ParentComponent } from 'solid-js'
import { type components } from '../types/api'
import apiClient from '../lib/api'

export interface AuthContextType {
  user: () => components['schemas']['UserResponse'] | null
  isAuthenticated: () => boolean
  isAdmin: () => boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: () => boolean
}

const AuthContext = createContext<AuthContextType>()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal<components['schemas']['UserResponse'] | null>(null)
  const [loading, setLoading] = createSignal(false)
  const [isAdminUser, setIsAdminUser] = createSignal(false)
  
  // Load user from localStorage on mount
  createEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    const adminStatus = localStorage.getItem('isAdmin')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAdminUser(adminStatus === 'true')
        apiClient.setAuthToken(token)
      } catch (error) {
        console.error('Failed to parse user data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('isAdmin')
      }
    }
  })
  
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    
    try {
      const response = await apiClient.login({ email, password })
      
      if (response.data) {
        // The backend login response includes admin check in the JWT token
        // If we get a successful response, the user is an admin
        setUser(response.data.user)
        setIsAdminUser(true)
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        localStorage.setItem('isAdmin', 'true')
        apiClient.setAuthToken(response.data.token)
        return true
      } else {
        console.error('Login failed:', response.error)
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }
  
  const logout = () => {
    setUser(null)
    setIsAdminUser(false)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('isAdmin')
    apiClient.setAuthToken('')
  }
  
  const isAuthenticated = () => user() !== null
  
  const isAdmin = () => isAdminUser()
  
  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    loading,
  }
  
  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  )
}