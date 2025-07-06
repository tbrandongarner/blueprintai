import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './authcontext.jsx'
import './auth.css'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const abortControllerRef = useRef(null)
  const { login } = useAuth()

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  function validateLoginForm({ email, password }) {
    const errs = {}
    if (!email) {
      errs.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Invalid email address'
    }
    if (!password) {
      errs.password = 'Password is required'
    } else if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters'
    }
    return errs
  }

  async function handleLoginSubmit(event) {
    event.preventDefault()
    const trimmedData = {
      email: formData.email.trim(),
      password: formData.password.trim()
    }
    const validationErrors = validateLoginForm(trimmedData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setIsSubmitting(true)
    setErrors({})
    try {
      await login(trimmedData.email, trimmedData.password)
      navigate('/dashboard')
    } catch (error) {
      setErrors({ general: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => {
      const { [name]: removed, ...rest } = prev
      return rest
    })
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        {errors.general && (
          <div className="error-message" role="alert">
            {errors.general}
          </div>
        )}
        <form onSubmit={handleLoginSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              required
            />
            {errors.email && (
              <span className="error-text" id="email-error">
                {errors.email}
              </span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              required
            />
            {errors.password && (
              <span className="error-text" id="password-error">
                {errors.password}
              </span>
            )}
          </div>
          <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting && <span className="loading-spinner"></span>}
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-link">
          <p>Don't have an account? <a href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>Create one here</a></p>
        </div>
      </div>
    </div>
  )
}

export default Login