import React, { useState } from 'react';
import { Activity, Bell, Droplet, Menu, ShieldAlert, X } from 'lucide-react';
import { UserRole } from '../types';
import { store } from '../services/store';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewRequest: () => void;
  onOpenDisclaimer: () => void;
  currentRole: UserRole;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewRequest,
  onOpenDisclaimer,
  currentRole,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifications = store.getNotificationsForCurrentUser();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navLinks = [
    { id: 'landing', label: 'Overview' },
    { id: 'search', label: 'Emergency Search' },
    { id: 'tracking', label: 'Case Tracking' },
    { id: 'awareness', label: 'Rare Phenotypes' },
    {
      id:
        currentRole === 'DONOR'
          ? 'donor-dashboard'
          : currentRole === 'BLOOD_BANK'
          ? 'bb-dashboard'
          : currentRole === 'ADMIN'
          ? 'admin-dashboard'
          : 'donor-register',
      label:
        currentRole === 'DONOR'
          ? 'Donor Portal'
          : currentRole === 'BLOOD_BANK'
          ? 'Coordinator Depot'
          : currentRole === 'ADMIN'
          ? 'Admin Console'
          : 'Register as Donor',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Wordmark */}
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 text-left group whitespace-nowrap shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 text-white flex items-center justify-center shadow-sm shadow-rose-200 group-hover:scale-105 transition-transform">
              <Droplet className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                RareLife
                <span className="text-[10px] font-semibold text-rose-600 uppercase tracking-wider bg-rose-50 border border-rose-100 px-1.5 py-0.2 rounded">
                  Rare Match
                </span>
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 Clean Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                  activeTab === link.id
                    ? 'text-rose-600 font-semibold border-b-2 border-rose-600'
                    : 'hover:text-slate-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 Primary Action + Quick Utilities */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenDisclaimer}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              title="View Clinical Crossmatch Safety Guidelines"
            >
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span className="hidden xl:inline">Safety Protocol</span>
            </button>

            {unreadCount > 0 && (
              <button
                onClick={() => {
                  if (currentRole === 'DONOR') setActiveTab('donor-dashboard');
                  else if (currentRole === 'BLOOD_BANK') setActiveTab('bb-dashboard');
                  else if (currentRole === 'ADMIN') setActiveTab('admin-dashboard');
                  else setActiveTab('tracking');
                }}
                className="relative p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                title={`${unreadCount} unread emergency alerts`}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-600" />
              </button>
            )}

            <button
              onClick={onOpenNewRequest}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 rounded-xl hover:bg-rose-700 active:scale-95 transition-all shadow-sm shadow-rose-200 flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <Activity className="w-3.5 h-3.5" />
              Post Emergency Request
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenNewRequest}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 rounded-lg"
            >
              Emergency
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === link.id
                  ? 'bg-rose-50 text-rose-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenDisclaimer();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-amber-700 flex items-center gap-1.5 py-1"
            >
              <ShieldAlert className="w-4 h-4" />
              Safety & Crossmatch Notice
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
