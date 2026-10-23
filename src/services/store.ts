import {
  INITIAL_AUDIT_LOGS,
  INITIAL_BLOOD_BANKS,
  INITIAL_DONATION_HISTORY,
  INITIAL_DONORS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REQUESTS,
  INITIAL_TIMELINE_EVENTS,
  INITIAL_USERS,
} from '../data/seedData';
import {
  AuditLog,
  AvailabilityStatus,
  BloodBank,
  DonationHistoryItem,
  DonorProfile,
  EmergencyRequest,
  NotificationItem,
  RequestStatus,
  TimelineEvent,
  User,
  UserRole,
  VerificationStatus,
} from '../types';

const STORAGE_KEYS = {
  USERS: 'rarelife_users',
  DONORS: 'rarelife_donors',
  REQUESTS: 'rarelife_requests',
  BLOOD_BANKS: 'rarelife_blood_banks',
  TIMELINE: 'rarelife_timeline',
  AUDIT_LOGS: 'rarelife_audit_logs',
  NOTIFICATIONS: 'rarelife_notifications',
  DONATION_HISTORY: 'rarelife_donation_history',
  CURRENT_USER_ID: 'rarelife_current_user_id',
  IS_DEMO_MODE: 'rarelife_is_demo_mode',
};

class RareLifeStore {
  private users: User[] = [];
  private donors: DonorProfile[] = [];
  private requests: EmergencyRequest[] = [];
  private bloodBanks: BloodBank[] = [];
  private timeline: TimelineEvent[] = [];
  private auditLogs: AuditLog[] = [];
  private notifications: NotificationItem[] = [];
  private donationHistory: DonationHistoryItem[] = [];
  private currentUserId: string = 'usr-patient-1';
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
        this.donors = JSON.parse(localStorage.getItem(STORAGE_KEYS.DONORS) || '[]');
        this.requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
        this.bloodBanks = JSON.parse(localStorage.getItem(STORAGE_KEYS.BLOOD_BANKS) || '[]');
        this.timeline = JSON.parse(localStorage.getItem(STORAGE_KEYS.TIMELINE) || '[]');
        this.auditLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS) || '[]');
        this.notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
        this.donationHistory = JSON.parse(
          localStorage.getItem(STORAGE_KEYS.DONATION_HISTORY) || '[]'
        );
        this.currentUserId =
          localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'usr-patient-1';
      } else {
        this.resetToDemoData();
      }
    } catch {
      this.resetToDemoData();
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(this.donors));
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(this.requests));
      localStorage.setItem(STORAGE_KEYS.BLOOD_BANKS, JSON.stringify(this.bloodBanks));
      localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(this.timeline));
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(this.auditLogs));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
      localStorage.setItem(STORAGE_KEYS.DONATION_HISTORY, JSON.stringify(this.donationHistory));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, this.currentUserId);
    } catch {
      // LocalStorage fallback handled silently
    }
    this.notify();
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  public resetToDemoData() {
    this.users = [...INITIAL_USERS];
    this.donors = [...INITIAL_DONORS];
    this.requests = [...INITIAL_REQUESTS];
    this.bloodBanks = [...INITIAL_BLOOD_BANKS];
    this.timeline = [...INITIAL_TIMELINE_EVENTS];
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
    this.notifications = [...INITIAL_NOTIFICATIONS];
    this.donationHistory = [...INITIAL_DONATION_HISTORY];
    this.currentUserId = 'usr-patient-1';
    this.save();
  }

  // --- User & Role Management ---

  public getUsers(): User[] {
    return [...this.users];
  }

  public getCurrentUser(): User {
    const user = this.users.find((u) => u.id === this.currentUserId);
    return user || this.users[0];
  }

  public switchRole(role: UserRole) {
    const targetUser = this.users.find((u) => u.role === role);
    if (targetUser) {
      this.currentUserId = targetUser.id;
      this.save();
    }
  }

  public setCurrentUserById(userId: string) {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      this.currentUserId = user.id;
      this.save();
    }
  }

  public getCurrentDonorProfile(): DonorProfile | undefined {
    const user = this.getCurrentUser();
    return this.donors.find((d) => d.userId === user.id);
  }

  // --- Donor Operations ---

  public getDonors(): DonorProfile[] {
    return [...this.donors];
  }

  public getDonorById(id: string): DonorProfile | undefined {
    return this.donors.find((d) => d.id === id);
  }

  public registerDonor(
    profileData: Omit<DonorProfile, 'id' | 'createdAt' | 'updatedAt' | 'totalDonationsCount'>
  ): DonorProfile {
    const newId = `dnr-${Date.now()}`;
    const newDonor: DonorProfile = {
      ...profileData,
      id: newId,
      totalDonationsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.donors.unshift(newDonor);

    this.recordAuditLog(
      this.currentUserId,
      this.getCurrentUser().fullName,
      'REGISTERED_DONOR_PROFILE',
      'DONOR',
      newId,
      `New donor registration for blood group ${newDonor.bloodGroup}${
        newDonor.isRareBlood ? ' (Rare Phenotype)' : ''
      }. Verification pending.`
    );

    this.save();
    return newDonor;
  }

  public updateDonorAvailability(
    donorId: string,
    availabilityStatus: AvailabilityStatus
  ): DonorProfile | undefined {
    const index = this.donors.findIndex((d) => d.id === donorId);
    if (index === -1) return undefined;

    const donor = this.donors[index];
    const updated: DonorProfile = {
      ...donor,
      availabilityStatus,
      lastAvailabilityConfirmedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.donors[index] = updated;

    this.recordAuditLog(
      this.currentUserId,
      this.getCurrentUser().fullName,
      'UPDATED_AVAILABILITY_STATUS',
      'DONOR',
      donorId,
      `Updated donor status to ${availabilityStatus.replace(/_/g, ' ')}.`
    );

    this.save();
    return updated;
  }

  public updateDonorVerification(
    donorId: string,
    verificationStatus: VerificationStatus,
    reviewerName: string
  ): DonorProfile | undefined {
    const index = this.donors.findIndex((d) => d.id === donorId);
    if (index === -1) return undefined;

    const donor = this.donors[index];
    const updated: DonorProfile = {
      ...donor,
      verificationStatus,
      verifiedBy: reviewerName,
      verificationDate: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
    };

    this.donors[index] = updated;

    // Send notification to donor
    this.addNotification(
      donor.userId,
      'Donor Profile Verification Status Updated',
      `Your donor verification has been marked as: ${verificationStatus.replace(
        /_/g,
        ' '
      )} by ${reviewerName}.`,
      'VERIFICATION_UPDATE'
    );

    this.recordAuditLog(
      this.currentUserId,
      reviewerName,
      'VERIFIED_DONOR_PROFILE',
      'DONOR',
      donorId,
      `Status changed to ${verificationStatus} for donor ${donor.fullName}.`
    );

    this.save();
    return updated;
  }

  // --- Emergency Requests Operations ---

  public getRequests(): EmergencyRequest[] {
    return [...this.requests];
  }

  public getRequestById(id: string): EmergencyRequest | undefined {
    return this.requests.find((r) => r.id === id || r.requestNumber === id);
  }

  public createEmergencyRequest(
    data: Omit<
      EmergencyRequest,
      | 'id'
      | 'requestNumber'
      | 'createdAt'
      | 'updatedAt'
      | 'potentialDonorsFoundCount'
      | 'responsesReceivedCount'
    >
  ): EmergencyRequest {
    const seq = Math.floor(1000 + Math.random() * 9000);
    const id = `req-${Date.now()}`;
    const requestNumber = `RL-${new Date().getFullYear()}-${seq}`;

    const newRequest: EmergencyRequest = {
      ...data,
      id,
      requestNumber,
      potentialDonorsFoundCount: 0,
      responsesReceivedCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.requests.unshift(newRequest);

    // Initial timeline event
    this.addTimelineEvent(
      id,
      'Emergency Request Registered',
      `Emergency case ${requestNumber} for ${data.requiredBloodGroup} (${data.unitsRequired} units) registered at ${data.hospitalName}.`,
      data.requesterName,
      'PATIENT',
      'STATUS_CHANGE'
    );

    // Initial audit log
    this.recordAuditLog(
      this.currentUserId,
      data.requesterName,
      'CREATED_EMERGENCY_REQUEST',
      'REQUEST',
      id,
      `Created case ${requestNumber} for ${data.requiredBloodGroup} at ${data.hospitalName}.`
    );

    this.save();
    return newRequest;
  }

  public updateRequestStatus(
    requestId: string,
    status: RequestStatus,
    note?: string
  ): EmergencyRequest | undefined {
    const index = this.requests.findIndex((r) => r.id === requestId);
    if (index === -1) return undefined;

    const req = this.requests[index];
    const updated: EmergencyRequest = {
      ...req,
      requestStatus: status,
      notes: note ? `${req.notes ? req.notes + ' | ' : ''}${note}` : req.notes,
      updatedAt: new Date().toISOString(),
    };

    this.requests[index] = updated;

    this.addTimelineEvent(
      requestId,
      `Request Status Updated: ${status.replace(/_/g, ' ')}`,
      note || `Case status shifted to ${status.replace(/_/g, ' ')}.`,
      this.getCurrentUser().fullName,
      this.getCurrentUser().role,
      'STATUS_CHANGE'
    );

    this.recordAuditLog(
      this.currentUserId,
      this.getCurrentUser().fullName,
      'UPDATED_REQUEST_STATUS',
      'REQUEST',
      requestId,
      `Status changed to ${status}. Notes: ${note || 'None'}`
    );

    this.save();
    return updated;
  }

  public escalateRequest(
    requestId: string,
    reason: string,
    targetBloodBankId?: string
  ): EmergencyRequest | undefined {
    const index = this.requests.findIndex((r) => r.id === requestId);
    if (index === -1) return undefined;

    const req = this.requests[index];
    const bb = targetBloodBankId
      ? this.bloodBanks.find((b) => b.id === targetBloodBankId)
      : this.bloodBanks[0];

    const updated: EmergencyRequest = {
      ...req,
      requestStatus: 'ESCALATED_TO_RARE_COORDINATOR',
      assignedBloodBankId: bb?.id,
      assignedCoordinatorName: bb?.authorizedContact || 'Rare Blood Central Coordinator',
      notes: `${req.notes ? req.notes + ' | ' : ''}Escalated: ${reason}`,
      updatedAt: new Date().toISOString(),
    };

    this.requests[index] = updated;

    this.addTimelineEvent(
      requestId,
      'Escalated to Rare-Donor Coordinator',
      `Case escalated to ${bb?.organizationName || 'Rare Blood Registry'} by ${
        this.getCurrentUser().fullName
      }. Reason: ${reason}`,
      this.getCurrentUser().fullName,
      this.getCurrentUser().role,
      'ESCALATED'
    );

    this.recordAuditLog(
      this.currentUserId,
      this.getCurrentUser().fullName,
      'ESCALATED_EMERGENCY_CASE',
      'ESCALATION',
      requestId,
      `Escalated case ${req.requestNumber} to ${bb?.organizationName}. Reason: ${reason}`
    );

    // Notify admins and blood bank
    const adminUser = this.users.find((u) => u.role === 'ADMIN');
    if (adminUser) {
      this.addNotification(
        adminUser.id,
        `Rare Blood Escalation Alert: ${req.requestNumber}`,
        `Case ${req.requestNumber} (${req.requiredBloodGroup}) escalated from ${req.hospitalName}. Reason: ${reason}`,
        'EMERGENCY_ALERT',
        requestId
      );
    }

    this.save();
    return updated;
  }

  public respondToDonorMatch(
    requestId: string,
    donorId: string,
    response: 'ACCEPTED' | 'DECLINED',
    note?: string
  ): boolean {
    const reqIndex = this.requests.findIndex((r) => r.id === requestId);
    const donor = this.donors.find((d) => d.id === donorId);
    if (reqIndex === -1 || !donor) return false;

    const req = this.requests[reqIndex];
    req.responsesReceivedCount += 1;
    if (response === 'ACCEPTED') {
      req.requestStatus = 'POTENTIAL_DONOR_IDENTIFIED';
    }
    req.updatedAt = new Date().toISOString();
    this.requests[reqIndex] = req;

    this.addTimelineEvent(
      requestId,
      `Donor Response: ${response}`,
      `${donor.fullName} responded: ${response}. ${note ? `Notes: ${note}` : ''}`,
      donor.fullName,
      'DONOR',
      'DONOR_RESPONDED'
    );

    this.recordAuditLog(
      donor.userId,
      donor.fullName,
      `DONOR_${response}_MATCH`,
      'REQUEST',
      requestId,
      `Donor ${donor.fullName} marked response as ${response}.`
    );

    // Notify requester
    this.addNotification(
      req.requesterId,
      `Update on ${req.requestNumber}`,
      `Donor ${donor.fullName} has ${response.toLowerCase()} the emergency requisition.`,
      'STATUS_UPDATE',
      requestId
    );

    this.save();
    return true;
  }

  public cancelRequest(requestId: string, reason: string): boolean {
    const reqIndex = this.requests.findIndex((r) => r.id === requestId);
    if (reqIndex === -1) return false;

    const req = this.requests[reqIndex];
    req.requestStatus = 'CANCELLED';
    req.notes = `${req.notes ? req.notes + ' | ' : ''}Cancelled: ${reason}`;
    req.updatedAt = new Date().toISOString();
    this.requests[reqIndex] = req;

    this.addTimelineEvent(
      requestId,
      'Emergency Request Cancelled',
      `Requisition cancelled by ${this.getCurrentUser().fullName}. Reason: ${reason}`,
      this.getCurrentUser().fullName,
      this.getCurrentUser().role,
      'CANCELLED'
    );

    this.recordAuditLog(
      this.currentUserId,
      this.getCurrentUser().fullName,
      'CANCELLED_EMERGENCY_REQUEST',
      'REQUEST',
      requestId,
      `Case cancelled. Reason: ${reason}`
    );

    this.save();
    return true;
  }

  public fulfillRequest(requestId: string, note?: string): boolean {
    const reqIndex = this.requests.findIndex((r) => r.id === requestId);
    if (reqIndex === -1) return false;

    const req = this.requests[reqIndex];
    req.requestStatus = 'FULFILLED';
    req.notes = `${req.notes ? req.notes + ' | ' : ''}Fulfilled: ${note || 'Units transfused'}`;
    req.updatedAt = new Date().toISOString();
    this.requests[reqIndex] = req;

    this.addTimelineEvent(
      requestId,
      'Emergency Requisition Fulfilled',
      `Blood units successfully delivered and crossmatched at ${req.hospitalName}. ${
        note || ''
      }`,
      this.getCurrentUser().fullName,
      this.getCurrentUser().role,
      'FULFILLED'
    );

    this.recordAuditLog(
      this.currentUserId,
      this.getCurrentUser().fullName,
      'FULFILLED_EMERGENCY_REQUEST',
      'REQUEST',
      requestId,
      `Case marked fulfilled. Details: ${note || 'Confirmed'}`
    );

    this.save();
    return true;
  }

  // --- Blood Banks ---

  public getBloodBanks(): BloodBank[] {
    return [...this.bloodBanks];
  }

  public getBloodBankById(id: string): BloodBank | undefined {
    return this.bloodBanks.find((b) => b.id === id);
  }

  // --- Timeline & Audit Logs ---

  public getTimelineForRequest(requestId: string): TimelineEvent[] {
    return this.timeline
      .filter((e) => e.requestId === requestId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public addTimelineEvent(
    requestId: string,
    title: string,
    description: string,
    actor: string,
    actorRole: UserRole | 'SYSTEM',
    eventType: TimelineEvent['eventType']
  ) {
    const event: TimelineEvent = {
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      requestId,
      timestamp: new Date().toISOString(),
      title,
      description,
      actor,
      actorRole,
      eventType,
    };
    this.timeline.unshift(event);
  }

  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  private recordAuditLog(
    actorUserId: string,
    actorName: string,
    action: string,
    entityType: AuditLog['entityType'],
    entityId: string,
    details: string
  ) {
    const log: AuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actorUserId,
      actorName,
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
  }

  // --- Notifications ---

  public getNotificationsForCurrentUser(): NotificationItem[] {
    const user = this.getCurrentUser();
    return this.notifications.filter((n) => n.recipientUserId === user.id);
  }

  public addNotification(
    recipientUserId: string,
    title: string,
    message: string,
    notificationType: NotificationItem['notificationType'],
    requestId?: string
  ) {
    const notif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      recipientUserId,
      requestId,
      title,
      message,
      notificationType,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(notif);
  }

  public markNotificationRead(id: string) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.save();
    }
  }

  // --- Donation History ---

  public getDonationHistoryForDonor(donorId: string): DonationHistoryItem[] {
    return this.donationHistory.filter((dh) => dh.donorId === donorId);
  }

  public addDonationRecord(record: Omit<DonationHistoryItem, 'id'>) {
    const newRecord: DonationHistoryItem = {
      ...record,
      id: `dh-${Date.now()}`,
    };
    this.donationHistory.unshift(newRecord);
    this.save();
  }
}

export const store = new RareLifeStore();
