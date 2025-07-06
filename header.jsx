import React from 'react'
import PropTypes from 'prop-types'

function Header({ theme, onThemeToggle, onLogout }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">BluePrint AI</h1>
        <div className="header-actions">
          <button 
            type="button"
            className="theme-toggle-btn"
            onClick={onThemeToggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button 
            type="button"
            className="logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

Header.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
  onThemeToggle: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
}

export default Header