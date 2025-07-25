'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  isEmailVerified: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await api.get('/auth/me')
        setUser(response.data.user)
      }
    } catch (error) {
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    const { token, user } = response.data
    localStorage.setItem('token', token)
    setUser(user)
  }

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      console.log('🌐 AuthContext: Making API call to:', `${API_URL}/auth/register`);
      console.log('📤 AuthContext: Request payload:', { email, firstName, lastName, passwordProvided: !!password });
      
      const response = await api.post('/auth/register', { 
        email, 
        password, 
        firstName, 
        lastName 
      })
      
      console.log('📥 AuthContext: Response received:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      
      if (response.data.success) {
        const { token, user } = response.data
        localStorage.setItem('token', token)
        setUser(user)
        console.log('✅ AuthContext: User successfully registered and logged in');
      } else {
        throw new Error(response.data.message || 'Registration failed')
      }
    } catch (error: any) {
      console.error('❌ AuthContext: Registration error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        response: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        },
        request: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL
        },
        isAxiosError: error.isAxiosError
      });
      
      if (error.response?.status === 400) {
        const errors = error.response.data.errors
        if (errors && errors.length > 0) {
          const fieldErrors = errors.map((err: any) => `${err.path}: ${err.msg}`).join(', ')
          throw new Error(`Please fix the following: ${fieldErrors}`)
        }
        throw new Error(error.response.data.message || 'Invalid registration data')
      } else if (error.response?.status === 409) {
        throw new Error('An account with this email already exists')
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else if (error.message) {
        throw new Error(error.message)
      } else {
        throw new Error('Registration failed. Please check your internet connection and try again.')
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 