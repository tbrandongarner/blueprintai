import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './authcontext.jsx'
import Header from './header'
import LoginPage from './login'
import SignupPage from './signup'
import DashboardPage from './dashboard'
import NotFoundPage from './NotFoundPage'

function App() {
  const storedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light')
  const [theme, setTheme] = useState(initialTheme)
  const { isAuthenticated, logout } = useAuth()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const handleThemeToggle = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <BrowserRouter>
      {isAuthenticated && (
        <Header theme={theme} onThemeToggle={handleThemeToggle} onLogout={logout} />
      )}
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App