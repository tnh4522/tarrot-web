'use client'

import { useState } from 'react'

type Tab = 'reading' | 'encyclopedia' | 'history' | 'settings'

interface NavbarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  onOpenTour?: () => void
}

export default function Navbar({ activeTab, onTabChange, onOpenTour }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'reading', label: 'Bói Bài AI', icon: '🔮' },
    { id: 'encyclopedia', label: 'Bách Khoa', icon: '📖' },
    { id: 'history', label: 'Lịch Sử', icon: '📜' },
    { id: 'settings', label: 'Cài Đặt', icon: '⚙️' },
  ]

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
        background: 'rgba(5, 3, 15, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <div
        className="container-app"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
          gap: '16px',
        }}
      >
        {/* Logo */}
        <button
          id="nav-logo"
          onClick={() => onTabChange('reading')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
          }}
        >
          <span
            style={{ fontSize: '24px', filter: 'drop-shadow(0 0 8px rgba(167, 139, 250, 0.8))' }}
            className="animate-bounce-subtle"
          >
            🔮
          </span>
          <div>
            <div
              className="font-heading gradient-text-mystic"
              style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.05em', lineHeight: 1 }}
            >
              MysticTarot
            </div>
            <div
              className="font-ui text-dim"
              style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}
            >
              AI Powered
            </div>
          </div>
        </button>

        {/* Desktop Nav */}
        <div
          style={{ display: 'flex', gap: '4px', alignItems: 'center' }}
          className="desktop-nav"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: activeTab === tab.id ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
                background:
                  activeTab === tab.id
                    ? 'rgba(109, 40, 217, 0.2)'
                    : 'transparent',
                color: activeTab === tab.id ? 'var(--color-violet-glow)' : 'var(--color-text-muted)',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? 500 : 400,
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  const el = e.currentTarget
                  el.style.color = 'var(--color-text)'
                  el.style.background = 'rgba(109, 40, 217, 0.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  const el = e.currentTarget
                  el.style.color = 'var(--color-text-muted)'
                  el.style.background = 'transparent'
                }
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}

          {onOpenTour && (
            <button
              id="nav-btn-tour"
              onClick={onOpenTour}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                marginLeft: '8px',
                borderRadius: '20px',
                border: '1px solid rgba(212, 160, 23, 0.4)',
                background: 'rgba(212, 160, 23, 0.1)',
                color: 'var(--color-gold-light)',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                fontSize: '13px',
                fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212, 160, 23, 0.2)'
                e.currentTarget.style.borderColor = 'rgba(212, 160, 23, 0.8)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(212, 160, 23, 0.1)'
                e.currentTarget.style.borderColor = 'rgba(212, 160, 23, 0.4)'
              }}
            >
              <span>🧭</span>
              <span>Hướng Dẫn</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          id="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            color: 'var(--color-text)',
            fontSize: '20px',
          }}
          className="mobile-menu-btn"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
          className="mobile-menu"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id)
                setMobileOpen(false)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background:
                  activeTab === tab.id ? 'rgba(109, 40, 217, 0.2)' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-violet-glow)' : 'var(--color-text)',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                fontSize: '15px',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <span style={{ fontSize: '18px' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}

          {onOpenTour && (
            <button
              onClick={() => {
                onOpenTour()
                setMobileOpen(false)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(212, 160, 23, 0.4)',
                background: 'rgba(212, 160, 23, 0.1)',
                color: 'var(--color-gold-light)',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                fontSize: '15px',
                textAlign: 'left',
                width: '100%',
                marginTop: '4px',
              }}
            >
              <span style={{ fontSize: '18px' }}>🧭</span>
              <span>Hướng Dẫn Từng Bước</span>
            </button>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
