import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  CheckCircle,
  Clock,
  Compass,
  Database,
  Droplet,
  FileCheck,
  FileText,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  XCircle,
} from 'lucide-react';
import {
  BloodBank,
  DonorProfile,
  EmergencyRequest,
  RequestStatus,
  VerificationStatus,
} from '../types';
import { store } from '../services/store';

interface BloodBankDashboardPageProps {
  onNavigate: (tab: string, context?: any) => void;
}

export const BloodBankDashboardPage: React.FC<BloodBankDashboardPageProps> = ({ onNavigate }) => {
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>(store.getBloodBanks());
  const [selectedBankId, setSelectedBankId] = useState<string>(bloodBanks[0]?.id || '');
  const [requests, setRequests] = useState<EmergencyRequest[]>(store.getRequests());
  const [donors, setDonors] = useState<DonorProfile[]>(store.getDonors());
  const [activeTab, setActiveTab] = useState<'requests' | 'verification' | 'inventory' | 'audit'>('requests');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const selectedBank = bloodBanks.find((b) => b.id === selectedBankId) || bloodBanks[0];

  const refreshData = () => {
    setBloodBanks(store.getBloodBanks());
    setRequests(store.getRequests());
    setDonors(store.getDonors());
  };

  useEffect(() => {
    const unsub = store.subscribe(() => {
      refreshData();
    });
    return unsub;
  }, []);

  const pendingDonors = donors.filter(
    (d) => d.verificationStatus === 'VERIFICATION_PENDING' || d.verificationStatus === 'UNVERIFIED'
  );

  const rareRequests = requests.filter((r) => r.isRarePhenotypeCase);

  const handleVerifyDonor = (donorId: string, status: VerificationStatus) => {
    const reviewer = selectedBank
      ? `${selectedBank.authorizedContact} (${selectedBank.organizationName})`
      : 'Authorized Blood Bank Reviewer';

    store.updateDonorVerification(donorId, status, reviewer);
    setActionSuccess(`Donor record updated to ${status.replace(/_/g, ' ')} by ${reviewer}.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleUpdateCaseStatus = (requestId: string, status: RequestStatus) => {
    store.updateRequestStatus(
      requestId,
      status,
      `Status updated by ${selectedBank.organizationName}`
    );
    setActionSuccess(`Case status shifted to ${status.replace(/_/g, ' ')}.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
            Immunohematology & Transfusion Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Blood Bank & Rare-Donor Coordinator Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Authorized case coordination, laboratory verification queue, and cryo-depot inventory
          </p>
        </div>

        {/* Blood Bank Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Active Depot:</span>
          <select
            value={selectedBankId}
            onChange={(e) => setSelectedBankId(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-rose-500"
          >
            {bloodBanks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.organizationName} ({b.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider">
            Active Requisitions
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900">
            {requests.filter((r) => r.requestStatus !== 'FULFILLED' && r.requestStatus !== 'CANCELLED').length}
          </span>
          <span className="text-[11px] text-slate-500">Under active monitoring</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider">
            Rare Phenotype Cases
          </span>
          <span className="text-2xl font-bold font-mono text-rose-600">
            {rareRequests.length}
          </span>
          <span className="text-[11px] text-slate-500">Bombay Oh/hh & Rh-null</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider">
            Verification Queue
          </span>
          <span className="text-2xl font-bold font-mono text-amber-600">
            {pendingDonors.length}
          </span>
          <span className="text-[11px] text-slate-500">Laboratory reports awaiting check</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider">
            Depot Cryo-Reserve
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-600">
            {selectedBank?.stockSummary['Bombay (Oh/hh)'] || 0} Oh Units
          </span>
          <span className="text-[11px] text-slate-500">{selectedBank?.organizationName}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-3 border-b-2 transition-colors ${
            activeTab === 'requests'
              ? 'border-rose-600 text-rose-600 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Active Requisitions & Rare Cases ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('verification')}
          className={`pb-3 px-3 border-b-2 transition-colors ${
            activeTab === 'verification'
              ? 'border-rose-600 text-rose-600 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Donor Verification Queue ({pendingDonors.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-3 border-b-2 transition-colors ${
            activeTab === 'inventory'
              ? 'border-rose-600 text-rose-600 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Cryo Depot Inventory
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-3 border-b-2 transition-colors ${
            activeTab === 'audit'
              ? 'border-rose-600 text-rose-600 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Audit History
        </button>
      </div>

      {/* Tab 1: Requests & Rare Cases */}
      {activeTab === 'requests' && (
        <div className="space-y-4 text-xs">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {req.requestNumber}
                  </span>
                  <span className="font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-100">
                    {req.requiredBloodGroup} ({req.unitsRequired} Units)
                  </span>
                  {req.isRarePhenotypeCase && (
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 uppercase">
                      Rare Phenotype Case
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded">
                  Status: {req.requestStatus.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
                <div>
                  <strong className="text-slate-900">Hospital:</strong> {req.hospitalName} ({req.city})
                </div>
                <div>
                  <strong className="text-slate-900">Hospital Contact:</strong> {req.hospitalContact}
                </div>
                <div>
                  <strong className="text-slate-900">Deadline:</strong>{' '}
                  {new Date(req.requiredBy).toLocaleString()}
                </div>
              </div>

              {req.requiredPhenotypeDetails && (
                <div className="p-2 bg-slate-50 rounded-lg text-[11px] text-slate-700 border border-slate-100">
                  <strong className="text-slate-900">Clinical Spec:</strong>{' '}
                  {req.requiredPhenotypeDetails}
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500">
                  Assigned Coordinator: {req.assignedCoordinatorName || selectedBank.authorizedContact}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('tracking', { requestId: req.id })}
                    className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                  >
                    View Timeline
                  </button>

                  {req.requestStatus !== 'FULFILLED' && req.requestStatus !== 'CANCELLED' && (
                    <>
                      <button
                        onClick={() =>
                          handleUpdateCaseStatus(req.id, 'POTENTIAL_DONOR_IDENTIFIED')
                        }
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                      >
                        Assign Donor
                      </button>

                      <button
                        onClick={() => handleUpdateCaseStatus(req.id, 'FULFILLED')}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                      >
                        Record Fulfillment
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Donor Verification Queue */}
      {activeTab === 'verification' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Authorized Laboratory Verification Protocol
              </h3>
              <p className="text-slate-500 text-[11px]">
                Only authorized transfusion officers can confirm Bombay phenotype (Oh/hh), Rh-null,
                and antigen profiles against verified laboratory immunohematology reports.
              </p>
            </div>
          </div>

          {pendingDonors.length > 0 ? (
            pendingDonors.map((donor) => (
              <div
                key={donor.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 text-sm">{donor.fullName}</span>
                    <div className="text-slate-500 text-[11px]">
                      {donor.city}, {donor.state} &middot; Contact: {donor.phone} &middot; Preferred:{' '}
                      {donor.preferredContact}
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100 self-start sm:self-auto">
                    {donor.bloodGroup}
                  </span>
                </div>

                {donor.rarePhenotypeDetails && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
                    <strong className="text-slate-900">Submitted Phenotype Description:</strong>{' '}
                    {donor.rarePhenotypeDetails}
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>
                      Laboratory Report:{' '}
                      <strong className="text-slate-800">
                        {donor.labReportFileName || 'No report attached (Self-reported)'}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVerifyDonor(donor.id, 'UNVERIFIED')}
                      className="px-3 py-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg font-semibold"
                    >
                      Reject Verification
                    </button>
                    <button
                      onClick={() => handleVerifyDonor(donor.id, 'VERIFIED_BY_REVIEWER')}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Approve & Verify Phenotype
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-400 text-xs">
              All registered donor submissions are currently reviewed and verified.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Inventory */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Blood Depository Reserves — {selectedBank.organizationName}
              </h3>
              <p className="text-xs text-slate-500">
                Units stored in cryopreservation (-80&deg;C) or active red cell liquid inventory
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(selectedBank.stockSummary).map(([group, count]) => (
              <div
                key={group}
                className={`p-4 rounded-xl border space-y-1 ${
                  group.includes('Bombay') || group.includes('Rh-null') || group.includes('Kell')
                    ? 'bg-rose-50 border-rose-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="font-semibold text-slate-700 block truncate">{group}</span>
                <span className="text-2xl font-bold font-mono text-slate-900">{count} Units</span>
                <span className="text-[10px] text-slate-500 block">
                  {group.includes('Bombay') ? 'Cryopreserved Depot' : 'Liquid PRBC Reserve'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Audit History */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs">
          <h3 className="text-base font-bold text-slate-900">Transfusion Coordination Audit Log</h3>
          <div className="divide-y divide-slate-100 font-mono text-[11px]">
            {store
              .getAuditLogs()
              .slice(0, 8)
              .map((log) => (
                <div key={log.id} className="py-2.5 flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 font-sans">{log.action.replace(/_/g, ' ')}</span>
                    <p className="text-slate-500 font-sans">{log.details}</p>
                    <span className="text-[10px] text-slate-400">Actor: {log.actorName}</span>
                  </div>
                  <span className="text-slate-400 text-[10px] shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
