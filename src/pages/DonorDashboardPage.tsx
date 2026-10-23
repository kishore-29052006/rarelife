import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Award,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Compass,
  Droplet,
  Heart,
  History,
  Lock,
  MapPin,
  Phone,
  Power,
  ShieldCheck,
  User,
  XCircle,
} from 'lucide-react';
import {
  AvailabilityStatus,
  ContactPreference,
  DonationHistoryItem,
  DonorProfile,
  EmergencyRequest,
} from '../types';
import { store } from '../services/store';

interface DonorDashboardPageProps {
  onNavigate: (tab: string, context?: any) => void;
}

export const DonorDashboardPage: React.FC<DonorDashboardPageProps> = ({ onNavigate }) => {
  const [currentUser, setCurrentUser] = useState(store.getCurrentUser());
  const [donorProfile, setDonorProfile] = useState<DonorProfile | undefined>(
    store.getCurrentDonorProfile() || store.getDonors()[0]
  );
  const [donationHistory, setDonationHistory] = useState<DonationHistoryItem[]>([]);
  const [activeRequests, setActiveRequests] = useState<EmergencyRequest[]>([]);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [newDonationBank, setNewDonationBank] = useState('KEM Hospital Blood Center');
  const [newDonationDate, setNewDonationDate] = useState('2026-10-10');

  const refreshData = () => {
    setCurrentUser(store.getCurrentUser());
    const profile = store.getCurrentDonorProfile() || store.getDonors()[0];
    setDonorProfile(profile);
    if (profile) {
      setDonationHistory(store.getDonationHistoryForDonor(profile.id));
      // Incoming requests matching donor blood group
      const allReqs = store.getRequests();
      const relevant = allReqs.filter(
        (r) =>
          r.requestStatus !== 'CANCELLED' &&
          (r.requiredBloodGroup === profile.bloodGroup ||
            (profile.bloodGroup === 'O-' && !r.isRarePhenotypeCase))
      );
      setActiveRequests(relevant);
    }
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = store.subscribe(() => {
      refreshData();
    });
    return unsubscribe;
  }, []);

  const handleAvailabilityChange = (newStatus: AvailabilityStatus) => {
    if (!donorProfile) return;
    store.updateDonorAvailability(donorProfile.id, newStatus);
    setActionSuccess(`Availability status updated to ${newStatus.replace(/_/g, ' ')}.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleResponse = (requestId: string, response: 'ACCEPTED' | 'DECLINED') => {
    if (!donorProfile) return;
    store.respondToDonorMatch(
      requestId,
      donorProfile.id,
      response,
      response === 'ACCEPTED'
        ? 'Confirmed availability. Can report to hospital blood center within 2 hours.'
        : 'Currently unable to report to blood center.'
    );
    setActionSuccess(`Response recorded: ${response}. Case updated in real-time.`);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  const handleAddDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorProfile) return;
    store.addDonationRecord({
      donorId: donorProfile.id,
      donationDate: newDonationDate,
      bloodBankName: newDonationBank,
      componentType: 'PACKED_RED_CELLS',
      unitsDonated: 1,
      verificationStatus: 'CONFIRMED_BY_BLOOD_BANK',
      notes: 'Recorded at donor portal.',
    });
    setShowDonationModal(false);
    setActionSuccess('New blood donation record successfully logged.');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleToggleConsent = () => {
    if (!donorProfile) return;
    donorProfile.contactConsent = !donorProfile.contactConsent;
    setActionSuccess(
      donorProfile.contactConsent
        ? 'Contact consent active. You will receive emergency alerts.'
        : 'Contact consent withdrawn. You will not receive emergency alerts.'
    );
    setTimeout(() => setActionSuccess(null), 4000);
  };

  if (!donorProfile) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">No Donor Profile Associated</h2>
        <p className="text-xs text-slate-500">
          Switch to a donor account in the banner or register your blood group.
        </p>
        <button
          onClick={() => onNavigate('donor-register')}
          className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold"
        >
          Create Donor Profile
        </button>
      </div>
    );
  }

  const isVerified = donorProfile.verificationStatus === 'VERIFIED_BY_REVIEWER';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
            Donor Portal & Health Profile
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Welcome, {donorProfile.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your emergency availability status, incoming requisitions, and donation history
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDonationModal(true)}
            className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            Log New Donation
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Blood group indicator */}
          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Enrolled Blood Group
            </span>
            <div className="text-2xl font-extrabold font-mono text-rose-900">
              {donorProfile.bloodGroup}
            </div>
            {donorProfile.isRareBlood && (
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200">
                Rare Phenotype
              </span>
            )}
          </div>

          {/* Verification Badge */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
            <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider">
              Laboratory Verification
            </span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
              {isVerified ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Verified by Reviewer</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-amber-700">Pending Review</span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {donorProfile.verifiedBy || 'Awaiting authorized clinical check'}
            </p>
          </div>

          {/* Availability Status & Fast Toggle */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                Emergency Availability Status
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Last updated:{' '}
                {new Date(donorProfile.lastAvailabilityConfirmedAt).toLocaleTimeString()}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleAvailabilityChange('AVAILABLE_NOW')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors text-xs ${
                  donorProfile.availabilityStatus === 'AVAILABLE_NOW'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Available Now
              </button>

              <button
                onClick={() => handleAvailabilityChange('BUSY_TEMPORARY')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors text-xs ${
                  donorProfile.availabilityStatus === 'BUSY_TEMPORARY'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Busy Temporary
              </button>

              <button
                onClick={() => handleAvailabilityChange('UNAVAILABLE')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors text-xs ${
                  donorProfile.availabilityStatus === 'UNAVAILABLE'
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Unavailable
              </button>
            </div>
          </div>
        </div>

        {/* Phenotype details if any */}
        {donorProfile.rarePhenotypeDetails && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
            <strong className="text-slate-900">Phenotype Details on Record:</strong>
            <p className="text-[11px] text-slate-600">{donorProfile.rarePhenotypeDetails}</p>
          </div>
        )}
      </div>

      {/* Incoming Emergency Requisitions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Incoming Emergency Requisitions Matching Your Blood Group
            </h3>
            <p className="text-xs text-slate-500">
              Hospitals and caregivers requesting {donorProfile.bloodGroup} in your regional network
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {activeRequests.length} Active Cases
          </span>
        </div>

        {activeRequests.length > 0 ? (
          <div className="space-y-3">
            {activeRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {req.requestNumber}
                    </span>
                    <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                      {req.requiredBloodGroup} ({req.unitsRequired} Units)
                    </span>
                    <span className="text-slate-400 text-[11px]">&middot; {req.city}</span>
                  </div>

                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                    Needed by {new Date(req.requiredBy).toLocaleTimeString()}
                  </span>
                </div>

                <div className="text-slate-600 text-[11px] space-y-1">
                  <div>
                    <strong className="text-slate-900">Hospital:</strong> {req.hospitalName} &middot;{' '}
                    <span className="font-mono text-slate-700">{req.hospitalContact}</span>
                  </div>
                  {req.notes && (
                    <div className="text-slate-500 italic">Notes: {req.notes}</div>
                  )}
                </div>

                {/* Respond Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    onClick={() => handleResponse(req.id, 'DECLINED')}
                    className="px-3 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Decline (Unavailable)
                  </button>
                  <button
                    onClick={() => handleResponse(req.id, 'ACCEPTED')}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Accept & Confirm Readiness
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-400 text-xs">
            No active emergency requisitions currently waiting for your blood group.
          </div>
        )}
      </div>

      {/* Donation History Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Donation History & Interval</h3>
            <p className="text-xs text-slate-500">
              Verified records calculate your safety cooldown interval (minimum 90 days)
            </p>
          </div>
          <button
            onClick={() => setShowDonationModal(true)}
            className="text-xs text-rose-600 font-semibold hover:text-rose-700"
          >
            + Add Historical Record
          </button>
        </div>

        {donationHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[11px]">
                  <th className="pb-2 font-semibold">Donation Date</th>
                  <th className="pb-2 font-semibold">Blood Bank / Facility</th>
                  <th className="pb-2 font-semibold">Component</th>
                  <th className="pb-2 font-semibold">Units</th>
                  <th className="pb-2 font-semibold">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {donationHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-2.5 font-bold text-slate-900">{item.donationDate}</td>
                    <td className="py-2.5 font-sans text-slate-800">{item.bloodBankName}</td>
                    <td className="py-2.5 font-sans text-slate-600">
                      {item.componentType.replace(/_/g, ' ')}
                    </td>
                    <td className="py-2.5 text-slate-900">{item.unitsDonated} Unit</td>
                    <td className="py-2.5 font-sans">
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-semibold">
                        Confirmed by Blood Bank
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 text-xs">
            No previous donations recorded on your profile.
          </div>
        )}
      </div>

      {/* Privacy & Consent Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs">
        <h3 className="text-base font-bold text-slate-900">Privacy & Consent Controls</h3>
        <p className="text-slate-600 leading-relaxed text-[11px]">
          You have full control over your emergency availability and participation. Your phone
          number is strictly masked and only revealed to certified hospital coordinators during an
          authorized transfusion requisition.
        </p>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <div>
            <span className="font-semibold text-slate-900 block">
              Emergency Requisition Contact Consent
            </span>
            <span className="text-slate-500 text-[11px]">
              Currently: {donorProfile.contactConsent ? 'Consent Granted' : 'Consent Withdrawn'}
            </span>
          </div>
          <button
            onClick={handleToggleConsent}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              donorProfile.contactConsent
                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {donorProfile.contactConsent ? 'Withdraw Contact Consent' : 'Reactivate Consent'}
          </button>
        </div>
      </div>

      {/* Add Donation Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 mb-1">Log Past Blood Donation</h3>
            <p className="text-xs text-slate-500 mb-4">
              Keeping your donation log updated ensures the system calculates your 90-day safe
              cooldown interval accurately.
            </p>
            <form onSubmit={handleAddDonation} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Donation Date *</label>
                <input
                  type="date"
                  required
                  value={newDonationDate}
                  onChange={(e) => setNewDonationDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Blood Bank / Hospital Name *
                </label>
                <input
                  type="text"
                  required
                  value={newDonationBank}
                  onChange={(e) => setNewDonationBank(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDonationModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
