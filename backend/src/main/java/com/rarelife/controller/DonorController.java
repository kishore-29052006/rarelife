package com.rarelife.controller;

import com.rarelife.model.Donor;
import com.rarelife.service.DonorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donors")
@CrossOrigin(origins = "*")
public class DonorController {

    @Autowired
    private DonorService donorService;

    @GetMapping
    public List<Donor> getDonors(
            @RequestParam String bloodGroup,
            @RequestParam double lat,
            @RequestParam double lon) {
        return donorService.findBestDonors(bloodGroup, lat, lon);
    }

    @PostMapping
    public ResponseEntity<Donor> registerDonor(@RequestBody Donor donor) {
        Donor saved = donorService.saveDonor(donor);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/all")
    public List<Donor> getAll() {
        return donorService.getAllDonors();
    }
}
