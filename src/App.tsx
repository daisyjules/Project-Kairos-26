import React from 'react';
import { KairosProvider, useKairos } from './context/KairosContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { MasterDashboard } from './components/MasterDashboard';
import { WelcomeOverview } from './components/WelcomeOverview';
import { SteazyView } from './components/SteazyView';
import { DiaryView } from './components/DiaryView';
import { AllocationView } from './components/AllocationView';
import { KlinFitzView } from './components/KlinFitzView';
import { ZanzibarView } from './components/ZanzibarView';
import { PoultryView } from './components/PoultryView';
import { MamaKubwaView } from './components/MamaKubwaView';
import { DSEPortfolioView } from './components/DSEPortfolioView';
import { SalarySavingsView } from './components/SalarySavingsView';
import { UTTView } from './components/UTTView';
import { CarLaptopView } from './components/CarLaptopView';
import { LoanDashboardView } from './components/LoanDashboardView';
import { RetroAtelierView } from './components/RetroAtelierView';
import { ApexEcosystemView } from './components/ApexEcosystemView';
import { RoadmapView } from './components/RoadmapView';
import { MonthlyTrackerView } from './components/MonthlyTrackerView';
import { MilestoneCelebrationModal } from './components/MilestoneCelebrationModal';
import { motion, AnimatePresence } from 'motion/react';

const DashboardContent: React.FC = () => {
  const { state, activeCelebrationMilestone, closeCelebrationModal } = useKairos();

  const renderActiveView = () => {
    switch (state.activeTab) {
      case 'dashboard':
      case 'master' as any:
        return (
          <div className="flex flex-col gap-8">
            <WelcomeOverview />
            <MasterDashboard />
          </div>
        );
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
      case 'mama_kubwa':
        return <MamaKubwaView />;
      case 'steazy':
        return <SteazyView />;
      case 'dse':
        return <DSEPortfolioView />;
      case 'salary_savings':
        return <SalarySavingsView />;
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

      {/* Global Milestone Celebration Modal */}
      <MilestoneCelebrationModal
        milestone={activeCelebrationMilestone}
        onClose={closeCelebrationModal}
      />

      <footer className="border-t border-gray-200/80 py-5 text-center text-xs text-gray-400">
        Project Kairos 26 · Founder capital planning
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
