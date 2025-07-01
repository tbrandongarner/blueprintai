import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const abortControllerRef = useRef(null)

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
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters'
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
    const controller = new AbortController()
    abortControllerRef.current = controller
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trimmedData),
          signal: controller.signal
        }
      )
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || 'Login failed')
      }
      localStorage.setItem('authToken', result.token)
      navigate('/')
    } catch (error) {
      if (error.name === 'AbortError') {
        return
      }
      setErrors({ general: error.message })
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
    <div className="login-container">
      <form className="login-form" onSubmit={handleLoginSubmit} noValidate>
        <h2>Login</h2>
        {errors.general && (
          <div className="error-message" role="alert">
            {errors.general}
          </div>
        )}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
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
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
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
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in?' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default Login