import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Compass,
  Droplet,
  FileText,
  MapPin,
  Phone,
  RefreshCw,
  Send,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { EmergencyRequest, TimelineEvent } from '../types';
import { store } from '../services/store';

interface RequestTrackingPageProps {
  initialRequestId?: string;
  onNavigate: (tab: string, context?: any) => void;
  onOpenNewRequest: () => void;
}

export const RequestTrackingPage: React.FC<RequestTrackingPageProps> = ({
  initialRequestId,
  onNavigate,
  onOpenNewRequest,
}) => {
  const [requests, setRequests] = useState<EmergencyRequest[]>(store.getRequests());
  const [selectedRequestId, setSelectedRequestId] = useState<string>(
    initialRequestId || requests[0]?.id || ''
  );
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [escalateReason, setEscalateReason] = useState(
    'Local radius search exhausted. Immediate rare cryo-depot mobilization required.'
  );
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Patient stabilized; units sourced locally.');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const selectedRequest = requests.find(
    (r) => r.id === selectedRequestId || r.requestNumber === selectedRequestId
  );

  const currentUser = store.getCurrentUser();

  const refreshData = () => {
    const all = store.getRequests();
    setRequests(all);
    if (selectedRequest) {
      setTimelineEvents(store.getTimelineForRequest(selectedRequest.id));
    }
  };

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      refreshData();
    });
    return unsubscribe;
  }, [selectedRequestId]);

  useEffect(() => {
    if (selectedRequest) {
      setTimelineEvents(store.getTimelineForRequest(selectedRequest.id));
    }
  }, [selectedRequestId, requests]);

  const handleEscalate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    store.escalateRequest(selectedRequest.id, escalateReason);
    setEscalateModalOpen(false);
    setActionMessage('Case has been escalated to National Rare Donor Coordinator.');
    setTimeout(() => setActionMessage(null), 5000);
  };

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    store.cancelRequest(selectedRequest.id, cancelReason);
    setCancelModalOpen(false);
    setActionMessage('Emergency requisition has been cancelled.');
    setTimeout(() => setActionMessage(null), 5000);
  };

  const handleFulfill = () => {
    if (!selectedRequest) return;
    store.fulfillRequest(
      selectedRequest.id,
      'Units safely crossmatched and delivered to ICU bedside.'
    );
    setActionMessage('Case marked as fulfilled by authorized coordinator.');
    setTimeout(() => setActionMessage(null), 5000);
  };

  const getStatusColor = (status: EmergencyRequest['requestStatus']) => {
    switch (status) {
      case 'ESCALATED_TO_RARE_COORDINATOR':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'POTENTIAL_DONOR_IDENTIFIED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SEARCHING_FOR_DONORS':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'FULFILLED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CANCELLED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-rose-100 text-rose-800 border-rose-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
            Emergency Tracking & Timeline Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Emergency Case Tracking & Escalation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Transparent event logs, donor confirmations, and multi-tier escalation tracking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewRequest}
            className="px-4 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition-colors shadow-sm"
          >
            New Requisition
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Case Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap">
          Active Cases:
        </span>
        {requests.map((req) => (
          <button
            key={req.id}
            onClick={() => setSelectedRequestId(req.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
              selectedRequest?.id === req.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="font-mono">{req.requestNumber}</span> &middot; {req.requiredBloodGroup}
          </button>
        ))}
      </div>

      {selectedRequest ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Case Details & Real-Time Event Timeline */}
          <div className="lg:col-span-8 space-y-6">
            {/* Case Summary Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-extrabold font-mono text-slate-900">
                      {selectedRequest.requestNumber}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${getStatusColor(
                        selectedRequest.requestStatus
                      )}`}
                    >
                      {selectedRequest.requestStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Logged: {new Date(selectedRequest.createdAt).toLocaleString()} by{' '}
                    {selectedRequest.requesterName}
                  </p>
                </div>

                {/* Urgency Pill */}
                <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl self-start sm:self-auto">
                  {selectedRequest.urgency.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Grid Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Required Blood Group</span>
                  <span className="font-bold text-slate-900 text-sm font-mono text-rose-600">
                    {selectedRequest.requiredBloodGroup}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Units & Component</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedRequest.unitsRequired} Units ({selectedRequest.componentType.replace(/_/g, ' ')})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Hospital Location</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedRequest.city}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Deadline</span>
                  <span className="font-mono text-slate-900 text-xs font-semibold">
                    {new Date(selectedRequest.requiredBy).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Hospital & Contact */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-900">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    {selectedRequest.hospitalName}
                  </span>
                  <span className="font-mono text-slate-600">{selectedRequest.hospitalContact}</span>
                </div>
                {selectedRequest.doctorInCharge && (
                  <div className="text-slate-500 text-[11px]">
                    Attending Physician: {selectedRequest.doctorInCharge}
                  </div>
                )}
                {selectedRequest.requiredPhenotypeDetails && (
                  <div className="text-rose-900 text-[11px] bg-rose-50/70 p-2 rounded border border-rose-100 mt-1">
                    <strong>Laboratory Diagnosis:</strong> {selectedRequest.requiredPhenotypeDetails}
                  </div>
                )}
              </div>

              {/* Coordination status strip */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
                <div className="flex items-center gap-4 text-slate-600">
                  <span>
                    Donors Screened: <strong className="font-mono text-slate-900">{selectedRequest.potentialDonorsFoundCount}</strong>
                  </span>
                  <span>
                    Responses: <strong className="font-mono text-emerald-600">{selectedRequest.responsesReceivedCount}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedRequest.requestStatus !== 'FULFILLED' &&
                    selectedRequest.requestStatus !== 'CANCELLED' && (
                      <>
                        <button
                          onClick={() => setEscalateModalOpen(true)}
                          className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-semibold transition-colors shadow-sm"
                        >
                          Escalate to Rare Coordinator
                        </button>

                        <button
                          onClick={handleFulfill}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                        >
                          Mark Fulfilled
                        </button>

                        <button
                          onClick={() => setCancelModalOpen(true)}
                          className="px-3 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                </div>
              </div>
            </div>

            {/* REAL-TIME EVENT-DRIVEN TIMELINE: Requirement C */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Application Event Timeline
                  </h3>
                  <p className="text-xs text-slate-500">
                    Generated from real application events, donor alerts, and clinical actions
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {timelineEvents.length} Recorded Events
                </span>
              </div>

              {timelineEvents.length > 0 ? (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {timelineEvents.map((event) => (
                    <div key={event.id} className="relative group text-xs space-y-1">
                      {/* Timeline dot */}
                      <span className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-rose-600" />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="font-bold text-slate-900 text-xs">{event.title}</span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-slate-600 leading-relaxed text-[11px]">
                        {event.description}
                      </p>

                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>Actor: {event.actor}</span>
                        <span>&middot;</span>
                        <span className="uppercase font-semibold">{event.actorRole}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No timeline events recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Coordination Depot & Donor Actions */}
          <div className="lg:col-span-4 space-y-6">
            {/* Assigned Coordinator Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs">
              <div className="flex items-center gap-2 text-rose-600 font-bold uppercase tracking-wider text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>Authorized Transfusion Depot</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                {selectedRequest.assignedCoordinatorName || 'Central Rare Blood Coordinator'}
              </h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Cases with rare phenotypes are overseen by specialized immunohematologists to
                validate crossmatches and coordinate cryogenic reserves.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Registry Status:</span>
                <span className="font-semibold text-emerald-700">Active Monitoring</span>
              </div>
            </div>

            {/* Quick Find Donors Link */}
            <div className="bg-rose-50/70 rounded-2xl p-5 border border-rose-200 space-y-3 text-xs text-rose-900">
              <div className="font-bold text-rose-950 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-rose-600" />
                <span>Need To Run Fresh Geolocation Scan?</span>
              </div>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                Scan registered donors within 250 km matching {selectedRequest.requiredBloodGroup}.
              </p>
              <button
                onClick={() =>
                  onNavigate('search', {
                    bloodGroup: selectedRequest.requiredBloodGroup,
                    city: selectedRequest.city,
                  })
                }
                className="w-full py-2 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-colors shadow-sm text-center block"
              >
                Scan Donors for This Requisition &rarr;
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500 text-xs">
          No emergency requisitions currently active.
        </div>
      )}

      {/* Escalation Modal */}
      {escalateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Escalate Case to Rare-Donor Coordinator
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Escalation mobilizes regional cryogenic stores, notifies accredited immunohematology
              liaisons, and broadens the donor search perimeter.
            </p>
            <form onSubmit={handleEscalate} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Reason for Escalation *
                </label>
                <textarea
                  rows={3}
                  required
                  value={escalateReason}
                  onChange={(e) => setEscalateReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEscalateModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-semibold"
                >
                  Confirm Escalation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 mb-1">Cancel Emergency Requisition</h3>
            <p className="text-xs text-slate-500 mb-4">
              Please specify the reason for cancelling this blood request.
            </p>
            <form onSubmit={handleCancel} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reason *</label>
                <input
                  type="text"
                  required
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
