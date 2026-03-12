import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import SelectionScreen from './components/SelectionScreen';
import SalesDashboard from './components/SalesDashboard';
import BudgetDashboard from './components/BudgetDashboard';
import CreativeDashboard from './components/CreativeDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<'selection' | 'sales' | 'budget' | 'creative'>('selection');

  const navigateTo = (view: 'selection' | 'sales' | 'budget' | 'creative') => {
    setCurrentView(view);
  };

  return (
    <AnimatePresence mode="wait">
      {currentView === 'selection' && (
        <SelectionScreen key="selection" onSelect={navigateTo} />
      )}
      {currentView === 'sales' && (
        <SalesDashboard key="sales" onBack={() => navigateTo('selection')} onNavigate={navigateTo} />
      )}
      {currentView === 'budget' && (
        <BudgetDashboard key="budget" onBack={() => navigateTo('selection')} onNavigate={navigateTo} />
      )}
      {currentView === 'creative' && (
        <CreativeDashboard key="creative" onBack={() => navigateTo('selection')} onNavigate={navigateTo} />
      )}
    </AnimatePresence>
  );
}