package com.aegnr.IKYS.services;

import com.aegnr.IKYS.dto.DtoCandidate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ICandidateService {

    public List<DtoCandidate> getAllCandidates();
    public DtoCandidate saveCandidate(DtoCandidate dtoCandidate);
    public DtoCandidate getCandidateByID(int id);
    public void deleteCandidate(int id);
    public DtoCandidate updateCandidate(int id, DtoCandidate updateDtoCandidate);
    public void uploadFile(MultipartFile file, int candidateId) throws IOException; // Dosya yükleme metodu
    public byte[] downloadCv(int id); // Dosya indirme metodu
}