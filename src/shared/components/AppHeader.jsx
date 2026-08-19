import React from 'react';

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c0-3.314 3.134-6 7-6s7 2.686 7 6" />
    </svg>
  );
}

export function AppHeader({ isNavOpen, onMenuToggle }) {
  return (
    <header className="app-header">
      <div className="app-header__start">
        <button
          type="button"
          className="app-header__menu-btn"
          aria-label={isNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isNavOpen}
          aria-controls="app-nav-drawer"
          onClick={onMenuToggle}
        >
          <MenuIcon />
        </button>
        <span className="app-header__brand">TRAVO AI</span>
      </div>

      <div className="app-header__end">
        <button
          type="button"
          className="app-header__profile-btn"
          aria-label="Open profile menu"
        >
          <ProfileIcon />
        </button>
      </div>
    </header>
  );
}
