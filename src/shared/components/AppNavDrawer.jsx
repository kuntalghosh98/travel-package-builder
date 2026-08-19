import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function ClipboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const NAV_ITEMS = [
  { to: '/templates', label: 'Templates', icon: ClipboardIcon, end: true },
  { to: '/my-templates', label: 'My templates', icon: FolderIcon, end: true }
];

export function AppNavDrawer({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <>
      <button
        type="button"
        className={`app-nav-drawer__overlay ${isOpen ? 'app-nav-drawer__overlay--visible' : ''}`}
        aria-label="Close navigation menu"
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
      />

      <aside
        id="app-nav-drawer"
        className={`app-nav-drawer ${isOpen ? 'app-nav-drawer--open' : ''}`}
        aria-hidden={!isOpen}
        aria-label="Main navigation"
      >
        <div className="app-nav-drawer__header">
          <span className="app-nav-drawer__title">Menu</span>
          <button
            type="button"
            className="app-nav-drawer__close"
            aria-label="Close navigation menu"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="app-nav-drawer__nav">
          <div className="app-nav-drawer__section-label">Navigate</div>
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `app-nav-drawer__link${isActive ? ' app-nav-drawer__link--active' : ''}`}
              onClick={onClose}
            >
              <span className="app-nav-drawer__link-icon">
                <Icon />
              </span>
              <span className="app-nav-drawer__link-label">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
