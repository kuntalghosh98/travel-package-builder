import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './AppLayout.jsx';
import { TemplatesPage } from '../features/templates/TemplatesPage.jsx';
import { MyTemplatesPage } from '../features/templates/MyTemplatesPage.jsx';
import { BuilderPage } from '../features/builder/BuilderPage.jsx';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/templates" replace />} />
          <Route path="/templates/my-templates" element={<Navigate to="/my-templates" replace />} />
          <Route path="/my-templates" element={<MyTemplatesPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/builder/:packageId" element={<BuilderPage />} />
          <Route path="*" element={<Navigate to="/templates" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
