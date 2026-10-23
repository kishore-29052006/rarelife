package com.rarelife.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "donor")
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 32)
    private String bloodGroup;

    private String rarePhenotype;

    private double latitude;

    private double longitude;

    private boolean available;

    private LocalDate lastDonationDate;

    private String city;

    private String phone;

    private String verificationStatus;

    public Donor() {}

    public Donor(Long id, String name, String bloodGroup, double latitude, double longitude, boolean available, LocalDate lastDonationDate) {
        this.id = id;
        this.name = name;
        this.bloodGroup = bloodGroup;
        this.latitude = latitude;
        this.longitude = longitude;
        this.available = available;
        this.lastDonationDate = lastDonationDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getRarePhenotype() { return rarePhenotype; }
    public void setRarePhenotype(String rarePhenotype) { this.rarePhenotype = rarePhenotype; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public LocalDate getLastDonationDate() { return lastDonationDate; }
    public void setLastDonationDate(LocalDate lastDonationDate) { this.lastDonationDate = lastDonationDate; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }
}
