import { BloodGroupType, DonorProfile, MatchStatus, PrioritizedDonorResult } from '../types';

/**
 * Calculates Great-Circle distance between two coordinates in kilometers
 * using the Haversine formula.
 * R = 6371 km (approximate radius of Earth).
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (
    lat1 === undefined ||
    lon1 === undefined ||
    lat2 === undefined ||
    lon2 === undefined ||
    isNaN(lat1) ||
    isNaN(lon1) ||
    isNaN(lat2) ||
    isNaN(lon2)
  ) {
    return 9999;
  }

  const R = 6371; // Earth's mean radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Round to one decimal place
  return Math.round(distance * 10) / 10;
}

/**
 * Medical Compatibility Matrix check for initial screening.
 * CRITICAL SAFETY NOTE:
 * Ordinary ABO/Rh compatibility rules do NOT apply to Bombay phenotype (Oh/hh)
 * or ultra-rare phenotypes. Bombay individuals lack H antigen and carry anti-H antibodies
 * that will violently hemolyze O-negative blood.
 */
export function checkPhenotypeCompatibility(
  requestedGroup: BloodGroupType,
  donorGroup: BloodGroupType
): { isCompatible: boolean; compatibilityScore: number; reason: string } {
  // 1. Bombay Phenotype Special Rule
  if (requestedGroup === 'Bombay (Oh/hh)') {
    if (donorGroup === 'Bombay (Oh/hh)') {
      return {
        isCompatible: true,
        compatibilityScore: 100,
        reason: 'Exact rare Bombay phenotype (Oh/hh) match recorded.',
      };
    }
    return {
      isCompatible: false,
      compatibilityScore: 0,
      reason:
        'INCOMPATIBLE: Patient with Bombay phenotype produces potent anti-H antibodies and cannot receive standard O-negative or any ABO blood.',
    };
  }

  // 2. Rh-null Special Rule
  if (requestedGroup === 'Rh-null (Golden Blood)') {
    if (donorGroup === 'Rh-null (Golden Blood)') {
      return {
        isCompatible: true,
        compatibilityScore: 100,
        reason: 'Exact Rh-null match. Crucial for anti-total-Rh alloimmunized patients.',
      };
    }
    return {
      isCompatible: false,
      compatibilityScore: 0,
      reason: 'INCOMPATIBLE: Rh-null patients require blood devoid of all Rh system antigens.',
    };
  }

  // 3. Kell Negative Rule
  if (requestedGroup === 'Kell Negative (K-k+)') {
    if (donorGroup === 'Kell Negative (K-k+)') {
      return {
        isCompatible: true,
        compatibilityScore: 100,
        reason: 'Kell antigen negative match verified.',
      };
    }
    return {
      isCompatible: false,
      compatibilityScore: 10,
      reason: 'Kell antigen status unverified. Risk of severe anti-Kell hemolysis.',
    };
  }

  // 4. Duffy Null Rule
  if (requestedGroup === 'Duffy Null (Fy(a-b-))') {
    if (donorGroup === 'Duffy Null (Fy(a-b-))') {
      return {
        isCompatible: true,
        compatibilityScore: 100,
        reason: 'Duffy null phenotype match.',
      };
    }
    return {
      isCompatible: false,
      compatibilityScore: 0,
      reason: 'Duffy antigens present; incompatible with anti-Fy3 / alloantibody profile.',
    };
  }

  // 5. Exact match for standard groups
  if (requestedGroup === donorGroup) {
    return {
      isCompatible: true,
      compatibilityScore: 100,
      reason: `Exact blood group match (${donorGroup}).`,
    };
  }

  // 6. Standard ABO/Rh compatibility hierarchy (for non-rare cases)
  const standardCompatibility: Record<string, string[]> = {
    'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
    'AB-': ['AB-', 'A-', 'B-', 'O-'],
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-'],
  };

  const compatibleDonors = standardCompatibility[requestedGroup] || [];
  if (compatibleDonors.includes(donorGroup)) {
    // Exact match is preferred over universal donor
    const score = donorGroup === requestedGroup ? 100 : donorGroup === 'O-' ? 85 : 75;
    return {
      isCompatible: true,
      compatibilityScore: score,
      reason: `Standard red cell compatibility: ${donorGroup} may be accepted for ${requestedGroup} pending crossmatch.`,
    };
  }

  return {
    isCompatible: false,
    compatibilityScore: 0,
    reason: `Incompatible ABO/Rh: ${donorGroup} cannot be given to ${requestedGroup}.`,
  };
}

/**
 * Checks eligibility based on last donation date (minimum 90 days required for red cells)
 */
export function checkDonationEligibility(lastDonationDate?: string): {
  isEligible: boolean;
  score: number;
  message: string;
} {
  if (!lastDonationDate) {
    return {
      isEligible: true,
      score: 85,
      message: 'No previous donation on record or self-reported eligible.',
    };
  }

  const last = new Date(lastDonationDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 3600 * 24));

  if (diffDays >= 90) {
    return {
      isEligible: true,
      score: 100,
      message: `Eligible: ${diffDays} days elapsed since last donation (minimum 90 days satisfied).`,
    };
  } else {
    const daysRemaining = 90 - diffDays;
    return {
      isEligible: false,
      score: 10,
      message: `Temporarily deferred: Donated ${diffDays} days ago. ${daysRemaining} days remaining for safe interval.`,
    };
  }
}

/**
 * Multi-Factor Intelligent Prioritization Ranking Engine
 * Combines 6 transparent dimensions:
 * 1. Blood group / phenotype compatibility (weight: 35%)
 * 2. Verification status (weight: 20%)
 * 3. Availability and confirmation recency (weight: 20%)
 * 4. Geographic distance (weight: 15%)
 * 5. Eligibility cooldown interval (weight: 10%)
 */
export function prioritizeDonors(
  donors: DonorProfile[],
  requiredBloodGroup: BloodGroupType,
  requestLat: number,
  requestLon: number,
  maxRadiusKm: number = 200
): PrioritizedDonorResult[] {
  const scoredDonors: PrioritizedDonorResult[] = [];

  for (const donor of donors) {
    // 1. Compatibility
    const comp = checkPhenotypeCompatibility(requiredBloodGroup, donor.bloodGroup);
    if (!comp.isCompatible) {
      continue; // Filter out medically incompatible donors
    }

    // 2. Distance
    const distanceKm = calculateHaversineDistance(
      requestLat,
      requestLon,
      donor.latitude,
      donor.longitude
    );

    // Skip donors outside current search radius unless expanded
    if (distanceKm > maxRadiusKm) {
      continue;
    }

    // Distance Score (0 to 100): closer is higher
    let distanceScore = 100;
    if (distanceKm > 10) {
      distanceScore = Math.max(10, Math.round(100 - (distanceKm / maxRadiusKm) * 80));
    }

    // 3. Verification Score
    let verificationScore = 40;
    if (donor.verificationStatus === 'VERIFIED_BY_REVIEWER') {
      verificationScore = 100;
    } else if (donor.verificationStatus === 'VERIFICATION_PENDING') {
      verificationScore = 65;
    } else if (donor.verificationStatus === 'EXPIRED_OR_NEEDS_REVIEW') {
      verificationScore = 45;
    }

    // 4. Availability Score
    let availabilityScore = 30;
    if (donor.availabilityStatus === 'AVAILABLE_NOW') {
      availabilityScore = 100;
      // Bonus if confirmed in last 24 hours
      const confirmedAt = new Date(donor.lastAvailabilityConfirmedAt).getTime();
      const hoursAgo = (Date.now() - confirmedAt) / (1000 * 3600);
      if (hoursAgo > 48) {
        availabilityScore = 85;
      }
    } else if (donor.availabilityStatus === 'BUSY_TEMPORARY') {
      availabilityScore = 45;
    } else {
      availabilityScore = 15;
    }

    // 5. Eligibility Score
    const eligibility = checkDonationEligibility(donor.lastDonationDate);

    // Weighted Overall Match Score (out of 100)
    const matchScore = Math.round(
      comp.compatibilityScore * 0.35 +
        verificationScore * 0.2 +
        availabilityScore * 0.2 +
        distanceScore * 0.15 +
        eligibility.score * 0.1
    );

    // Determine clear match label
    let matchLabel: MatchStatus = 'POTENTIAL_MATCH';
    if (!eligibility.isEligible || donor.availabilityStatus === 'UNAVAILABLE') {
      matchLabel = 'NOT_CURRENTLY_AVAILABLE';
    } else if (donor.preferredContact === 'THROUGH_BLOOD_BANK_ONLY') {
      matchLabel = 'CONTACT_THROUGH_BLOOD_BANK';
    } else if (donor.verificationStatus === 'VERIFIED_BY_REVIEWER') {
      matchLabel = 'BLOOD_GROUP_VERIFIED';
    } else if (donor.availabilityStatus === 'AVAILABLE_NOW') {
      matchLabel = 'AVAILABILITY_CONFIRMED';
    }

    scoredDonors.push({
      donor,
      approximateDistanceKm: distanceKm,
      matchScore,
      matchLabel,
      eligibilityMessage: eligibility.message,
      rank: 0,
      breakdown: {
        bloodMatchScore: comp.compatibilityScore,
        availabilityScore,
        distanceScore,
        verificationScore,
        eligibilityScore: eligibility.score,
      },
    });
  }

  // Sort descending by match score, then ascending by distance
  scoredDonors.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return a.approximateDistanceKm - b.approximateDistanceKm;
  });

  // Assign 1-indexed ranks
  return scoredDonors.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}
