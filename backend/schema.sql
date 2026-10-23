-- =====================================================================
-- RARELIFE: Intelligent Rare Blood Donor Discovery & Emergency Matching
-- Database Schema: MySQL 8.0+
-- Panimalar Engineering College / Transfusion Informatics Project
-- =====================================================================

CREATE DATABASE IF NOT EXISTS rarelife_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rarelife_db;

-- 1. Users Table (Core Auth & Roles)
CREATE TABLE IF NOT EXISTS users (
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

-- 2. Donor Table (Standard & Rare Phenotype Profiles)
CREATE TABLE IF NOT EXISTS donor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    blood_group VARCHAR(32) NOT NULL,
    rare_phenotype VARCHAR(255),
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    last_donation_date DATE,
    city VARCHAR(80),
    phone VARCHAR(32),
    verification_status VARCHAR(64) DEFAULT 'UNVERIFIED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_donor_bg (blood_group),
    INDEX idx_donor_avail (available)
);

-- 3. Emergency Requests Table
CREATE TABLE IF NOT EXISTS emergency_requests (
    id VARCHAR(36) PRIMARY KEY,
    request_number VARCHAR(32) NOT NULL UNIQUE,
    requester_id VARCHAR(36) NOT NULL,
    hospital_name VARCHAR(180) NOT NULL,
    hospital_contact VARCHAR(80) NOT NULL,
    doctor_in_charge VARCHAR(120),
    required_blood_group VARCHAR(64) NOT NULL,
    required_phenotype_details TEXT,
    is_rare_phenotype_case BOOLEAN NOT NULL DEFAULT FALSE,
    component_type VARCHAR(64) NOT NULL,
    units_required INT NOT NULL DEFAULT 1,
    city VARCHAR(80) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    required_by TIMESTAMP NOT NULL,
    urgency VARCHAR(64) NOT NULL,
    medical_confirmation_status VARCHAR(64) DEFAULT 'PENDING_CONFIRMATION',
    request_status VARCHAR(64) NOT NULL DEFAULT 'SEARCHING_FOR_DONORS',
    notes TEXT,
    assigned_blood_bank_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_req_status (request_status),
    INDEX idx_req_bg (required_blood_group)
);

-- 4. Blood Banks Table
CREATE TABLE IF NOT EXISTS blood_banks (
    id VARCHAR(36) PRIMARY KEY,
    organization_name VARCHAR(180) NOT NULL,
    authorized_contact VARCHAR(120) NOT NULL,
    official_phone VARCHAR(40) NOT NULL,
    official_email VARCHAR(120) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(80) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    has_rare_blood_depot BOOLEAN NOT NULL DEFAULT FALSE
);

-- 5. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    actor_user_id VARCHAR(36) NOT NULL,
    actor_name VARCHAR(120) NOT NULL,
    action VARCHAR(80) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    details TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
