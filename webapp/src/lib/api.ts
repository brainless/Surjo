import { type components } from '../types/api'

const API_BASE_URL = 'http://localhost:8080/api'

export type ApiResponse<T> = {
  data: T | null
  error: string | null
}

class ApiClient {
  private baseUrl: string
  private headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  setAuthToken(token: string) {
    this.headers = {
      ...this.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        return {
          data: null,
          error: errorText || `HTTP ${response.status}`,
        }
      }

      const data = await response.json()
      return {
        data,
        error: null,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // Typed API methods
  async hello() {
    return this.get<components['schemas']['HelloWorldResponse']>('/hello')
  }

  async createUser(userData: components['schemas']['CreateUserRequest']) {
    return this.post<components['schemas']['UserResponse']>('/users', userData)
  }

  async getUser(id: string) {
    return this.get<components['schemas']['UserResponse']>(`/users/${id}`)
  }

  async updateUser(id: string, userData: components['schemas']['UpdateUserRequest']) {
    return this.put<components['schemas']['UserResponse']>(`/users/${id}`, userData)
  }

  async login(credentials: components['schemas']['LoginRequest']) {
    return this.post<components['schemas']['LoginResponse']>('/auth/login', credentials)
  }

  async googleAuth(authData: components['schemas']['GoogleAuthRequest']) {
    return this.post<components['schemas']['LoginResponse']>('/auth/google', authData)
  }
}

export const apiClient = new ApiClient()
export default apiClient