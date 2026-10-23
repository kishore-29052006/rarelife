import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle,
  Database,
  Droplet,
  FileCheck,
  FileText,
  Lock,
  RefreshCw,
  Server,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react';
import { AdminDashboardData, apiClient } from '../services/apiClient';
import { store } from '../services/store';
import { User, UserRole } from '../types';

interface AdminDashboardPageProps {
  onOpenDocs: () => void;
  onNavigate: (tab: string, context?: any) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onOpenDocs,
  onNavigate,
}) => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [users, setUsers] = useState<User[]>(store.getUsers());
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const result = await apiClient.getAdminDashboard();
    setData(result);
    setUsers(store.getUsers());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const unsub = store.subscribe(() => {
      loadData();
    });
    return unsub;
  }, []);

  const handleToggleUserStatus = (userId: string) => {
    const u = users.find((x) => x.id === userId);
    if (!u) return;
    u.accountStatus = u.accountStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setActionSuccess(`User ${u.fullName} status updated to ${u.accountStatus}.`);
    store.resetToDemoData; // trigger save
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
              National Registry Administration
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Demonstration Data
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            System Administration & Audit Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time aggregate database metrics, role permissions, and compliance audit trail
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDocs}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            Spring Boot / MySQL Specs
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Aggregate Metrics Grid */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider">
              Total Registered Donors
            </span>
            <span className="text-3xl font-bold font-mono text-slate-900">
              {data.metrics.totalDonors}
            </span>
            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <span className="text-emerald-600 font-semibold">
                {data.metrics.verifiedDonors} Verified
              </span>
              <span>&middot;</span>
              <span>{data.metrics.unverifiedDonors} Pending</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider">
              Active Emergency Cases
            </span>
            <span className="text-3xl font-bold font-mono text-rose-600">
              {data.metrics.activeRequests}
            </span>
            <span className="text-[11px] text-slate-500">
              {data.metrics.rareBloodRequests} Rare Phenotype Requisitions
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider">
              Escalated Cases
            </span>
            <span className="text-3xl font-bold font-mono text-purple-700">
              {data.metrics.escalatedCases}
            </span>
            <span className="text-[11px] text-slate-500">National Liaison Managed</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider">
              Fulfilled Transfusions
            </span>
            <span className="text-3xl font-bold font-mono text-emerald-600">
              {data.metrics.fulfilledCases}
            </span>
            <span className="text-[11px] text-slate-500">Successfully crossmatched</span>
          </div>
        </div>
      )}

      {/* Phenotype Distribution Breakdown */}
      {data && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Rare Phenotype Registry Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                Distribution of rare and ultra-rare blood phenotypes across active database donors
              </p>
            </div>
            <span className="font-mono text-slate-400 text-xs">
              {data.bloodBankNetworkCount} Partner Blood Centers
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
              <span className="text-rose-900 font-semibold block">Bombay Phenotype (Oh/hh)</span>
              <span className="text-2xl font-bold font-mono text-rose-700">
                {data.demographics.bombayDonors}
              </span>
              <span className="text-[10px] text-rose-600 block">Anti-H Secretor Negative</span>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <span className="text-amber-900 font-semibold block">Rh-null (Golden Blood)</span>
              <span className="text-2xl font-bold font-mono text-amber-700">
                {data.demographics.rhNullDonors}
              </span>
              <span className="text-[10px] text-amber-600 block">Lacks all 61 Rh antigens</span>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <span className="text-emerald-900 font-semibold block">Kell Negative (K-k+)</span>
              <span className="text-2xl font-bold font-mono text-emerald-700">
                {data.demographics.kellNegativeDonors}
              </span>
              <span className="text-[10px] text-emerald-600 block">Anti-Kell alloimmunity</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-slate-800 font-semibold block">Standard ABO/Rh Donors</span>
              <span className="text-2xl font-bold font-mono text-slate-900">
                {data.demographics.standardDonors}
              </span>
              <span className="text-[10px] text-slate-500 block">O-, A-, B-, AB- donors</span>
            </div>
          </div>
        </div>
      )}

      {/* User Management & RBAC */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">User Accounts & Roles</h3>
            <p className="text-xs text-slate-500">
              Role-based access control (Patients, Donors, Authorized Blood Banks, Administrators)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-[11px]">
                <th className="pb-2 font-semibold">User</th>
                <th className="pb-2 font-semibold">Email & Phone</th>
                <th className="pb-2 font-semibold">Role</th>
                <th className="pb-2 font-semibold">Account Status</th>
                <th className="pb-2 font-semibold text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="py-2.5 font-bold font-sans text-slate-900">{u.fullName}</td>
                  <td className="py-2.5 text-slate-600">
                    <div>{u.email}</div>
                    <div className="text-[10px] text-slate-400">{u.phone}</div>
                  </td>
                  <td className="py-2.5 font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        u.accountStatus === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {u.accountStatus}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-sans">
                    <button
                      onClick={() => handleToggleUserStatus(u.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                    >
                      {u.accountStatus === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance & Audit Logs */}
      {data && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs">
          <h3 className="text-base font-bold text-slate-900">
            System Compliance & Security Audit Trail
          </h3>
          <div className="divide-y divide-slate-100 font-mono text-[11px]">
            {data.recentActivity.map((act) => (
              <div key={act.id} className="py-2.5 flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 font-sans">{act.action}</span>
                  <p className="text-slate-600 font-sans">{act.details}</p>
                  <span className="text-[10px] text-slate-400">Actor: {act.actor}</span>
                </div>
                <span className="text-slate-400 text-[10px] shrink-0">
                  {new Date(act.time).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
