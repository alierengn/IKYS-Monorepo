package com.aegnr.IKYS.dto;

import com.aegnr.IKYS.entities.Candidate;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Base64;

@Data
@NoArgsConstructor
public class DtoCandidate {

    private int id;
    private String firstName;
    private String lastName;
    private String position;
    private String militaryStatus;
    private String noticePeriod;
    private String phone;
    private String email;

    @JsonIgnore
    private byte[] cv;

    @JsonProperty("cvBase64")
    public String getCvBase64() {
        if (this.cv != null) {
            return Base64.getEncoder().encodeToString(this.cv);
        }
        return null;
    }

    @JsonProperty("cvBase64")
    public void setCvBase64(String cvBase64) {
        if (cvBase64 != null && !cvBase64.isEmpty()) {
            try {
                this.cv = Base64.getDecoder().decode(cvBase64);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Geçersiz Base64 verisi: " + e.getMessage());
            }
        } else {
            this.cv = null;
        }
    }

    public DtoCandidate(Candidate candidate) {
        this.id = candidate.getId();
        this.firstName = candidate.getFirstName();
        this.lastName = candidate.getLastName();
        this.position = candidate.getPosition();
        this.militaryStatus = candidate.getMilitaryStatus();
        this.noticePeriod = candidate.getNoticePeriod();
        this.phone = candidate.getPhone();
        this.email = candidate.getEmail();
        this.cv = candidate.getCv();
    }

    public Candidate toEntity() {
        Candidate candidate = new Candidate();
        candidate.setId(this.id);
        candidate.setFirstName(this.firstName);
        candidate.setLastName(this.lastName);
        candidate.setPosition(this.position);
        candidate.setMilitaryStatus(this.militaryStatus);
        candidate.setNoticePeriod(this.noticePeriod);
        candidate.setPhone(this.phone);
        candidate.setEmail(this.email);
        candidate.setCv(this.cv);
        return candidate;
    }
}