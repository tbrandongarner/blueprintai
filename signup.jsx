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
      await axios.post('/api/auth/register', {
        name: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password
      })
      navigate('/login')
    } catch (err) {
      if (err.response && err.response.data) {
        const resp = err.response.data
        if (resp.errors) {
          setErrors(resp.errors)
        } else if (resp.message) {
          setErrors({ general: resp.message })
        } else {
          setErrors({ general: 'An unexpected error occurred. Please try again.' })
        }
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSignupSubmit} noValidate>
      {errors.general && <div className="error">{errors.general}</div>}

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.username && <span className="error">{errors.username}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  )
}