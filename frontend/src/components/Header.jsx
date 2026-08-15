import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { LogOutIcon, SearchIcon } from './icons'

export default function Header({ onSearch }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user
    ? user.username.slice(0, 2).toUpperCase()
    : 'JT'

  return (
    <header className="header">
      <div className="header-brand">
        <div className="brand-mark">
          <span>JT</span>
        </div>
        <div className="brand-text">
          <span className="brand-name">JobTrack</span>
          <span className="brand-tagline">Application CRM</span>
        </div>
      </div>

      <div className="header-center">
        <div className="search-box">
          <SearchIcon width={16} height={16} />
          <input
            type="search"
            className="search-input"
            placeholder="Search company or role…"
            onChange={(e) => onSearch?.(e.target.value)}
            aria-label="Search applications"
          />
        </div>
      </div>

      <div className="header-user" ref={menuRef}>
        <span className="user-greeting">Hi, {user?.username}</span>
        <button
          type="button"
          className="avatar"
          onClick={() => setMenuOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="Account menu"
        >
          {initials}
        </button>
        {menuOpen && (
          <div className="user-menu" role="menu">
            <div className="user-menu-header">
              <strong>{user?.username}</strong>
              <span>{user?.email}</span>
            </div>
            <button
              type="button"
              className="user-menu-item"
              role="menuitem"
              onClick={handleLogout}
            >
              <LogOutIcon width={16} height={16} />
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}