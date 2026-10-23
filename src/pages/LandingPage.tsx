import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Award,
  Building2,
  CheckCircle,
  Clock,
  Compass,
  Droplet,
  FileCheck,
  Heart,
  Lock,
  MapPin,
  PhoneCall,
  Search,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { BloodGroupType, EmergencyRequest } from '../types';
import { store } from '../services/store';

interface LandingPageProps {
  onNavigate: (tab: string, context?: any) => void;
  onOpenNewRequest: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onOpenNewRequest,
}) => {
  const [quickBloodGroup, setQuickBloodGroup] = useState<BloodGroupType>('Bombay (Oh/hh)');
  const [quickCity, setQuickCity] = useState('Mumbai');

  const requests = store.getRequests();
  const activeRequests = requests.filter(
    (r) => r.requestStatus !== 'FULFILLED' && r.requestStatus !== 'CANCELLED'
  );
  const bloodBanks = store.getBloodBanks();

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('search', { bloodGroup: quickBloodGroup, city: quickCity });
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/60 via-white to-slate-50 border-b border-slate-200/80 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100/80 border border-rose-200 text-rose-800 rounded-full text-xs font-semibold">
                <Droplet className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                <span>Specialized Rare Blood & Phenotype Matching System</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                When Every Match Matters.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                An intelligent emergency donor discovery and multi-level escalation platform
                connecting hospitals, rare-blood coordinators, and verified donors. Specialized in
                ultra-rare phenotypes like <strong className="text-slate-900 font-semibold">Bombay phenotype (Oh/hh)</strong>,{' '}
                <strong className="text-slate-900 font-semibold">Rh-null</strong>, and specialized antigen requirements.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('search')}
                  className="px-6 py-3.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 active:scale-95 transition-all shadow-md shadow-rose-200 flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Find Blood Donors
                </button>
                <button
                  onClick={() => onNavigate('donor-register')}
                  className="px-6 py-3.5 bg-white border border-slate-300 text-slate-800 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Heart className="w-4 h-4 text-rose-600" />
                  Register as Rare Donor
                </button>
              </div>

              {/* Quick stats strip */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80">
                <div>
                  <span className="block text-2xl font-bold text-slate-900 font-mono">
                    {store.getDonors().filter((d) => d.isRareBlood).length}
                  </span>
                  <span className="text-xs text-slate-500">Rare Donors Enrolled</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-slate-900 font-mono">
                    {bloodBanks.length}
                  </span>
                  <span className="text-xs text-slate-500">Connected Blood Centers</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-emerald-600 font-mono">
                    100%
                  </span>
                  <span className="text-xs text-slate-500">Haversine Location Rank</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Quick Emergency Launcher Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-200/90 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Emergency Donor Search</h3>
                      <p className="text-[11px] text-slate-500">Instant prioritization & distance check</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                    Priority Dispatch
                  </span>
                </div>

                <form onSubmit={handleQuickSearch} className="mt-4 space-y-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Required Blood Group / Phenotype
                    </label>
                    <select
                      value={quickBloodGroup}
                      onChange={(e) => setQuickBloodGroup(e.target.value as BloodGroupType)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                    >
                      <optgroup label="Rare & Ultra-Rare Phenotypes">
                        <option value="Bombay (Oh/hh)">Bombay Phenotype (Oh/hh)</option>
                        <option value="Rh-null (Golden Blood)">Rh-null (Golden Blood)</option>
                        <option value="Kell Negative (K-k+)">Kell Negative (K-k+)</option>
                        <option value="Duffy Null (Fy(a-b-))">Duffy Null (Fy(a-b-))</option>
                      </optgroup>
                      <optgroup label="Standard Blood Groups">
                        <option value="O-">O Negative (O-)</option>
                        <option value="O+">O Positive (O+)</option>
                        <option value="A-">A Negative (A-)</option>
                        <option value="A+">A Positive (A+)</option>
                        <option value="B-">B Negative (B-)</option>
                        <option value="B+">B Positive (B+)</option>
                        <option value="AB-">AB Negative (AB-)</option>
                        <option value="AB+">AB Positive (AB+)</option>
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Hospital Location / City
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <select
                        value={quickCity}
                        onChange={(e) => setQuickCity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                      >
                        <option value="Mumbai">Mumbai (Maharashtra)</option>
                        <option value="Chennai">Chennai (Tamil Nadu)</option>
                        <option value="Bengaluru">Bengaluru (Karnataka)</option>
                        <option value="New Delhi">New Delhi (National Capital)</option>
                        <option value="Pune">Pune (Maharashtra)</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl text-rose-900 text-[11px] leading-relaxed flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>
                      For specialized phenotypes, distance is calculated via Haversine coordinates
                      and prioritized against authorized immunohematology verification.
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Scan Potential Donors Nearby
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={onOpenNewRequest}
                      className="text-slate-500 hover:text-slate-900 text-[11px] underline"
                    >
                      Need to register an active hospital ICU case? Raise Formal Requisition &rarr;
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Emergencies Ticker */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
              <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                Live Requisitions Under Emergency Discovery
              </h2>
            </div>
            <button
              onClick={() => onNavigate('tracking')}
              className="text-xs text-rose-600 font-semibold hover:text-rose-700 flex items-center gap-1"
            >
              View All Cases & Escalations
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeRequests.slice(0, 3).map((req) => (
              <div
                key={req.id}
                onClick={() => onNavigate('tracking', { requestId: req.id })}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-rose-300 hover:bg-rose-50/20 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {req.requestNumber}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      req.requestStatus === 'ESCALATED_TO_RARE_COORDINATOR'
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {req.requestStatus.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-rose-600" />
                  <span>{req.requiredBloodGroup}</span>
                  <span className="text-slate-400 font-normal">({req.unitsRequired} units)</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{req.hospitalName}</span>
                </div>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{req.city}</span>
                  <span className="text-rose-600 font-medium group-hover:underline">
                    Track Case &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded">
            Protocol & Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            How RareLife Solves Emergency Blood Discovery
          </h2>
          <p className="text-sm text-slate-600">
            Moving beyond static phone registries to active geolocation intelligence and rare donor
            coordination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-mono font-bold flex items-center justify-center">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Urgent Hospital Requisition</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Patient or clinician registers case with specific phenotype details, required units,
              deadline, and attending doctor verification.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white font-mono font-bold flex items-center justify-center">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Haversine Distance Prioritization</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The system calculates geodesic proximity using the Haversine formula, filtering by
              strict medical compatibility and 90-day donation cooldown.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-mono font-bold flex items-center justify-center">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Targeted Blood Bank Dispatch</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nearby verified donors and licensed blood banks receive immediate alerts without
              exposing private contact numbers to the public web.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-purple-700 text-white font-mono font-bold flex items-center justify-center">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Guided Regional Escalation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If local search yields 0 units, the system guides escalation: expanding radius,
              activating cryogenic rare depots, and alerting national liaisons.
            </p>
          </div>
        </div>
      </section>

      {/* Rare Blood Awareness Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-950 px-3 py-1 rounded border border-rose-800">
                Critical Transfusion Fact
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Why Standard O-Negative Blood Can Be Fatal to Bombay Phenotype Patients
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Most people assume O-negative is the universal donor blood. However, Bombay phenotype
                (Oh/hh) individuals completely lack the <strong className="text-rose-300 font-semibold">H antigen</strong> on their red
                cells. Because their bodies recognize H antigen as foreign, they produce potent,
                broad-thermal anti-H antibodies.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standard O-negative red cells are heavily loaded with H antigens. Transfusing
                O-negative blood into a Bombay phenotype recipient triggers acute intravascular
                hemolysis. They can only safely receive blood from another verified Bombay phenotype
                donor.
              </p>

              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => onNavigate('awareness')}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-2"
                >
                  Read Immunohematology Guide & References
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3 text-xs">
              <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px] pb-2 border-b border-slate-700">
                Rare Phenotypes Monitored
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Bombay Phenotype (Oh/hh)</span>
                  <span className="font-mono text-rose-400">Anti-H Active</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Rh-null (Golden Blood)</span>
                  <span className="font-mono text-amber-400">0 Rh Antigens</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Kell Negative (K-k+)</span>
                  <span className="font-mono text-emerald-400">Anti-Kell Prev.</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Duffy Null (Fy(a-b-))</span>
                  <span className="font-mono text-blue-400">Plasmodium / Anti-Fy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Privacy Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Protected Health Privacy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Donor phone numbers and exact coordinates are never exposed publicly. Direct contact
              happens solely through approved hospital channels or authenticated blood banks.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <FileCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Authorized Medical Review</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rare phenotype claims are verified against saliva secretor testing and certified
              laboratory reports by licensed transfusion specialists.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">No False Medical Claims</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              System match labels are transparently marked as prospective discovery matches. Final
              compatibility requires bedside crossmatching and clinical authorization.
            </p>
          </div>
        </div>
      </section>

      {/* Connected Blood Banks Network */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Connected Hospital Transfusion Centers & Cryo Depots
              </h3>
              <p className="text-xs text-slate-500">
                Authorized facilities equipped for rare blood storage, testing, and coordination
              </p>
            </div>
            <button
              onClick={() => onNavigate('bb-dashboard')}
              className="text-xs text-rose-600 font-semibold hover:text-rose-700"
            >
              Open Blood Bank Coordinator Portal &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bloodBanks.map((bb) => (
              <div
                key={bb.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 truncate">{bb.organizationName}</span>
                </div>
                <div className="text-slate-500 text-[11px] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {bb.city}, {bb.state}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  {bb.hasRareBloodDepot ? (
                    <span className="text-rose-600 font-semibold">Rare Cryo-Depot</span>
                  ) : (
                    <span className="text-slate-500">Licensed Center</span>
                  )}
                  <span className="font-mono text-slate-600">{bb.officialPhone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
