# RareLife — REST API Documentation (Spring Boot & Express Contract)

Base URL: `http://localhost:8080/api`

---

### 1. Authentication Endpoints

#### `POST /api/auth/register`
Creates a new patient, donor, or hospital coordinator account.
- **Request Body:**
```json
{
  "fullName": "Rohan Verma",
  "email": "rohan.verma@example.com",
  "phone": "+91 98201 44512",
  "password": "SecurePassword123!",
  "role": "PATIENT"
}
```
- **Response `201 Created`:**
```json
{
  "id": "usr-173900123",
  "fullName": "Rohan Verma",
  "email": "rohan.verma@example.com",
  "role": "PATIENT",
  "accountStatus": "ACTIVE"
}
```

#### `POST /api/auth/login`
Authenticates a user and returns a signed JWT bearer token.
- **Request Body:**
```json
{
  "email": "rohan.verma@example.com",
  "password": "SecurePassword123!"
}
```
- **Response `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "usr-patient-1", "role": "PATIENT", "fullName": "Rohan Verma" }
}
```

---

### 2. Donor Search & Discovery Endpoints

#### `GET /api/donors/search`
Discovers and ranks candidate blood donors using the 6-factor prioritization engine and geodesic Haversine distance formula.
- **Query Parameters:**
  - `bloodGroup` (String, required): e.g. `Bombay (Oh/hh)` or `O-`
  - `lat` (Double, required): e.g. `19.0028`
  - `lon` (Double, required): e.g. `72.8423`
  - `radiusKm` (Double, optional, default: `200`): e.g. `150`
- **Response `200 OK`:**
```json
[
  {
    "donor": {
      "id": "dnr-101",
      "fullName": "Rajesh Varma",
      "bloodGroup": "Bombay (Oh/hh)",
      "rarePhenotypeDetails": "Oh/hh phenotype confirmed via anti-H lectin testing",
      "isRareBlood": true,
      "verificationStatus": "VERIFIED_BY_REVIEWER",
      "availabilityStatus": "AVAILABLE_NOW",
      "city": "Mumbai",
      "latitude": 19.0176,
      "longitude": 72.8478
    },
    "approximateDistanceKm": 3.2,
    "matchScore": 96,
    "matchLabel": "BLOOD_GROUP_VERIFIED",
    "rank": 1
  }
]
```

#### `PATCH /api/donors/me/availability`
Updates a donor's immediate emergency availability status and records the confirmation timestamp.
- **Request Body:**
```json
{
  "availabilityStatus": "AVAILABLE_NOW"
}
```

---

### 3. Emergency Requisition & Escalation Endpoints

#### `POST /api/requests`
Submits a clinical blood requisition from a hospital ICU or patient caregiver.
- **Request Body:**
```json
{
  "hospitalName": "Tata Memorial Hospital / KEM Advanced Center",
  "hospitalContact": "+91 22 2417 7000",
  "requiredBloodGroup": "Bombay (Oh/hh)",
  "componentType": "PACKED_RED_CELLS",
  "unitsRequired": 2,
  "city": "Mumbai",
  "latitude": 19.0028,
  "longitude": 72.8423,
  "urgency": "CRITICAL_IMMEDIATE",
  "requiredBy": "2026-10-14T06:00:00Z"
}
```

#### `POST /api/requests/{id}/escalate`
Triggers the multi-tier guided escalation workflow when local units are exhausted.
- **Request Body:**
```json
{
  "escalationReason": "Local radius search exhausted. Immediate rare cryo-depot mobilization required.",
  "targetBloodBankId": "bb-1"
}
```

#### `POST /api/matches/{id}/respond`
Records donor acceptance or decline for a requisition match.
- **Request Body:**
```json
{
  "response": "ACCEPTED",
  "note": "Ready to report to hospital transfusion desk within 90 minutes."
}
```

---

### 4. Admin & Blood Bank Endpoints

#### `GET /api/admin/dashboard`
Returns live system health metrics, demographic phenotype distributions, and audit records.
