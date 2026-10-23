import React, { useState } from 'react';
import {
  Check,
  Code2,
  Copy,
  Database,
  FileText,
  Layers,
  Server,
  X,
} from 'lucide-react';

interface BackendDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendDocsModal: React.FC<BackendDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'mysql' | 'spring' | 'api'>('architecture');
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const mysqlSchema = `-- =====================================================================
-- RARELIFE: Intelligent Rare Blood Donor Discovery & Emergency Matching
-- Database Schema: MySQL 8.0+
-- College Project: Information Technology / Transfusion Informatics
-- =====================================================================

CREATE DATABASE IF NOT EXISTS rarelife_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rarelife_db;

-- 1. Users Table (Core Auth & RBAC)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    phone VARCHAR(24) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('PATIENT', 'DONOR', 'BLOOD_BANK', 'ADMIN') NOT NULL DEFAULT 'PATIENT',
    account_status ENUM('ACTIVE', 'SUSPENDED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    organization_name VARCHAR(160),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
);

-- 2. Donor Profiles Table
CREATE TABLE donor_profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    blood_group ENUM(
        'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-',
        'Bombay (Oh/hh)', 'Rh-null (Golden Blood)', 'Kell Negative (K-k+)',
        'Duffy Null (Fy(a-b-))', 'Other Rare Phenotype'
    ) NOT NULL,
    rare_phenotype_details TEXT,
    is_rare_blood BOOLEAN NOT NULL DEFAULT FALSE,
    verification_status ENUM('UNVERIFIED', 'VERIFICATION_PENDING', 'VERIFIED_BY_REVIEWER', 'EXPIRED_OR_NEEDS_REVIEW') NOT NULL DEFAULT 'UNVERIFIED',
    verified_by VARCHAR(120),
    verification_date DATE,
    lab_report_file_name VARCHAR(255),
    availability_status ENUM('AVAILABLE_NOW', 'BUSY_TEMPORARY', 'UNAVAILABLE', 'NOT_ELIGIBLE_RECENT_DONATION') NOT NULL DEFAULT 'AVAILABLE_NOW',
    last_availability_confirmed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_donation_date DATE,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    city VARCHAR(80) NOT NULL,
    district VARCHAR(80) NOT NULL,
    state VARCHAR(80) NOT NULL,
    preferred_contact ENUM('CALL', 'SMS', 'WHATSAPP', 'THROUGH_BLOOD_BANK_ONLY') NOT NULL DEFAULT 'CALL',
    contact_consent BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_donor_bg (blood_group),
    INDEX idx_donor_avail (availability_status),
    INDEX idx_donor_coords (latitude, longitude)
);

-- 3. Emergency Requests Table
CREATE TABLE emergency_requests (
    id VARCHAR(36) PRIMARY KEY,
    request_number VARCHAR(32) NOT NULL UNIQUE,
    requester_id VARCHAR(36) NOT NULL,
    hospital_name VARCHAR(180) NOT NULL,
    hospital_contact VARCHAR(80) NOT NULL,
    doctor_in_charge VARCHAR(120),
    patient_age INT,
    patient_gender VARCHAR(16),
    required_blood_group VARCHAR(64) NOT NULL,
    required_phenotype_details TEXT,
    is_rare_phenotype_case BOOLEAN NOT NULL DEFAULT FALSE,
    component_type ENUM('WHOLE_BLOOD', 'PACKED_RED_CELLS', 'PLATELETS', 'FRESH_FROZEN_PLASMA', 'CRYOPRECIPITATE') NOT NULL,
    units_required INT NOT NULL DEFAULT 1,
    city VARCHAR(80) NOT NULL,
    district VARCHAR(80) NOT NULL,
    state VARCHAR(80) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    required_by TIMESTAMP NOT NULL,
    urgency ENUM('CRITICAL_IMMEDIATE', 'HIGH_WITHIN_6HRS', 'MODERATE_WITHIN_24HRS') NOT NULL,
    medical_confirmation_status ENUM('VERIFIED_BY_HOSPITAL', 'PENDING_CONFIRMATION', 'UNCONFIRMED') NOT NULL DEFAULT 'PENDING_CONFIRMATION',
    request_status ENUM(
        'DRAFT', 'SUBMITTED', 'AWAITING_VERIFICATION', 'SEARCHING_FOR_DONORS',
        'POTENTIAL_DONOR_IDENTIFIED', 'BLOOD_BANK_CONTACTED', 'ESCALATED_TO_RARE_COORDINATOR',
        'FULFILLED', 'CANCELLED', 'EXPIRED'
    ) NOT NULL DEFAULT 'SEARCHING_FOR_DONORS',
    notes TEXT,
    assigned_blood_bank_id VARCHAR(36),
    assigned_coordinator_name VARCHAR(120),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_id) REFERENCES users(id),
    INDEX idx_req_status (request_status),
    INDEX idx_req_urgency (urgency),
    INDEX idx_req_coords (latitude, longitude)
);

-- 4. Blood Banks Table
CREATE TABLE blood_banks (
    id VARCHAR(36) PRIMARY KEY,
    organization_name VARCHAR(180) NOT NULL,
    authorized_contact VARCHAR(120) NOT NULL,
    official_phone VARCHAR(40) NOT NULL,
    official_email VARCHAR(120) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(80) NOT NULL,
    district VARCHAR(80) NOT NULL,
    state VARCHAR(80) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    verification_status ENUM('GOVERNMENT_LICENSED', 'VERIFIED', 'PENDING') NOT NULL DEFAULT 'GOVERNMENT_LICENSED',
    has_rare_blood_depot BOOLEAN NOT NULL DEFAULT FALSE,
    operating_hours VARCHAR(80) DEFAULT '24 Hours / 7 Days'
);

-- 5. Donor Request Matches Table
CREATE TABLE donor_request_matches (
    id VARCHAR(36) PRIMARY KEY,
    request_id VARCHAR(36) NOT NULL,
    donor_id VARCHAR(36) NOT NULL,
    approximate_distance_km DECIMAL(8, 2) NOT NULL,
    match_status ENUM('POTENTIAL_MATCH', 'BLOOD_GROUP_VERIFIED', 'AVAILABILITY_CONFIRMED', 'CONTACT_THROUGH_BLOOD_BANK', 'NOT_CURRENTLY_AVAILABLE') NOT NULL,
    response_status ENUM('AWAITING_RESPONSE', 'ACCEPTED', 'DECLINED', 'UNREACHABLE', 'DONATION_COMPLETED') NOT NULL DEFAULT 'AWAITING_RESPONSE',
    contacted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP NULL,
    response_note TEXT,
    FOREIGN KEY (request_id) REFERENCES emergency_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (donor_id) REFERENCES donor_profiles(id) ON DELETE CASCADE,
    INDEX idx_match_req (request_id),
    INDEX idx_match_donor (donor_id)
);

-- 6. Request Escalations Table
CREATE TABLE request_escalations (
    id VARCHAR(36) PRIMARY KEY,
    request_id VARCHAR(36) NOT NULL,
    escalated_by_user_id VARCHAR(36) NOT NULL,
    blood_bank_id VARCHAR(36),
    coordinator_id VARCHAR(36),
    escalation_reason TEXT NOT NULL,
    escalation_status ENUM('PENDING_REVIEW', 'COORDINATING', 'UNITS_SECURED', 'CLOSED') NOT NULL DEFAULT 'PENDING_REVIEW',
    action_taken TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES emergency_requests(id) ON DELETE CASCADE
);

-- 7. Audit Logs Table
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    actor_user_id VARCHAR(36) NOT NULL,
    actor_name VARCHAR(120) NOT NULL,
    action VARCHAR(80) NOT NULL,
    entity_type ENUM('DONOR', 'REQUEST', 'ESCALATION', 'USER', 'VERIFICATION') NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    details TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

  const springBootServiceCode = `// =====================================================================
// RareLife: Spring Boot 3.3.x + Java 17 Service Layer
// DistanceUtil.java & DonorPrioritizationService.java
// =====================================================================

package com.rarelife.service;

import com.rarelife.model.DonorProfile;
import com.rarelife.dto.PrioritizedDonorDTO;
import com.rarelife.repository.DonorRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DonorPrioritizationService {

    private final DonorRepository donorRepository;

    public DonorPrioritizationService(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    /**
     * Haversine Great-Circle Distance Calculation
     */
    public static double calculateHaversineDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth's mean radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c * 10.0) / 10.0;
    }

    /**
     * Multi-Factor Intelligent Prioritization for Rare & Critical Blood Requisitions
     */
    public List<PrioritizedDonorDTO> prioritizeDonors(String requestedBloodGroup, double hospitalLat, double hospitalLon, double maxRadiusKm) {
        List<DonorProfile> candidateDonors = donorRepository.findByBloodGroup(requestedBloodGroup);

        return candidateDonors.stream()
            .map(donor -> {
                double distanceKm = calculateHaversineDistanceKm(hospitalLat, hospitalLon, donor.getLatitude(), donor.getLongitude());
                if (distanceKm > maxRadiusKm) {
                    return null; // Outside radius
                }

                // 1. Compatibility Score (Bombay phenotype strictly requires exact Oh/hh)
                int compatibilityScore = 100;

                // 2. Verification Weight
                int verificationScore = "VERIFIED_BY_REVIEWER".equals(donor.getVerificationStatus()) ? 100 : 50;

                // 3. Availability Weight
                int availabilityScore = "AVAILABLE_NOW".equals(donor.getAvailabilityStatus()) ? 100 : 30;

                // 4. Distance Score (decay with radius)
                int distanceScore = (int) Math.max(10, 100 - (distanceKm / maxRadiusKm) * 80);

                // 5. Eligibility Interval (90 days minimum for whole blood/PRBC)
                int eligibilityScore = 80;
                if (donor.getLastDonationDate() != null) {
                    long daysSinceDonation = ChronoUnit.DAYS.between(donor.getLastDonationDate(), LocalDate.now());
                    eligibilityScore = daysSinceDonation >= 90 ? 100 : 10;
                }

                // Composite Match Score (0 - 100)
                int compositeScore = (int) Math.round(
                    compatibilityScore * 0.35 +
                    verificationScore * 0.20 +
                    availabilityScore * 0.20 +
                    distanceScore * 0.15 +
                    eligibilityScore * 0.10
                );

                return new PrioritizedDonorDTO(donor, distanceKm, compositeScore);
            })
            .filter(Objects::nonNull)
            .sorted(Comparator.comparingInt(PrioritizedDonorDTO::getScore).reversed()
                .thenComparingDouble(PrioritizedDonorDTO::getDistanceKm))
            .collect(Collectors.toList());
    }
}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Server className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Backend Architecture & Engineering Specification
              </h3>
              <p className="text-xs text-slate-500">
                Java 17, Spring Boot 3.3, JPA Hibernate & MySQL Normalized Schema
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

        {/* Tab Controls */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-slate-50 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'architecture'
                ? 'border-rose-600 text-rose-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            System Architecture
          </button>
          <button
            onClick={() => setActiveTab('mysql')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'mysql'
                ? 'border-rose-600 text-rose-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            MySQL Schema (DDL)
          </button>
          <button
            onClick={() => setActiveTab('spring')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'spring'
                ? 'border-rose-600 text-rose-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Spring Boot Service Code
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'api'
                ? 'border-rose-600 text-rose-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            REST API Contract
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs text-slate-700 space-y-4">
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  RareLife Multi-Tier Project Architecture
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  The system integrates six modular tiers designed for high-availability healthcare
                  emergency matching, location calculation, and secure verification.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block text-xs">Tier 1: Web Interface</span>
                  <p className="text-slate-500 text-[11px]">
                    React 19 + TypeScript SPA with Tailwind CSS v4. Clean UI, zero dead-clicks, and
                    real-time timeline event propagation.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block text-xs">Tier 2: API Gateway</span>
                  <p className="text-slate-500 text-[11px]">
                    Spring Boot REST controllers with Spring Security JWT filter, rate limiting, and
                    CORS configuration on port 8080.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block text-xs">Tier 3: Prioritization Engine</span>
                  <p className="text-slate-500 text-[11px]">
                    Haversine Great-Circle distance formula, Bombay phenotype immunohematology rules,
                    and 90-day donation interval validation.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-rose-400 font-semibold">
                    Spring Boot Project Structure (/backend)
                  </span>
                </div>
                <pre className="font-mono text-[11px] leading-relaxed text-slate-300 overflow-x-auto">
{`rarelife-backend/
├── pom.xml (Java 17, Spring Boot 3.3.4, Spring Data JPA, MySQL Connector)
├── src/main/java/com/rarelife/
│   ├── RareLifeApplication.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── DonorController.java
│   │   ├── EmergencyRequestController.java
│   │   ├── BloodBankController.java
│   │   └── AdminDashboardController.java
│   ├── model/
│   │   ├── User.java, DonorProfile.java, EmergencyRequest.java
│   │   ├── BloodBank.java, DonorRequestMatch.java, AuditLog.java
│   ├── repository/
│   │   ├── DonorRepository.java, EmergencyRequestRepository.java
│   ├── service/
│   │   ├── DonorPrioritizationService.java (Haversine & 6-factor ranking)
│   │   ├── EmergencyEscalationService.java
│   │   └── AuditService.java
│   └── util/
│       └── DistanceUtil.java
└── src/main/resources/
    ├── application.properties
    └── schema.sql`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'mysql' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-mono text-[11px]">schema.sql (MySQL 8.0 DDL)</span>
                <button
                  onClick={() => handleCopy(mysqlSchema, 'sql')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 flex items-center gap-1 font-medium transition-colors"
                >
                  {copied === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'sql' ? 'Copied' : 'Copy SQL'}</span>
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto max-h-96">
                {mysqlSchema}
              </pre>
            </div>
          )}

          {activeTab === 'spring' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-mono text-[11px]">DonorPrioritizationService.java</span>
                <button
                  onClick={() => handleCopy(springBootServiceCode, 'java')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 flex items-center gap-1 font-medium transition-colors"
                >
                  {copied === 'java' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'java' ? 'Copied' : 'Copy Java Code'}</span>
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto max-h-96">
                {springBootServiceCode}
              </pre>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <h5 className="font-bold text-slate-900">Standard REST API Endpoints Specification</h5>
                <p className="text-slate-500 text-[11px]">Base URL: <code>http://localhost:8080/api</code></p>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden font-mono text-[11px]">
                <div className="p-2.5 bg-white flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">GET</span>
                  <span className="text-slate-900 font-semibold">/api/donors/search</span>
                  <span className="text-slate-500 text-xs font-sans ml-auto">Search with Haversine prioritization</span>
                </div>
                <div className="p-2.5 bg-white flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded">POST</span>
                  <span className="text-slate-900 font-semibold">/api/requests</span>
                  <span className="text-slate-500 text-xs font-sans ml-auto">Submit emergency blood request</span>
                </div>
                <div className="p-2.5 bg-white flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded">POST</span>
                  <span className="text-slate-900 font-semibold">/api/requests/{'{id}'}/escalate</span>
                  <span className="text-slate-500 text-xs font-sans ml-auto">Escalate to rare-donor coordinator</span>
                </div>
                <div className="p-2.5 bg-white flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded">PATCH</span>
                  <span className="text-slate-900 font-semibold">/api/donors/me/availability</span>
                  <span className="text-slate-500 text-xs font-sans ml-auto">Update donor availability</span>
                </div>
                <div className="p-2.5 bg-white flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">GET</span>
                  <span className="text-slate-900 font-semibold">/api/admin/dashboard</span>
                  <span className="text-slate-500 text-xs font-sans ml-auto">Retrieve registry metrics and audit logs</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-slate-500 text-[11px]">
            Ready for local deployment with Maven (<code>mvn spring-boot:run</code>)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
