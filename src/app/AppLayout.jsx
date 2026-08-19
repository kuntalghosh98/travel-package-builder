import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppHeader } from '../shared/components/AppHeader.jsx';
import { AppNavDrawer } from '../shared/components/AppNavDrawer.jsx';

export function AppLayout() {
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const closeNav = useCallback(() => setIsNavOpen(false), []);
  const toggleNav = useCallback(() => setIsNavOpen(prev => !prev), []);

  useEffect(() => {
    setIsNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-layout">
      <AppHeader isNavOpen={isNavOpen} onMenuToggle={toggleNav} />
      <AppNavDrawer isOpen={isNavOpen} onClose={closeNav} />
      <Outlet />
    </div>
  );
}
