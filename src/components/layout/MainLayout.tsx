
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Dashboard } from '@/pages/Dashboard';
import { TemplesPage } from '@/pages/TemplesPage';
import { FamiliesPage } from '@/pages/FamiliesPage';
import { VillagesPage } from '@/pages/VillagesPage';
import { DanaPage } from '@/pages/DanaPage';
import { UsersPage } from '@/pages/UsersPage';
import { StatsPage } from '@/pages/StatsPage';
import { SettingsPage } from '@/pages/SettingsPage';

export function MainLayout() {
  const [currentPath, setCurrentPath] = useState('/dashboard');

  const renderPage = () => {
    switch (currentPath) {
      case '/dashboard':
        return <Dashboard />;
      case '/temples':
        return <TemplesPage />;
      case '/families':
        return <FamiliesPage />;
      case '/villages':
        return <VillagesPage />;
      case '/dana':
        return <DanaPage />;
      case '/users':
        return <UsersPage />;
      case '/stats':
        return <StatsPage />;
      case '/settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentPath={currentPath} onNavigate={setCurrentPath} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
