package com.aegnr.IKYS.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aegnr.IKYS.entities.Candidate;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Integer> {

}
