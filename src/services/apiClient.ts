import {
  AvailabilityStatus,
  BloodBank,
  BloodGroupType,
  DonorProfile,
  EmergencyRequest,
  PrioritizedDonorResult,
  RequestStatus,
  User,
  UserRole,
  VerificationStatus,
} from '../types';
import { prioritizeDonors } from './matchingAlgorithm';
import { store } from './store';

const SIMULATE_LATENCY_MS = 180;

function delay(ms: number = SIMULATE_LATENCY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface SearchParams {
  bloodGroup: BloodGroupType;
  latitude: number;
  longitude: number;
  radiusKm?: number;
}

export interface AdminDashboardData {
  metrics: {
    totalDonors: number;
    verifiedDonors: number;
    unverifiedDonors: number;
    activeRequests: number;
    rareBloodRequests: number;
    pendingVerificationRequests: number;
    escalatedCases: number;
    fulfilledCases: number;
  };
  recentActivity: Array<{
    id: string;
    action: string;
    actor: string;
    time: string;
    details: string;
  }>;
  bloodBankNetworkCount: number;
  demographics: {
    bombayDonors: number;
    rhNullDonors: number;
    kellNegativeDonors: number;
    standardDonors: number;
  };
}

export const apiClient = {
  // --- Auth Endpoints ---
  async login(
    email: string,
    _password?: string
  ): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    await delay();
    const users = store.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      store.setCurrentUserById(user.id);
      return {
        success: true,
        user,
        token: `mock-jwt-token-${user.id}-${Date.now()}`,
      };
    }
    return {
      success: false,
      error: 'Invalid credentials or user not found.',
    };
  },

  async registerUser(userData: {
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
  }): Promise<{ success: boolean; user: User }> {
    await delay();
    const newUser: User = {
      id: `usr-${Date.now()}`,
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      accountStatus: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.setCurrentUserById(newUser.id);
    return { success: true, user: newUser };
  },

  // --- Donor Endpoints ---
  async searchDonors(params: SearchParams): Promise<PrioritizedDonorResult[]> {
    await delay();
    const allDonors = store.getDonors();
    const results = prioritizeDonors(
      allDonors,
      params.bloodGroup,
      params.latitude,
      params.longitude,
      params.radiusKm || 250
    );
    return results;
  },

  async getDonorById(id: string): Promise<DonorProfile | null> {
    await delay();
    const donor = store.getDonorById(id);
    return donor || null;
  },

  async updateAvailability(
    donorId: string,
    status: AvailabilityStatus
  ): Promise<DonorProfile | null> {
    await delay();
    const updated = store.updateDonorAvailability(donorId, status);
    return updated || null;
  },

  async updateVerification(
    donorId: string,
    status: VerificationStatus,
    reviewerName: string
  ): Promise<DonorProfile | null> {
    await delay();
    const updated = store.updateDonorVerification(donorId, status, reviewerName);
    return updated || null;
  },

  // --- Request Endpoints ---
  async createRequest(
    data: Omit<
      EmergencyRequest,
      | 'id'
      | 'requestNumber'
      | 'createdAt'
      | 'updatedAt'
      | 'potentialDonorsFoundCount'
      | 'responsesReceivedCount'
    >
  ): Promise<EmergencyRequest> {
    await delay();
    return store.createEmergencyRequest(data);
  },

  async getRequestById(id: string): Promise<EmergencyRequest | null> {
    await delay();
    const req = store.getRequestById(id);
    return req || null;
  },

  async getRequests(): Promise<EmergencyRequest[]> {
    await delay();
    return store.getRequests();
  },

  async updateRequestStatus(
    id: string,
    status: RequestStatus,
    note?: string
  ): Promise<EmergencyRequest | null> {
    await delay();
    const updated = store.updateRequestStatus(id, status, note);
    return updated || null;
  },

  async escalateRequest(
    id: string,
    reason: string,
    bloodBankId?: string
  ): Promise<EmergencyRequest | null> {
    await delay();
    const updated = store.escalateRequest(id, reason, bloodBankId);
    return updated || null;
  },

  async respondToMatch(
    requestId: string,
    donorId: string,
    response: 'ACCEPTED' | 'DECLINED',
    note?: string
  ): Promise<boolean> {
    await delay();
    return store.respondToDonorMatch(requestId, donorId, response, note);
  },

  // --- Blood Banks Endpoints ---
  async getBloodBanks(): Promise<BloodBank[]> {
    await delay();
    return store.getBloodBanks();
  },

  async getBloodBankById(id: string): Promise<BloodBank | null> {
    await delay();
    const bb = store.getBloodBankById(id);
    return bb || null;
  },

  // --- Admin Dashboard Endpoint ---
  async getAdminDashboard(): Promise<AdminDashboardData> {
    await delay();
    const donors = store.getDonors();
    const requests = store.getRequests();
    const bloodBanks = store.getBloodBanks();
    const auditLogs = store.getAuditLogs();

    const verifiedDonors = donors.filter(
      (d) => d.verificationStatus === 'VERIFIED_BY_REVIEWER'
    ).length;
    const unverifiedDonors = donors.filter(
      (d) => d.verificationStatus === 'UNVERIFIED' || d.verificationStatus === 'VERIFICATION_PENDING'
    ).length;
    const activeRequests = requests.filter(
      (r) =>
        r.requestStatus !== 'FULFILLED' &&
        r.requestStatus !== 'CANCELLED' &&
        r.requestStatus !== 'EXPIRED'
    ).length;
    const rareBloodRequests = requests.filter((r) => r.isRarePhenotypeCase).length;
    const pendingVerificationRequests = requests.filter(
      (r) => r.medicalConfirmationStatus === 'PENDING_CONFIRMATION'
    ).length;
    const escalatedCases = requests.filter(
      (r) => r.requestStatus === 'ESCALATED_TO_RARE_COORDINATOR'
    ).length;
    const fulfilledCases = requests.filter((r) => r.requestStatus === 'FULFILLED').length;

    const bombayDonors = donors.filter((d) => d.bloodGroup === 'Bombay (Oh/hh)').length;
    const rhNullDonors = donors.filter((d) => d.bloodGroup === 'Rh-null (Golden Blood)').length;
    const kellNegativeDonors = donors.filter((d) => d.bloodGroup === 'Kell Negative (K-k+)').length;
    const standardDonors = donors.length - (bombayDonors + rhNullDonors + kellNegativeDonors);

    const recentActivity = auditLogs.slice(0, 10).map((log) => ({
      id: log.id,
      action: log.action.replace(/_/g, ' '),
      actor: log.actorName,
      time: log.timestamp,
      details: log.details,
    }));

    return {
      metrics: {
        totalDonors: donors.length,
        verifiedDonors,
        unverifiedDonors,
        activeRequests,
        rareBloodRequests,
        pendingVerificationRequests,
        escalatedCases,
        fulfilledCases,
      },
      recentActivity,
      bloodBankNetworkCount: bloodBanks.length,
      demographics: {
        bombayDonors,
        rhNullDonors,
        kellNegativeDonors,
        standardDonors,
      },
    };
  },
};
