import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { LoginView } from './components/LoginModal';
import { MedicalAlertBanner } from './components/MedicalAlertBanner';
import { PrintableReport } from './components/PrintableReport';
import { DashboardView } from './views/DashboardView';
import { MonevReportsView } from './views/MonevReportsView';
import { CaborManagementView } from './views/CaborManagementView';
import { AthletesView } from './views/AthletesView';
import { PhysicalTestView } from './views/PhysicalTestView';
import { MedicalAlertsView } from './views/MedicalAlertsView';
import { UserManagementView } from './views/UserManagementView';
import { KopSettingsView } from './views/KopSettingsView';
import { LaporanMonev } from './types';

const MainLayout: React.FC = () => {
  const { currentUser } = useApp();
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [printableReport, setPrintableReport] = useState<LaporanMonev | null>(null);
  const [createReportModalOpen, setCreateReportModalOpen] = useState(false);

  // If user is not logged in, show official Login screen with role switcher
  if (!currentUser) {
    return <LoginView />;
  }

  const handleOpenPrintReport = (laporan: LaporanMonev) => {
    setPrintableReport(laporan);
  };

  const handleOpenCreateReportFromDashboard = () => {
    setCurrentTab('reports');
    setCreateReportModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col">
      {/* Top Navigation Bar */}
      <Navbar
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        onOpenMedicalAlerts={() => setCurrentTab('medical_alerts')}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto app-main-body">
        {/* Responsive Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Viewport Content */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 min-w-0 transition-all">
          {/* Real-time urgent medical alert banner */}
          <MedicalAlertBanner 
            onOpenMedicalView={() => setCurrentTab('medical_alerts')} 
          />

          {/* Tab Views */}
          {currentTab === 'dashboard' && (
            <DashboardView
              onOpenReport={handleOpenPrintReport}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenCreateReport={handleOpenCreateReportFromDashboard}
            />
          )}

          {currentTab === 'reports' && (
            <MonevReportsView
              onOpenPrintReport={handleOpenPrintReport}
              createModalOpen={createReportModalOpen}
              onCloseCreateModal={() => setCreateReportModalOpen(false)}
            />
          )}

          {currentTab === 'cabors' && <CaborManagementView />}

          {currentTab === 'athletes' && <AthletesView />}

          {currentTab === 'physical_tests' && <PhysicalTestView />}

          {currentTab === 'medical_alerts' && <MedicalAlertsView />}

          {currentTab === 'kop_settings' && <KopSettingsView />}

          {currentTab === 'users' && <UserManagementView />}
        </main>
      </div>

      {/* Official Printable PDF Modal Dialog */}
      {printableReport && (
        <PrintableReport
          laporan={printableReport}
          onClose={() => setPrintableReport(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
