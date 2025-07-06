import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './authcontext.jsx'
import './auth.css'

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateSignupForm = (data) => {
    const errs = {}
    if (!data.username.trim()) {
      errs.username = 'Username is required'
    }
    if (!data.email) {
      errs.email = 'Email is required'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        errs.email = 'Invalid email address'
      }
    }
    if (!data.password) {
      errs.password = 'Password is required'
    } else if (data.password.length < 8) {
      errs.password = 'Password must be at least 8 characters'
    }
    if (!data.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password'
    } else if (data.confirmPassword !== data.password) {
      errs.confirmPassword = 'Passwords do not match'
    }
    return errs
  }

  const { signup } = useAuth()

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    const validationErrors = validateSignupForm(formData)
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }
    try {
      setIsSubmitting(true)
      await signup({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password
      })
      navigate('/dashboard')
    } catch (err) {
      setErrors({ general: err.message || 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        {errors.general && <div className="error-message" role="alert">{errors.general}</div>}
        
        <form onSubmit={handleSignupSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              className={`form-input ${errors.username ? 'error' : ''}`}
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              disabled={isSubmitting}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

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
              disabled={isSubmitting}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
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
              placeholder="Create a password"
              disabled={isSubmitting}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting && <span className="loading-spinner"></span>}
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-link">
          <p>Already have an account? <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Sign in here</a></p>
        </div>
      </div>
    </div>
  )
}