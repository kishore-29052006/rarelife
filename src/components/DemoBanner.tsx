import React from 'react';
import { UserRole } from '../types';
import { store } from '../services/store';

interface DemoBannerProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenDocs: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  currentRole,
  onRoleChange,
  onOpenDocs,
}) => {
  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'PATIENT', label: 'Patient / Caregiver', desc: 'Raise & track emergency requests' },
    { role: 'DONOR', label: 'Rare Donor', desc: 'Manage availability & respond to cases' },
    { role: 'BLOOD_BANK', label: 'Blood Bank / Depot', desc: 'Coordinate units & verify donors' },
    { role: 'ADMIN', label: 'Administrator', desc: 'Oversee registry & audit logs' },
  ];

  return (
    <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-rose-400 uppercase tracking-wider text-[11px] bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
            Prototype Demo Mode
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Demonstration data enabled. No real clinical records are stored.
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 text-[11px]">Active Role Perspective:</span>
          <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            {roles.map((r) => (
              <button
                key={r.role}
                onClick={() => {
                  store.switchRole(r.role);
                  onRoleChange(r.role);
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  currentRole === r.role
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
                title={r.desc}
              >
                {r.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              store.resetToDemoData();
              window.location.reload();
            }}
            className="px-2 py-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
            title="Reset all store records to initial demonstration state"
          >
            Reset Demo Data
          </button>

          <button
            onClick={onOpenDocs}
            className="px-2.5 py-1 text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 rounded border border-rose-800 font-medium transition-colors"
            title="View Spring Boot Backend Architecture & MySQL Schema"
          >
            Spring Boot Code & DB Docs
          </button>
        </div>
      </div>
    </div>
  );
};
