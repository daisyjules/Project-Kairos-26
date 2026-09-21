import React from 'react';
import { KairosProvider, useKairos } from './context/KairosContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { MasterDashboard } from './components/MasterDashboard';
import { DiaryView } from './components/DiaryView';
import { AllocationView } from './components/AllocationView';
import { KlinFitzView } from './components/KlinFitzView';
import { ZanzibarView } from './components/ZanzibarView';
import { PoultryView } from './components/PoultryView';
import { UTTView } from './components/UTTView';
import { CarLaptopView } from './components/CarLaptopView';
import { LoanDashboardView } from './components/LoanDashboardView';
import { RetroAtelierView } from './components/RetroAtelierView';
import { ApexEcosystemView } from './components/ApexEcosystemView';
import { RoadmapView } from './components/RoadmapView';
import { MonthlyTrackerView } from './components/MonthlyTrackerView';
import { motion, AnimatePresence } from 'motion/react';

const DashboardContent: React.FC = () => {
  const { state } = useKairos();

  const renderActiveView = () => {
    switch (state.activeTab) {
      case 'dashboard':
      case 'master' as any:
        return <MasterDashboard />;
      case 'diary':
        return <DiaryView />;
      case 'allocation':
        return <AllocationView />;
      case 'klinfitz':
        return <KlinFitzView />;
      case 'zanzibar':
        return <ZanzibarView />;
      case 'poultry':
        return <PoultryView />;
      case 'utt':
        return <UTTView />;
      case 'car_laptop':
        return <CarLaptopView />;
      case 'loan':
        return <LoanDashboardView />;
      case 'retro_atelier':
        return <RetroAtelierView />;
      case 'apex_ecosystem':
        return <ApexEcosystemView />;
      case 'roadmap':
        return <RoadmapView />;
      case 'monthly_tracker':
        return <MonthlyTrackerView />;
      default:
        return <MasterDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#242220] flex flex-col font-sans selection:bg-[#2D4A3E] selection:text-white transition-colors duration-200">
      {/* Top Founder Header */}
      <Header />

      {/* Main Structural Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs */}
        <Navigation />

        {/* Dynamic View Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={state.activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Minimal Clean Footer */}
      <footer className="border-t border-gray-200/80 bg-white/70 backdrop-blur-xs py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 text-white text-xs font-bold">
              K
            </div>
            <span className="font-semibold text-gray-900 tracking-tight">
              PROJECT KAIROS 26
            </span>
            <span className="text-gray-300">•</span>
            <span>Founder Capital Deployment & Modeling</span>
          </div>

          <div className="text-gray-400 text-[11px]">
            TZS 30,000,000 Allocation • Debt Service Coverage • Cashflow Engines
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <KairosProvider>
      <DashboardContent />
    </KairosProvider>
  );
}
