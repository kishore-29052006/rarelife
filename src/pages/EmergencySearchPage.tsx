import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Compass,
  Droplet,
  Filter,
  Layers,
  MapPin,
  Phone,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { BloodBank, BloodGroupType, ComponentType, PrioritizedDonorResult } from '../types';
import { apiClient } from '../services/apiClient';
import { store } from '../services/store';

interface EmergencySearchPageProps {
  initialBloodGroup?: BloodGroupType;
  initialCity?: string;
  onNavigate: (tab: string, context?: any) => void;
  onOpenNewRequest: () => void;
}

const BLOOD_GROUPS: BloodGroupType[] = [
  'Bombay (Oh/hh)',
  'Rh-null (Golden Blood)',
  'Kell Negative (K-k+)',
  'Duffy Null (Fy(a-b-))',
  'O-',
  'O+',
  'A-',
  'A+',
  'B-',
  'B+',
  'AB-',
  'AB+',
  'Other Rare Phenotype',
];

const CITY_PRESETS = [
  { city: 'Mumbai', state: 'Maharashtra', district: 'Mumbai City', lat: 19.0028, lon: 72.8423 },
  { city: 'Chennai', state: 'Tamil Nadu', district: 'Chennai', lat: 13.0604, lon: 80.2496 },
  { city: 'Bengaluru', state: 'Karnataka', district: 'Bengaluru Urban', lat: 12.9592, lon: 77.6499 },
  { city: 'New Delhi', state: 'Delhi', district: 'New Delhi', lat: 28.6139, lon: 77.209 },
  { city: 'Pune', state: 'Maharashtra', district: 'Pune', lat: 18.5204, lon: 73.8567 },
];

export const EmergencySearchPage: React.FC<EmergencySearchPageProps> = ({
  initialBloodGroup = 'Bombay (Oh/hh)',
  initialCity = 'Mumbai',
  onNavigate,
  onOpenNewRequest,
}) => {
  const [bloodGroup, setBloodGroup] = useState<BloodGroupType>(initialBloodGroup);
  const [selectedCity, setSelectedCity] = useState(
    CITY_PRESETS.find((c) => c.city.toLowerCase() === initialCity.toLowerCase()) || CITY_PRESETS[0]
  );
  const [componentType, setComponentType] = useState<ComponentType>('PACKED_RED_CELLS');
  const [units, setUnits] = useState(2);
  const [radiusKm, setRadiusKm] = useState(150);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'score' | 'distance'>('score');

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PrioritizedDonorResult[]>([]);
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);
  const [nearbyBloodBanks, setNearbyBloodBanks] = useState<BloodBank[]>([]);

  const isRareGroup = [
    'Bombay (Oh/hh)',
    'Rh-null (Golden Blood)',
    'Kell Negative (K-k+)',
    'Duffy Null (Fy(a-b-))',
    'Other Rare Phenotype',
  ].includes(bloodGroup);

  const performSearch = async () => {
    setLoading(true);
    setContactSuccess(null);
    try {
      const data = await apiClient.searchDonors({
        bloodGroup,
        latitude: selectedCity.lat,
        longitude: selectedCity.lon,
        radiusKm,
      });

      let filtered = data;
      if (verifiedOnly) {
        filtered = filtered.filter(
          (r) => r.donor.verificationStatus === 'VERIFIED_BY_REVIEWER'
        );
      }

      if (sortBy === 'distance') {
        filtered.sort((a, b) => a.approximateDistanceKm - b.approximateDistanceKm);
      }

      setResults(filtered);

      // Find blood banks in this region
      const allBanks = store.getBloodBanks();
      setNearbyBloodBanks(allBanks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch();
  }, [bloodGroup, selectedCity, radiusKm, verifiedOnly, sortBy]);

  const handleContactDonor = (donorResult: PrioritizedDonorResult) => {
    const activeReq = store.getRequests().find((r) => r.requestStatus !== 'FULFILLED');
    const reqId = activeReq ? activeReq.id : 'req-001';

    // Simulate coordinator contact attempt
    store.addTimelineEvent(
      reqId,
      `Donor Inquiry Dispatched to ${donorResult.donor.fullName}`,
      `Clinical coordination request transmitted to donor for blood group ${donorResult.donor.bloodGroup}. Preferred contact: ${donorResult.donor.preferredContact}.`,
      store.getCurrentUser().fullName,
      store.getCurrentUser().role,
      'DONOR_NOTIFIED'
    );

    setContactSuccess(
      `Coordination alert sent to ${donorResult.donor.fullName} via ${
        donorResult.donor.preferredContact === 'THROUGH_BLOOD_BANK_ONLY'
          ? 'Authorized Blood Bank Liaison'
          : donorResult.donor.preferredContact
      }.`
    );

    setTimeout(() => setContactSuccess(null), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
              Module: Geolocation & Prioritization
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Emergency Rare Blood Donor Search
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Geodesic Haversine calculation, immunohematology cross-check, and 6-factor prioritization
          </p>
        </div>

        <button
          onClick={onOpenNewRequest}
          className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition-colors shadow-sm shadow-rose-200 self-start md:self-center"
        >
          Create Active Hospital Case
        </button>
      </div>

      {/* Critical Medical Disclaimer Banner */}
      <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block text-amber-950 mb-0.5">
            Medical Safety & Compatibility Notice:
          </strong>
          Never label a donor as medically compatible solely because the ABO/Rh blood groups appear
          compatible. Final compatibility and donor eligibility must be determined by qualified
          transfusion specialists and serological laboratory cross-matching. Distance is approximate
          and is not an estimate of delivery or travel time.
        </div>
      </div>

      {contactSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{contactSuccess}</span>
        </div>
      )}

      {/* Search Parameters Grid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Blood Group */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Required Blood Group / Phenotype *
            </label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value as BloodGroupType)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-rose-500"
            >
              <optgroup label="Rare & Ultra-Rare Phenotypes">
                <option value="Bombay (Oh/hh)">Bombay Phenotype (Oh/hh)</option>
                <option value="Rh-null (Golden Blood)">Rh-null (Golden Blood)</option>
                <option value="Kell Negative (K-k+)">Kell Negative (K-k+)</option>
                <option value="Duffy Null (Fy(a-b-))">Duffy Null (Fy(a-b-))</option>
              </optgroup>
              <optgroup label="Standard Groups">
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

          {/* Hospital Center City */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Hospital Center / Geolocation *
            </label>
            <select
              value={selectedCity.city}
              onChange={(e) => {
                const found = CITY_PRESETS.find((c) => c.city === e.target.value);
                if (found) setSelectedCity(found);
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-rose-500"
            >
              {CITY_PRESETS.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city}, {c.state} ({c.lat.toFixed(2)}, {c.lon.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Component */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Blood Component</label>
            <select
              value={componentType}
              onChange={(e) => setComponentType(e.target.value as ComponentType)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-rose-500"
            >
              <option value="PACKED_RED_CELLS">Packed Red Blood Cells (PRBC)</option>
              <option value="WHOLE_BLOOD">Whole Blood</option>
              <option value="PLATELETS">Platelets (RDP / SDP)</option>
              <option value="FRESH_FROZEN_PLASMA">Fresh Frozen Plasma</option>
              <option value="CRYOPRECIPITATE">Cryoprecipitate</option>
            </select>
          </div>

          {/* Units */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Units Required</label>
            <input
              type="number"
              min={1}
              max={10}
              value={units}
              onChange={(e) => setUnits(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Sliders and filters */}
        <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex-1 max-w-md space-y-1">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Haversine Search Radius:</span>
              <span className="font-mono text-slate-900 font-bold">{radiusKm} km</span>
            </div>
            <input
              type="range"
              min={25}
              max={500}
              step={25}
              value={radiusKm}
              onChange={(e) => setRadiusKm(parseInt(e.target.value))}
              className="w-full accent-rose-600"
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded border-slate-300"
              />
              <span>Verified Laboratory Reports Only</span>
            </label>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
              <span className="text-[11px] text-slate-500 px-1.5">Sort:</span>
              <button
                onClick={() => setSortBy('score')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                  sortBy === 'score' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Match Score
              </button>
              <button
                onClick={() => setSortBy('distance')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                  sortBy === 'distance' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Distance
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Intelligently Prioritized Donors ({results.length} Found)
          </h2>
          <p className="text-xs text-slate-500">
            Ranked by immunohematology compatibility, verification, availability recency, and geodesic
            distance
          </p>
        </div>
        {isRareGroup && (
          <span className="text-xs text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg font-semibold">
            Specialized Phenotype Requisition
          </span>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : results.length > 0 ? (
        /* Results Cards */
        <div className="space-y-4">
          {results.map((result) => {
            const isVerified = result.donor.verificationStatus === 'VERIFIED_BY_REVIEWER';
            const isAvailable = result.donor.availabilityStatus === 'AVAILABLE_NOW';

            return (
              <div
                key={result.donor.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition-all text-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-mono font-bold flex items-center justify-center shrink-0">
                      #{result.rank}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">
                          {result.donor.fullName}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          ({result.donor.city}, {result.donor.state})
                        </span>
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            <ShieldCheck className="w-3 h-3" />
                            Blood Group Verified
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                            Verification Pending
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-slate-600 flex-wrap">
                        <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 font-mono">
                          {result.donor.bloodGroup}
                        </span>
                        <span>&middot;</span>
                        <span className="font-mono text-slate-900 font-bold">
                          ~{result.approximateDistanceKm} km away
                        </span>
                        <span>&middot;</span>
                        <span className="text-slate-500">
                          {result.donor.totalDonationsCount} prior donations
                        </span>
                      </div>

                      {result.donor.rarePhenotypeDetails && (
                        <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <strong className="text-slate-900">Phenotype Note:</strong>{' '}
                          {result.donor.rarePhenotypeDetails}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div className="text-right shrink-0">
                    <div className="inline-block bg-slate-900 text-white px-3 py-1.5 rounded-xl text-center">
                      <span className="block text-base font-extrabold font-mono leading-none">
                        {result.matchScore}/100
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-rose-400 font-semibold">
                        Prioritization Index
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <div>
                    <span className="block text-slate-400">Compatibility</span>
                    <span className="font-mono text-slate-900 font-semibold">
                      {result.breakdown.bloodMatchScore}%
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-400">Verification</span>
                    <span className="font-mono text-slate-900 font-semibold">
                      {result.breakdown.verificationScore}%
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-400">Availability</span>
                    <span className="font-mono text-slate-900 font-semibold">
                      {result.breakdown.availabilityScore}%
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-400">Proximity</span>
                    <span className="font-mono text-slate-900 font-semibold">
                      {result.breakdown.distanceScore}%
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="block text-slate-400">Eligibility</span>
                    <span className="font-mono text-emerald-600 font-semibold">
                      {result.breakdown.eligibilityScore}%
                    </span>
                  </div>
                </div>

                {/* Eligibility and action footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-600">
                    <span className="font-medium text-slate-900">Status: </span>
                    <span
                      className={
                        isAvailable
                          ? 'text-emerald-700 font-semibold'
                          : 'text-amber-700 font-semibold'
                      }
                    >
                      {result.donor.availabilityStatus.replace(/_/g, ' ')}
                    </span>{' '}
                    &middot; {result.eligibilityMessage}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleContactDonor(result)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Request via Blood Bank
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State & Escalation System: CRITICAL FEATURE */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-6 shadow-sm">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
            <Compass className="w-7 h-7" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-xl font-bold text-slate-900">
              No Potential Donors Found Within {radiusKm} km
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rare blood phenotypes (such as Bombay phenotype or Rh-null) are exceptionally
              uncommon in local registries. Do not abandon the search—the guided escalation workflow
              is designed to mobilize regional reserves and rare-donor coordinators.
            </p>
          </div>

          {/* Guided Escalation Step-by-Step UI */}
          <div className="max-w-2xl mx-auto text-left bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Emergency Escalation Next Steps:
            </h4>

            <div className="space-y-3 text-xs">
              {/* Step 1: Expand Radius */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">
                    1. Expand Geolocation Perimeter
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Widen search radius to 250 km or 500 km across state boundaries.
                  </span>
                </div>
                <button
                  onClick={() => setRadiusKm(500)}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors shrink-0"
                >
                  Expand to 500 km
                </button>
              </div>

              {/* Step 2: Registered Blood Banks */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">
                    2. Check Hospital Cryo-Depots
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Directly query authorized rare phenotype blood centers (e.g. KEM Mumbai, Apollo
                    Chennai).
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('bb-dashboard')}
                  className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-semibold hover:bg-rose-100 transition-colors shrink-0"
                >
                  View Cryo Depots
                </button>
              </div>

              {/* Step 3: Formal Escalation */}
              <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="font-bold text-rose-950 block">
                    3. Escalate to Rare-Donor Coordinator
                  </span>
                  <span className="text-rose-800 text-[11px]">
                    Register a formal emergency case and alert the National Transfusion Registry
                    officer.
                  </span>
                </div>
                <button
                  onClick={onOpenNewRequest}
                  className="px-3 py-1.5 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors shrink-0 shadow-sm"
                >
                  Escalate Case Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regional Blood Banks Reference */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">
          Registered Blood Banks In Search Vicinity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {nearbyBloodBanks.slice(0, 4).map((bb) => (
            <div
              key={bb.id}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900">{bb.organizationName}</span>
                {bb.hasRareBloodDepot && (
                  <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                    Rare Depot
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">{bb.address}</p>
              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-600">
                <span>Phone: {bb.officialPhone}</span>
                <span>{bb.operatingHours}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
