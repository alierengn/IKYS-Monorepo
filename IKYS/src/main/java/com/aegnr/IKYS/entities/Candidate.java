package com.aegnr.IKYS.entities;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "IKYS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class Candidate {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "first_name", nullable = false, length = 40)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "position")
    private String position;

    @Column(name = "military_status")
    private String militaryStatus;

    @Column(name = "notice_period")
    private String noticePeriod;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    @Email(message = "Email formatında bir mail giriniz!")
    private String email;

    @Lob
    @Column(name = "cv")
    private byte[] cv;
}