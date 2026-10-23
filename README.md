# RareLife — Intelligent Rare Blood Donor Discovery & Emergency Matching Platform

**Project Title:** Rare Blood Donor Discovery and Emergency Matching System Using Geolocation and Intelligent Prioritization  
**Institution:** Department of Information Technology, Panimalar Engineering College (Affiliated to Anna University, Chennai)

---

## 1. Project Overview

**RareLife** is a healthcare web platform engineered specifically for **emergency rare-blood donor discovery**, **immunohematology cross-check validation**, and **guided multi-tier escalation**.

Standard donor platforms focus only on broad ABO/Rh lists. However, during medical emergencies involving ultra-rare blood phenotypes—such as the **Bombay phenotype (Oh/hh)**, **Rh-null (Golden Blood)**, or patients sensitized with clinically significant red-cell alloantibodies (e.g., anti-Kell, anti-Duffy)—ordinary matching algorithms fail dangerously. For instance, transfusing universal O-negative blood into a Bombay phenotype recipient triggers acute, fatal hemolytic transfusion reactions due to high-titer anti-H antibodies.

RareLife addresses this critical gap through:
1. **Dedicated Rare Phenotype Matching Engine**: Strict biological phenotype validation ensuring incompatible standard blood groups (such as O- into Bombay Oh/hh) are immediately flagged and excluded.
2. **Haversine Geodesic Distance Calculation**: Real-time distance computation between treating hospitals and registered donors using latitude and longitude coordinates.
3. **Multi-Factor Intelligent Prioritization**: 6-dimension weighted ranking combining phenotype compatibility (35%), verification status (20%), availability confirmation recency (20%), geographic proximity (15%), and 90-day safe donation cooldown (10%).
4. **Emergency Escalation System**: When no local donors are within immediate reach, the system guides clinicians through radius expansion, hospital cryo-depot mobilization, and national rare-donor coordinator liaison.
5. **Real-Time Event Timeline**: Case timelines dynamically constructed from verified application events (audited timestamps, authorized actor signatures).
6. **Role-Based Portals**: Tailored interfaces for Patients/Caregivers, Rare Donors, Hospital Transfusion Centers/Blood Banks, and System Administrators.

---

## 2. Technology Stack

### Frontend
- **Framework:** React 19 SPA with TypeScript
- **Styling:** Tailwind CSS v4 (`@import "tailwindcss";`), Plus Jakarta Sans & JetBrains Mono typography
- **Icons:** Lucide React
- **Client Persistence:** Local reactive store with `localStorage` persistence and typed `apiClient` abstraction layer.

### Backend (Spring Boot Reference Architecture)
- **Language / Runtime:** Java 17+ (LTS)
- **Framework:** Spring Boot 3.3.x (Spring Web, Spring Data JPA, Spring Security, Bean Validation)
- **Database:** MySQL 8.0+
- **Build Tool:** Apache Maven 3.9+
- **Location Calculation:** Geodesic Great-Circle Haversine Formula (`DistanceUtil.java`)

---

## 3. Database Schema Overview

The database (`rarelife_db`) includes normalized relational tables:
1. `users`: User identity, authentication hash, role (`PATIENT`, `DONOR`, `BLOOD_BANK`, `ADMIN`), and account status.
2. `donor`: Donor profiles, blood group, rare phenotype notes, latitude/longitude, availability, last donation date, and verification status.
3. `emergency_requests`: Active hospital requisitions, required blood group, units, hospital coordinates, deadline, urgency, and assigned coordinator.
4. `donor_request_matches`: Matching records with Haversine distance, match scores, contact status, and donor responses (`ACCEPTED`, `DECLINED`).
5. `blood_banks`: Licensed blood banks with rare cryogenic depots, inventory records, and 24/7 emergency dispatch desks.
6. `request_escalations`: Formal escalation records documenting reasons, expanding radius, and coordinator interventions.
7. `audit_logs`: Immutable clinical compliance audit trail recording all verifications, status changes, and dispatch calls.

---

## 4. How to Run the Application

### Running the Frontend (Vite + React)
```bash
# 1. Install dependencies
npm install

# 2. Run the development server (runs on port 3000)
npm run dev

# 3. Build for production
npm run build
```

### Running the Spring Boot Backend (Java 17 + MySQL)
```bash
# 1. Navigate to the backend directory
cd backend

# 2. Configure MySQL Database
mysql -u root -p < schema.sql
mysql -u root -p < seed.sql

# 3. Update database credentials in backend/src/main/resources/application.properties:
# spring.datasource.username=root
# spring.datasource.password=your_password

# 4. Compile and launch with Maven
mvn clean spring-boot:run

# The REST APIs will start on http://localhost:8080/api
```

---

## 5. Medical Safety & Clinical Protocols

- **Never Transfuse Without Bedside Crossmatch**: RareLife is an intelligent donor discovery and coordination tool. ABO/Rh grouping and algorithm matching do not replace accredited laboratory serological crossmatching.
- **Bombay Phenotype Transfusion Rule**: Transfusing standard O-negative blood into a Bombay phenotype recipient is fatal due to anti-H antibodies. Only confirmed Oh/hh units may be transfused.
- **Privacy Assurance**: Sensitive phone numbers and home addresses are never published to the public internet; clinical contact is strictly routed through authorized hospital transfusion services.
