package com.rarelife.service;

import com.rarelife.model.Donor;
import com.rarelife.repository.DonorRepository;
import com.rarelife.util.DistanceUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonorService {

    @Autowired
    private DonorRepository donorRepository;

    /**
     * Finds and ranks matching blood donors by availability and geodesic distance.
     */
    public List<Donor> findBestDonors(String bloodGroup, double userLat, double userLon) {
        List<Donor> donors = donorRepository.findByBloodGroup(bloodGroup);

        return donors.stream()
                .filter(Donor::isAvailable)
                .sorted((d1, d2) -> {
                    double dist1 = DistanceUtil.calculate(userLat, userLon, d1.getLatitude(), d1.getLongitude());
                    double dist2 = DistanceUtil.calculate(userLat, userLon, d2.getLatitude(), d2.getLongitude());
                    return Double.compare(dist1, dist2);
                })
                .collect(Collectors.toList());
    }

    public Donor saveDonor(Donor donor) {
        return donorRepository.save(donor);
    }

    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }
}
