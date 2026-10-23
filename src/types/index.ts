export type UserRole = 'PATIENT' | 'DONOR' | 'BLOOD_BANK' | 'ADMIN' | 'HOSPITAL';

export type BloodGroupType =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-'
  | 'Bombay (Oh/hh)'
  | 'Rh-null (Golden Blood)'
  | 'Kell Negative (K-k+)'
  | 'Duffy Null (Fy(a-b-))'
  | 'Colton Null'
  | 'Other Rare Phenotype';

export type ComponentType =
  | 'WHOLE_BLOOD'
  | 'PACKED_RED_CELLS'
  | 'PLATELETS'
  | 'FRESH_FROZEN_PLASMA'
  | 'CRYOPRECIPITATE';

export type VerificationStatus =
  | 'UNVERIFIED'
  | 'VERIFICATION_PENDING'
  | 'VERIFIED_BY_REVIEWER'
  | 'EXPIRED_OR_NEEDS_REVIEW';

export type AvailabilityStatus =
  | 'AVAILABLE_NOW'
  | 'BUSY_TEMPORARY'
  | 'UNAVAILABLE'
  | 'NOT_ELIGIBLE_RECENT_DONATION';

export type ContactPreference = 'CALL' | 'SMS' | 'WHATSAPP' | 'THROUGH_BLOOD_BANK_ONLY';

export type RequestStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'AWAITING_VERIFICATION'
  | 'SEARCHING_FOR_DONORS'
  | 'POTENTIAL_DONOR_IDENTIFIED'
  | 'BLOOD_BANK_CONTACTED'
  | 'ESCALATED_TO_RARE_COORDINATOR'
  | 'FULFILLED'
  | 'CANCELLED'
  | 'EXPIRED';

export type UrgencyLevel = 'CRITICAL_IMMEDIATE' | 'HIGH_WITHIN_6HRS' | 'MODERATE_WITHIN_24HRS';

export type MatchStatus =
  | 'POTENTIAL_MATCH'
  | 'BLOOD_GROUP_VERIFIED'
  | 'AVAILABILITY_CONFIRMED'
  | 'CONTACT_THROUGH_BLOOD_BANK'
  | 'NOT_CURRENTLY_AVAILABLE';

export type DonorResponseStatus =
  | 'AWAITING_RESPONSE'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'UNREACHABLE'
  | 'DONATION_COMPLETED';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  accountStatus: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  organizationName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DonorProfile {
  id: string;
  userId: string;
  fullName: string;
  bloodGroup: BloodGroupType;
  rarePhenotypeDetails?: string;
  isRareBlood: boolean;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verificationDate?: string;
  labReportFileName?: string;
  availabilityStatus: AvailabilityStatus;
  lastAvailabilityConfirmedAt: string;
  lastDonationDate?: string;
  latitude: number;
  longitude: number;
  city: string;
  district: string;
  state: string;
  phone: string;
  email: string;
  preferredContact: ContactPreference;
  contactConsent: boolean;
  totalDonationsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyRequest {
  id: string;
  requestNumber: string; // e.g. RL-2026-8941
  requesterId: string;
  requesterName: string;
  requesterPhone: string;
  requesterRole: 'PATIENT' | 'HOSPITAL';
  patientAge?: number;
  patientGender?: string;
  hospitalName: string;
  hospitalContact: string;
  doctorInCharge?: string;
  requiredBloodGroup: BloodGroupType;
  requiredPhenotypeDetails?: string;
  isRarePhenotypeCase: boolean;
  componentType: ComponentType;
  unitsRequired: number;
  city: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  requiredBy: string; // ISO date string
  urgency: UrgencyLevel;
  medicalConfirmationStatus: 'VERIFIED_BY_HOSPITAL' | 'PENDING_CONFIRMATION' | 'UNCONFIRMED';
  requestStatus: RequestStatus;
  notes?: string;
  assignedBloodBankId?: string;
  assignedCoordinatorName?: string;
  potentialDonorsFoundCount: number;
  responsesReceivedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DonorRequestMatch {
  id: string;
  requestId: string;
  donorId: string;
  approximateDistanceKm: number;
  matchStatus: MatchStatus;
  responseStatus: DonorResponseStatus;
  contactedAt?: string;
  respondedAt?: string;
  responseNote?: string;
  createdAt: string;
}

export interface BloodBank {
  id: string;
  organizationName: string;
  authorizedContact: string;
  officialPhone: string;
  officialEmail: string;
  address: string;
  city: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  verificationStatus: 'GOVERNMENT_LICENSED' | 'VERIFIED' | 'PENDING';
  hasRareBloodDepot: boolean;
  stockSummary: {
    [key: string]: number; // e.g., 'O+': 14, 'Bombay (Oh/hh)': 1
  };
  operatingHours: string;
}

export interface RequestEscalation {
  id: string;
  requestId: string;
  requestNumber: string;
  escalatedByUserId: string;
  escalatedByUserName: string;
  bloodBankId?: string;
  coordinatorId?: string;
  coordinatorName?: string;
  escalationReason: string;
  escalationStatus: 'PENDING_REVIEW' | 'COORDINATING' | 'UNITS_SECURED' | 'CLOSED';
  actionTaken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  requestId: string;
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  actorRole: UserRole | 'SYSTEM';
  eventType:
    | 'STATUS_CHANGE'
    | 'SEARCH_TRIGGERED'
    | 'DONOR_NOTIFIED'
    | 'DONOR_RESPONDED'
    | 'BLOOD_BANK_ASSIGNED'
    | 'ESCALATED'
    | 'FULFILLED'
    | 'CANCELLED';
}

export interface DonationHistoryItem {
  id: string;
  donorId: string;
  donationDate: string;
  bloodBankName: string;
  componentType: ComponentType;
  unitsDonated: number;
  verificationStatus: 'CONFIRMED_BY_BLOOD_BANK' | 'SELF_REPORTED';
  notes?: string;
}

export interface NotificationItem {
  id: string;
  recipientUserId: string;
  requestId?: string;
  title: string;
  message: string;
  notificationType: 'EMERGENCY_ALERT' | 'MATCH_FOUND' | 'STATUS_UPDATE' | 'VERIFICATION_UPDATE';
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorUserId: string;
  actorName: string;
  action: string;
  entityType: 'DONOR' | 'REQUEST' | 'ESCALATION' | 'USER' | 'VERIFICATION';
  entityId: string;
  details: string;
  timestamp: string;
}

export interface PrioritizedDonorResult {
  donor: DonorProfile;
  approximateDistanceKm: number;
  matchScore: number;
  matchLabel: MatchStatus;
  eligibilityMessage: string;
  rank: number;
  breakdown: {
    bloodMatchScore: number;
    availabilityScore: number;
    distanceScore: number;
    verificationScore: number;
    eligibilityScore: number;
  };
}
