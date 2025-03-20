package com.aegnr.IKYS.controller;

import com.aegnr.IKYS.dto.DtoCandidate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ICandidateController {

    public List<DtoCandidate> getAllCandidates();
    public DtoCandidate saveCandidate(DtoCandidate dtoCandidate);
    public DtoCandidate getCandidateByID(int id);
    public void deleteCandidate(int id);
    public DtoCandidate updateCandidate(int id, DtoCandidate updateDtoCandidate);
    public ResponseEntity<String> uploadFile(MultipartFile file, int candidateId); // Dosya yükleme metodu
    public ResponseEntity<byte[]> downloadCv(int id); // Dosya indirme metodu
}