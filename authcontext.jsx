import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // Check for existing user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    if (savedUser && isAuthenticated === 'true') {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful login
      const mockUser = {
        id: '1',
        email: email,
        name: 'Demo User'
      }
      
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
      localStorage.setItem('isAuthenticated', 'true')
      
      return mockUser
    } catch (error) {
      throw new Error('Login failed')
    }
  }

  const signup = async (userData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Check if user already exists (mock check)
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      const userExists = existingUsers.find(u => u.email === userData.email)
      
      if (userExists) {
        throw new Error('User with this email already exists')
      }
      
      // Mock successful signup
      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.username,
        username: userData.username
      }
      
      // Store user in mock database
      existingUsers.push(newUser)
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers))
      
      // Auto-login after signup
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
      localStorage.setItem('isAuthenticated', 'true')
      
      return newUser
    } catch (error) {
      throw new Error(error.message || 'Signup failed')
    }
  }
  
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('isAuthenticated')
  }

  const value = useMemo(
    () => ({
      user,
      signup,
      login,
      logout,
      isAuthenticated: !!user
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}