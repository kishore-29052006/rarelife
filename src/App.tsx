import React, { useEffect, useState } from 'react';
import { BackendDocsModal } from './components/BackendDocsModal';
import { DemoBanner } from './components/DemoBanner';
import { Footer } from './components/Footer';
import { MedicalDisclaimerModal } from './components/MedicalDisclaimerModal';
import { Navbar } from './components/Navbar';
import { NewEmergencyRequestModal } from './components/NewEmergencyRequestModal';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { BloodBankDashboardPage } from './pages/BloodBankDashboardPage';
import { DonorDashboardPage } from './pages/DonorDashboardPage';
import { DonorRegistrationPage } from './pages/DonorRegistrationPage';
import { EmergencySearchPage } from './pages/EmergencySearchPage';
import { LandingPage } from './pages/LandingPage';
import { RareBloodAwarenessPage } from './pages/RareBloodAwarenessPage';
import { RequestTrackingPage } from './pages/RequestTrackingPage';
import { store } from './services/store';
import { BloodGroupType, EmergencyRequest, UserRole } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [currentRole, setCurrentRole] = useState<UserRole>(store.getCurrentUser().role);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  // Search initial parameters passed during navigation
  const [searchParams, setSearchParams] = useState<{
    bloodGroup?: BloodGroupType;
    city?: string;
  }>({});

  // Tracking initial request ID
  const [trackingRequestId, setTrackingRequestId] = useState<string | undefined>();

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setCurrentRole(store.getCurrentUser().role);
    });
    return unsub;
  }, []);

  const handleNavigate = (tab: string, context?: any) => {
    if (tab === 'search' && context) {
      setSearchParams({
        bloodGroup: context.bloodGroup,
        city: context.city,
      });
    }
    if (tab === 'tracking' && context?.requestId) {
      setTrackingRequestId(context.requestId);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'DONOR') {
      setActiveTab('donor-dashboard');
    } else if (newRole === 'BLOOD_BANK') {
      setActiveTab('bb-dashboard');
    } else if (newRole === 'ADMIN') {
      setActiveTab('admin-dashboard');
    } else {
      setActiveTab('tracking');
    }
  };

  const handleRequestCreated = (created: EmergencyRequest) => {
    setTrackingRequestId(created.id);
    setActiveTab('tracking');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Prototype Demo Banner */}
      <DemoBanner
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onOpenDocs={() => setIsDocsOpen(true)}
      />

      {/* Primary Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewRequest={() => setIsNewRequestOpen(true)}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        currentRole={currentRole}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            onOpenNewRequest={() => setIsNewRequestOpen(true)}
          />
        )}

        {activeTab === 'search' && (
          <EmergencySearchPage
            initialBloodGroup={searchParams.bloodGroup}
            initialCity={searchParams.city}
            onNavigate={handleNavigate}
            onOpenNewRequest={() => setIsNewRequestOpen(true)}
          />
        )}

        {activeTab === 'tracking' && (
          <RequestTrackingPage
            initialRequestId={trackingRequestId}
            onNavigate={handleNavigate}
            onOpenNewRequest={() => setIsNewRequestOpen(true)}
          />
        )}

        {activeTab === 'awareness' && (
          <RareBloodAwarenessPage onNavigate={handleNavigate} />
        )}

        {activeTab === 'donor-register' && (
          <DonorRegistrationPage onNavigate={handleNavigate} />
        )}

        {activeTab === 'donor-dashboard' && (
          <DonorDashboardPage onNavigate={handleNavigate} />
        )}

        {activeTab === 'bb-dashboard' && (
          <BloodBankDashboardPage onNavigate={handleNavigate} />
        )}

        {activeTab === 'admin-dashboard' && (
          <AdminDashboardPage
            onOpenDocs={() => setIsDocsOpen(true)}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
      />

      {/* Modals */}
      <NewEmergencyRequestModal
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
        onRequestCreated={handleRequestCreated}
      />

      <MedicalDisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />

      <BackendDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />
    </div>
  );
}
