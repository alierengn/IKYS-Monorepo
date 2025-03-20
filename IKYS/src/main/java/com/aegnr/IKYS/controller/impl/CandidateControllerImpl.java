package com.aegnr.IKYS.controller.impl;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aegnr.IKYS.controller.ICandidateController;
import com.aegnr.IKYS.dto.DtoCandidate;
import com.aegnr.IKYS.services.impl.CandidateServiceImpl;

@RestController
@RequestMapping("/rest/api/candidate")
public class CandidateControllerImpl implements ICandidateController {
	@Autowired
    private CandidateServiceImpl candidateServiceImpl;

    @GetMapping(path = "/list")
    @Override
    public List<DtoCandidate> getAllCandidates() {
        return candidateServiceImpl.getAllCandidates();
    }

    @GetMapping(path = "/list/{id}")
    @Override
    public DtoCandidate getCandidateByID(@PathVariable(name = "id") int id) {
        return candidateServiceImpl.getCandidateByID(id);
    }

    @PostMapping(path = "/save")
    @Override
    public DtoCandidate saveCandidate(@RequestBody DtoCandidate dtoCandidate) {
        return candidateServiceImpl.saveCandidate(dtoCandidate);
    }

    @PutMapping(path = "/update/{id}")
    @Override
    public DtoCandidate updateCandidate(@PathVariable(name = "id") int id, @RequestBody DtoCandidate dtoCandidate) {
        return candidateServiceImpl.updateCandidate(id, dtoCandidate);
    }

    @DeleteMapping(path = "/delete/{id}")
    @Override
    public void deleteCandidate(@PathVariable(name = "id") int id) {
        candidateServiceImpl.deleteCandidate(id);
    }

    @PostMapping(path = "/upload")
    @Override
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("candidateId") int candidateId) {
        try {
            System.out.println("uploadFile endpoint’i çağrıldı, candidateId: " + candidateId + ", Dosya adı: " + file.getOriginalFilename());
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Yüklenen dosya boş.");
            }
            String contentType = file.getContentType();
            System.out.println("Dosya türü: " + contentType);
            if (!("application/pdf".equals(contentType) ||
                  "application/msword".equals(contentType) ||
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document".equals(contentType))) {
                return ResponseEntity.badRequest().body("Lütfen yalnızca PDF veya Word dosyası yükleyin.");
            }
            candidateServiceImpl.uploadFile(file, candidateId);
            return ResponseEntity.ok("Dosya başarıyla yüklendi.");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Dosya yüklenirken hata oluştu: " + e.getMessage());
        }
    }

    @GetMapping(path = "/download-cv/{id}")
    @Override
    public ResponseEntity<byte[]> downloadCv(@PathVariable("id") int id) {
        byte[] cvData = candidateServiceImpl.downloadCv(id);
        if (cvData == null) {
            return ResponseEntity.status(404).body(null);
        }
        String fileName = "candidate-" + id + "-cv.pdf";
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header("Content-Disposition", "attachment; filename=\"" + fileName + "\"")
                .body(cvData);
    }
}