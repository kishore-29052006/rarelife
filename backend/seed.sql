-- =====================================================================
-- RARELIFE: Seed Data for Demonstration & Testing
-- Includes Rare Phenotype Donors (Bombay Oh/hh, Rh-null, Kell-) and Blood Banks
-- =====================================================================

USE rarelife_db;

-- Insert Seed Donors
INSERT INTO donor (name, blood_group, rare_phenotype, latitude, longitude, available, last_donation_date, city, phone, verification_status)
VALUES
('Rajesh Varma', 'Bombay (Oh/hh)', 'Oh/hh phenotype confirmed via anti-H lectin saliva non-secretor', 19.0176, 72.8478, TRUE, '2026-06-10', 'Mumbai', '+91 98111 87654', 'VERIFIED_BY_REVIEWER'),
('Kavitha Sundaram', 'Bombay (Oh/hh)', 'Bombay Oh/hh phenotype validated by Apollo Immunohematology', 13.0827, 80.2707, TRUE, '2026-05-18', 'Chennai', '+91 94440 22319', 'VERIFIED_BY_REVIEWER'),
('Amitabh Nambiar', 'Rh-null (Golden Blood)', 'Regulator-type Rh-null lack of all 61 Rh antigens', 12.9716, 77.5946, TRUE, '2026-04-12', 'Bengaluru', '+91 97312 99811', 'VERIFIED_BY_REVIEWER'),
('Dr. Priya Menaria', 'Kell Negative (K-k+)', 'K- negative red cells for anti-Kell sensitized recipients', 18.5204, 73.8567, TRUE, '2026-06-25', 'Pune', '+91 98230 45678', 'VERIFIED_BY_REVIEWER'),
('Sneha Chawla', 'O-', 'Standard Universal Donor (Non-Bombay)', 28.6139, 77.2090, TRUE, '2026-07-01', 'New Delhi', '+91 98102 77334', 'VERIFIED_BY_REVIEWER'),
('Vikramaditya Roy', 'O-', 'Standard O Negative Donor', 18.9220, 72.8347, TRUE, '2026-05-15', 'Mumbai', '+91 98200 65432', 'VERIFIED_BY_REVIEWER'),
('Harpreet Singh', 'B-', 'Regular Donor (Deferred - Recent Donation)', 19.0330, 73.0297, FALSE, '2026-09-28', 'Navi Mumbai', '+91 97690 44556', 'VERIFIED_BY_REVIEWER');

-- Insert Seed Blood Banks
INSERT INTO blood_banks (id, organization_name, authorized_contact, official_phone, official_email, address, city, latitude, longitude, has_rare_blood_depot)
VALUES
('bb-1', 'KEM Hospital Blood Center & Rare Phenotype Depot', 'Dr. Arvind Swaminathan', '+91 22 2410 7000', 'transfusion@kemhospital.org', 'Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012', 'Mumbai', 19.0028, 72.8423, TRUE),
('bb-2', 'Apollo Speciality Blood Center & Cryo Depot', 'Dr. M. Sangeetha', '+91 44 2829 0200', 'bloodcenter@apollohospitals.com', '21 Greams Lane, Thousand Lights, Chennai, Tamil Nadu 600006', 'Chennai', 13.0604, 80.2496, TRUE),
('bb-3', 'Rotary Central Blood Bank & Rare Donor Registry', 'Dr. Rajesh Bhalla', '+91 11 2371 8989', 'emergency@rotarybloodbank.org', '56-57 Tughlakabad Institutional Area, New Delhi 110062', 'New Delhi', 28.5135, 77.2655, TRUE);
