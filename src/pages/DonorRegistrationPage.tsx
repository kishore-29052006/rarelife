import React, { useState } from 'react';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle,
  Compass,
  Droplet,
  FileText,
  Heart,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import {
  AvailabilityStatus,
  BloodGroupType,
  ContactPreference,
  DonorProfile,
} from '../types';
import { store } from '../services/store';

interface DonorRegistrationPageProps {
  onNavigate: (tab: string, context?: any) => void;
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

export const DonorRegistrationPage: React.FC<DonorRegistrationPageProps> = ({ onNavigate }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroupType>('Bombay (Oh/hh)');
  const [rareDetails, setRareDetails] = useState('');
  const [selectedCity, setSelectedCity] = useState(CITY_PRESETS[0]);
  const [lastDonationDate, setLastDonationDate] = useState('2026-05-10');
  const [availabilityStatus, setAvailabilityStatus] =
    useState<AvailabilityStatus>('AVAILABLE_NOW');
  const [preferredContact, setPreferredContact] = useState<ContactPreference>('CALL');
  const [contactConsent, setContactConsent] = useState(true);
  const [labReportFile, setLabReportFile] = useState<File | null>(null);
  const [labReportName, setLabReportName] = useState<string>('');
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRareGroup = [
    'Bombay (Oh/hh)',
    'Rh-null (Golden Blood)',
    'Kell Negative (K-k+)',
    'Duffy Null (Fy(a-b-))',
    'Other Rare Phenotype',
  ].includes(bloodGroup);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError('Browser geolocation is not supported.');
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectingLocation(false);
        setSelectedCity({
          city: 'Detected Location',
          state: 'GPS Coordinates',
          district: 'Local Grid',
          lat: Math.round(pos.coords.latitude * 1000) / 1000,
          lon: Math.round(pos.coords.longitude * 1000) / 1000,
        });
      },
      () => {
        setDetectingLocation(false);
        setError('Location permission denied or unavailable. Using city preset.');
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLabReportFile(file);
      setLabReportName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in all mandatory identification details.');
      return;
    }
    if (!contactConsent) {
      setError('You must provide contact consent to register as an emergency donor.');
      return;
    }

    try {
      const createdUser = store.getUsers().find((u) => u.email === email) || {
        id: `usr-${Date.now()}`,
        fullName,
        email,
        phone,
        role: 'DONOR' as const,
        accountStatus: 'ACTIVE' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const newDonor = store.registerDonor({
        userId: createdUser.id,
        fullName,
        bloodGroup,
        rarePhenotypeDetails: isRareGroup ? rareDetails || `${bloodGroup} verified testing` : undefined,
        isRareBlood: isRareGroup,
        verificationStatus: labReportName ? 'VERIFICATION_PENDING' : 'UNVERIFIED',
        labReportFileName: labReportName || undefined,
        availabilityStatus,
        lastAvailabilityConfirmedAt: new Date().toISOString(),
        lastDonationDate: lastDonationDate || undefined,
        latitude: selectedCity.lat,
        longitude: selectedCity.lon,
        city: selectedCity.city,
        district: selectedCity.district,
        state: selectedCity.state,
        phone,
        email,
        preferredContact,
        contactConsent,
      });

      // Switch current role to DONOR
      store.switchRole('DONOR');
      setSubmitted(true);
    } catch {
      setError('Registration could not be completed. Please check the inputs.');
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            Emergency Donor Profile Registered
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
            Thank you for registering your blood profile. If you uploaded a laboratory report, it has
            been queued for authorized immunohematology verification.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Registered Name:</span>
            <span className="font-semibold text-slate-900">{fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Blood Group / Phenotype:</span>
            <span className="font-mono font-bold text-rose-600">{bloodGroup}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Status:</span>
            <span className="font-semibold text-emerald-700">Available For Emergency Match</span>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => onNavigate('donor-dashboard')}
            className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition-colors shadow-sm"
          >
            Go To Donor Dashboard
          </button>
          <button
            onClick={() => onNavigate('search')}
            className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Test Search Matches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded border border-rose-100">
          Voluntary Emergency Enrollment
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Register as a Rare Blood Donor
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Help hospitals locate lifesaving donors during critical transfusions. Your personal
          contact information is never exposed to the public.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-xs">
        {/* Section 1: Identity & Credentials */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" />
            <span>1. Personal & Contact Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh K. Patel"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="e.g. ramesh.patel@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 98200 12345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Account Password *</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Blood Phenotype & Laboratory Verification */}
        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
            <Droplet className="w-4 h-4 text-rose-600" />
            <span>2. Blood Group & Rare Phenotype Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Blood Group / Phenotype *
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroupType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-rose-500"
              >
                <optgroup label="Rare & Ultra-Rare Groups">
                  <option value="Bombay (Oh/hh)">Bombay Phenotype (Oh/hh)</option>
                  <option value="Rh-null (Golden Blood)">Rh-null (Golden Blood)</option>
                  <option value="Kell Negative (K-k+)">Kell Negative (K-k+)</option>
                  <option value="Duffy Null (Fy(a-b-))">Duffy Null (Fy(a-b-))</option>
                  <option value="Other Rare Phenotype">Other Rare Phenotype</option>
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

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Date of Last Donation
              </label>
              <input
                type="date"
                value={lastDonationDate}
                onChange={(e) => setLastDonationDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-rose-500 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Standard safety cooldown: 90 days for whole blood.
              </span>
            </div>
          </div>

          {isRareGroup && (
            <div className="space-y-2 p-3 bg-amber-50/80 border border-amber-200 rounded-xl">
              <label className="font-semibold text-amber-950 block">
                Rare Phenotype Laboratory Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Bombay Oh/hh saliva secretor negative; anti-H detected at KEM Hospital"
                value={rareDetails}
                onChange={(e) => setRareDetails(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-lg p-2 text-slate-800 text-xs focus:ring-1 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Private Lab Report Upload */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              Private Laboratory Report Upload (Optional for Verified Badge)
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              {labReportName ? (
                <div className="text-rose-600 font-semibold">{labReportName} (Attached for Review)</div>
              ) : (
                <div className="text-slate-500">
                  <span className="font-semibold text-slate-800">Upload lab test slip</span> (PDF,
                  PNG, JPG). Stored confidentially for authorized reviewer verification only.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Geolocation & Availability */}
        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>3. Location & Availability Preferences</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                City & District (Approximate) *
              </label>
              <select
                value={selectedCity.city}
                onChange={(e) => {
                  const c = CITY_PRESETS.find((p) => p.city === e.target.value);
                  if (c) setSelectedCity(c);
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

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={detectingLocation}
                className="w-full py-2 px-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-medium flex items-center justify-center gap-1.5"
              >
                <Compass className="w-4 h-4 text-rose-600" />
                <span>{detectingLocation ? 'Detecting...' : 'Use My Browser Geolocation'}</span>
              </button>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Initial Availability</label>
              <select
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value as AvailabilityStatus)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-rose-500 font-medium"
              >
                <option value="AVAILABLE_NOW">Available Now for Emergency Requisitions</option>
                <option value="BUSY_TEMPORARY">Busy Temporarily (Notify only for critical rare cases)</option>
                <option value="UNAVAILABLE">Unavailable At Present</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Preferred Contact Method</label>
              <select
                value={preferredContact}
                onChange={(e) => setPreferredContact(e.target.value as ContactPreference)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-rose-500 font-medium"
              >
                <option value="CALL">Phone Call</option>
                <option value="WHATSAPP">WhatsApp Message</option>
                <option value="SMS">SMS Text Alert</option>
                <option value="THROUGH_BLOOD_BANK_ONLY">Through Authorized Blood Bank Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Consent and Security */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="consent"
              required
              checked={contactConsent}
              onChange={(e) => setContactConsent(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
            />
            <label htmlFor="consent" className="text-slate-700 leading-relaxed cursor-pointer">
              <strong className="text-slate-900 block">Emergency Transfusion Contact Consent *</strong>
              I agree to be listed in the RareLife Emergency Registry and give consent to receive
              verified emergency donation inquiries according to my contact preferences. I understand
              my exact home address is never made public.
            </label>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <button
            type="submit"
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold transition-colors shadow-sm shadow-rose-200"
          >
            Complete Registration & Enroll Profile
          </button>
        </div>
      </form>
    </div>
  );
};
