package com.aegnr.IKYS.services.impl;

import com.aegnr.IKYS.dto.DtoCandidate;
import com.aegnr.IKYS.entities.Candidate;
import com.aegnr.IKYS.repository.CandidateRepository;
import com.aegnr.IKYS.services.ICandidateService;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CandidateServiceImpl implements ICandidateService {

    @Autowired
    private CandidateRepository candidateRepository;

    @Override
    @Transactional
    public void uploadFile(MultipartFile file, int candidateId) throws IOException {
        System.out.println("uploadFile çağrıldı, candidateId: " + candidateId);
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Aday bulunamadı: " + candidateId));
        byte[] fileBytes = file.getBytes();
        System.out.println("Dosya boyutu: " + fileBytes.length + " bayt");
        candidate.setCv(fileBytes);
        candidateRepository.save(candidate);
        System.out.println("Dosya yüklendi, candidateId: " + candidateId + ", CV boyutu: " + (candidate.getCv() != null ? candidate.getCv().length : 0));
        // Kaydedilen veriyi kontrol etmek için tekrar oku
        Candidate updatedCandidate = candidateRepository.findById(candidateId).orElse(null);
        if (updatedCandidate != null) {
            System.out.println("Veritabanından okunan CV boyutu: " + (updatedCandidate.getCv() != null ? updatedCandidate.getCv().length : 0));
        }
    }
    
    @Override
    public List<DtoCandidate> getAllCandidates() {
        return candidateRepository.findAll().stream()
                .map(DtoCandidate::new)
                .collect(Collectors.toList());
    }

    @Override
    public DtoCandidate saveCandidate(DtoCandidate dtoCandidate) {
        Candidate candidate = dtoCandidate.toEntity();
        Candidate savedCandidate = candidateRepository.save(candidate);
        return new DtoCandidate(savedCandidate);
    }

    @Override
    public DtoCandidate getCandidateByID(int id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aday bulunamadı: " + id));
        return new DtoCandidate(candidate);
    }

    @Override
    public void deleteCandidate(int id) {
        candidateRepository.deleteById(id);
    }

    @Override
    public DtoCandidate updateCandidate(int id, DtoCandidate updateDtoCandidate) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aday bulunamadı: " + id));
        candidate.setFirstName(updateDtoCandidate.getFirstName());
        candidate.setLastName(updateDtoCandidate.getLastName());
        candidate.setPosition(updateDtoCandidate.getPosition());
        candidate.setMilitaryStatus(updateDtoCandidate.getMilitaryStatus());
        candidate.setNoticePeriod(updateDtoCandidate.getNoticePeriod());
        candidate.setPhone(updateDtoCandidate.getPhone());
        candidate.setEmail(updateDtoCandidate.getEmail());
        if (updateDtoCandidate.getCv() != null) {
            candidate.setCv(updateDtoCandidate.getCv());
        }
        Candidate updatedCandidate = candidateRepository.save(candidate);
        return new DtoCandidate(updatedCandidate);
    }

    @Override
    public byte[] downloadCv(int id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aday bulunamadı: " + id));
        return candidate.getCv();
    }
}