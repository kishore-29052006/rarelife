import React, { useState } from 'react';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Droplet,
  MapPin,
  ShieldAlert,
  UserCheck,
  X,
} from 'lucide-react';
import { BloodGroupType, ComponentType, EmergencyRequest, UrgencyLevel } from '../types';
import { store } from '../services/store';

interface NewEmergencyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestCreated: (request: EmergencyRequest) => void;
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

const COMPONENTS: { value: ComponentType; label: string }[] = [
  { value: 'PACKED_RED_CELLS', label: 'Packed Red Blood Cells (PRBC)' },
  { value: 'WHOLE_BLOOD', label: 'Whole Blood' },
  { value: 'PLATELETS', label: 'Platelets (Single Donor / RDP)' },
  { value: 'FRESH_FROZEN_PLASMA', label: 'Fresh Frozen Plasma (FFP)' },
  { value: 'CRYOPRECIPITATE', label: 'Cryoprecipitate' },
];

const CITY_PRESETS = [
  { city: 'Mumbai', state: 'Maharashtra', district: 'Mumbai City', lat: 19.0028, lon: 72.8423 },
  { city: 'Chennai', state: 'Tamil Nadu', district: 'Chennai', lat: 13.0604, lon: 80.2496 },
  { city: 'Bengaluru', state: 'Karnataka', district: 'Bengaluru Urban', lat: 12.9592, lon: 77.6499 },
  { city: 'New Delhi', state: 'Delhi', district: 'New Delhi', lat: 28.6139, lon: 77.209 },
  { city: 'Pune', state: 'Maharashtra', district: 'Pune', lat: 18.5204, lon: 73.8567 },
];

export const NewEmergencyRequestModal: React.FC<NewEmergencyRequestModalProps> = ({
  isOpen,
  onClose,
  onRequestCreated,
}) => {
  const [bloodGroup, setBloodGroup] = useState<BloodGroupType>('Bombay (Oh/hh)');
  const [phenotypeDetails, setPhenotypeDetails] = useState('');
  const [componentType, setComponentType] = useState<ComponentType>('PACKED_RED_CELLS');
  const [units, setUnits] = useState(2);
  const [urgency, setUrgency] = useState<UrgencyLevel>('CRITICAL_IMMEDIATE');
  const [hospitalName, setHospitalName] = useState('Tata Memorial Hospital / KEM Advanced Center');
  const [hospitalContact, setHospitalContact] = useState('+91 22 2417 7000 (ICU Station)');
  const [doctorInCharge, setDoctorInCharge] = useState('Dr. S. K. Mehta');
  const [patientAge, setPatientAge] = useState<number>(34);
  const [patientGender, setPatientGender] = useState('Female');
  const [selectedCity, setSelectedCity] = useState(CITY_PRESETS[0]);
  const [requiredByHours, setRequiredByHours] = useState(6);
  const [medicallyConfirmed, setMedicallyConfirmed] = useState(true);
  const [notes, setNotes] = useState('Emergency requisition. Antibody screen reveals anti-H.');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalName.trim() || !hospitalContact.trim()) {
      setError('Hospital name and contact details are mandatory.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const currentUser = store.getCurrentUser();
    const requiredDate = new Date(Date.now() + requiredByHours * 3600 * 1000).toISOString();
    const isRare = [
      'Bombay (Oh/hh)',
      'Rh-null (Golden Blood)',
      'Kell Negative (K-k+)',
      'Duffy Null (Fy(a-b-))',
      'Other Rare Phenotype',
    ].includes(bloodGroup);

    try {
      const created = store.createEmergencyRequest({
        requesterId: currentUser.id,
        requesterName: currentUser.fullName,
        requesterPhone: currentUser.phone,
        requesterRole: currentUser.role === 'HOSPITAL' ? 'HOSPITAL' : 'PATIENT',
        hospitalName,
        hospitalContact,
        doctorInCharge,
        patientAge,
        patientGender,
        requiredBloodGroup: bloodGroup,
        requiredPhenotypeDetails: phenotypeDetails || (isRare ? `Requisition for ${bloodGroup}` : undefined),
        isRarePhenotypeCase: isRare,
        componentType,
        unitsRequired: units,
        city: selectedCity.city,
        district: selectedCity.district,
        state: selectedCity.state,
        latitude: selectedCity.lat,
        longitude: selectedCity.lon,
        requiredBy: requiredDate,
        urgency,
        medicalConfirmationStatus: medicallyConfirmed
          ? 'VERIFIED_BY_HOSPITAL'
          : 'PENDING_CONFIRMATION',
        requestStatus: 'SEARCHING_FOR_DONORS',
        notes,
      });

      setSubmitting(false);
      onRequestCreated(created);
      onClose();
    } catch {
      setError('Failed to create emergency request. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 shrink-0">
              <Droplet className="w-5 h-5 fill-rose-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Raise Emergency Blood Requisition
              </h3>
              <p className="text-xs text-slate-500">
                Immediate donor discovery & rare phenotype escalation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Blood Group & Units */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700 flex items-center justify-between">
                <span>Required Blood Group / Phenotype *</span>
                {bloodGroup.includes('Bombay') && (
                  <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider bg-rose-50 px-1.5 py-0.5 rounded">
                    Ultra-Rare (Oh/hh)
                  </span>
                )}
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroupType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Units Required *</label>
              <input
                type="number"
                min={1}
                max={10}
                value={units}
                onChange={(e) => setUnits(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
              />
            </div>
          </div>

          {/* Component & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Component Needed *</label>
              <select
                value={componentType}
                onChange={(e) => setComponentType(e.target.value as ComponentType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {COMPONENTS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Emergency Urgency *</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
              >
                <option value="CRITICAL_IMMEDIATE">Critical: Immediate (within 2 hours)</option>
                <option value="HIGH_WITHIN_6HRS">High: Needed within 6 hours</option>
                <option value="MODERATE_WITHIN_24HRS">Moderate: Needed within 24 hours</option>
              </select>
            </div>
          </div>

          {/* Rare Phenotype Note */}
          {bloodGroup.includes('Bombay') ||
          bloodGroup.includes('Rh-null') ||
          bloodGroup.includes('Kell') ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-[11px] text-amber-800">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Rare Phenotype Immunohematology Protocol</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Ordinary ABO/Rh units (including universal O-negative) cannot be given safely to
                Bombay phenotype or multi-alloantibody recipients. Please detail any specific
                laboratory findings:
              </p>
              <input
                type="text"
                placeholder="e.g. Anti-H confirmed in saliva/serum; Bombay Oh/hh non-secretor"
                value={phenotypeDetails}
                onChange={(e) => setPhenotypeDetails(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          ) : null}

          {/* Hospital & Location */}
          <div className="space-y-3 pt-1 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Hospital Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Hospital Location / City *</span>
                </label>
                <select
                  value={selectedCity.city}
                  onChange={(e) => {
                    const preset = CITY_PRESETS.find((c) => c.city === e.target.value);
                    if (preset) setSelectedCity(preset);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {CITY_PRESETS.map((c) => (
                    <option key={c.city} value={c.city}>
                      {c.city}, {c.state} ({c.lat.toFixed(2)}, {c.lon.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">ICU / Hospital Phone *</label>
                <input
                  type="text"
                  required
                  value={hospitalContact}
                  onChange={(e) => setHospitalContact(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-slate-400" />
                  <span>Attending Doctor</span>
                </label>
                <input
                  type="text"
                  value={doctorInCharge}
                  onChange={(e) => setDoctorInCharge(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Needed Within</span>
                </label>
                <select
                  value={requiredByHours}
                  onChange={(e) => setRequiredByHours(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value={2}>2 Hours (Immediate)</option>
                  <option value={6}>6 Hours (Urgent)</option>
                  <option value={12}>12 Hours (Scheduled)</option>
                  <option value={24}>24 Hours</option>
                </select>
              </div>
            </div>
          </div>

          {/* Medical Confirmation Checkbox */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
            <input
              type="checkbox"
              id="medConfirmed"
              checked={medicallyConfirmed}
              onChange={(e) => setMedicallyConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
            />
            <label htmlFor="medConfirmed" className="text-slate-700 leading-tight cursor-pointer">
              <strong className="block text-slate-900">
                Hospital Transfusion Service Confirmation
              </strong>
              This request is supported by an official clinical diagnosis or hospital transfusion
              requisition slip.
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-colors flex items-center gap-2 shadow-sm shadow-rose-200 disabled:opacity-50"
            >
              {submitting ? 'Initiating Matching...' : 'Launch Emergency Requisition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
