import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CandidateService } from '../services/candidate.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab2Page implements OnInit {
  candidate: any = {
    firstName: '',
    lastName: '',
    position: '',
    phone: '',
    email: '',
    militaryStatus: '',
    noticePeriod: '',
    cvBase64: null
  };
  isEditMode = false;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private candidateService: CandidateService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadCandidate(+id);
    }
  }

  loadCandidate(id: number) {
    this.candidateService.getCandidateById(id).subscribe(
      data => {
        this.candidate = data;
        if (this.candidate.cvBase64) {
          this.selectedFileName = `candidate-${id}-cv.pdf`; // Varsayılan bir isim
        }
      },
      error => {
        console.error('Aday yüklenirken hata:', error);
      }
    );
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Lütfen yalnızca PDF veya Word dosyası yükleyin.');
        input.value = '';
        return;
      }
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.selectedFileName = null;
    this.candidate.cvBase64 = null;
  }

  async saveCandidate() {
    // cvBase64'ü sıfırlamak yerine mevcut değeri koru
    const candidateToSend = { ...this.candidate };
  
    if (this.isEditMode) {
      if (this.selectedFile) {
        // Yeni bir dosya seçildiyse, dosyayı yükle
        await this.uploadFile(this.selectedFile);
        // Dosya yüklendikten sonra cvBase64'ü sıfırla, çünkü zaten backend'de cv güncellendi
        candidateToSend.cvBase64 = null;
      }
      // Yeni dosya yüklenmediyse, cvBase64 mevcut haliyle kalır ve backend'de cv korunur
      console.log('Güncelleme isteği gönderiliyor:', candidateToSend);
      this.candidateService.updateCandidate(this.candidate.id, candidateToSend).subscribe(
        () => {
          console.log('Aday güncellendi:', this.candidate);
          this.router.navigate(['/tabs/tab3', this.candidate.id]);
        },
        error => {
          console.error('Güncelleme hatası:', error);
        }
      );
    } else {
      this.candidateService.addCandidate(candidateToSend).subscribe(
        async (newCandidate) => {
          if (this.selectedFile) {
            await this.uploadFile(this.selectedFile, newCandidate.id);
            console.log('Dosya yükleme tamamlandı, candidateId:', newCandidate.id);
            console.log('Yeni aday eklendi ve CV yüklendi:', newCandidate);
            this.router.navigate(['/tabs/tab1']);
          } else {
            console.log('Yeni aday eklendi:', newCandidate);
            this.router.navigate(['/tabs/tab1']);
          }
        },
        error => {
          console.error('Aday ekleme hatası:', error);
        }
      );
    }
  }
  private async uploadFile(file: File, candidateId?: number) {
    const formData = new FormData();
    formData.append('file', file);
    const idToSend = candidateId ? candidateId.toString() : this.candidate.id.toString();
    formData.append('candidateId', idToSend);
    console.log('Dosya yükleniyor, candidateId:', idToSend, 'Dosya adı:', file.name);
  
    const response = await fetch('http://localhost:8080/rest/api/candidate/upload', {
      method: 'POST',
      body: formData
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dosya yükleme hatası:', errorText);
      throw new Error(errorText);
    } else {
      const responseText = await response.text();
      console.log('Dosya yükleme başarılı:', responseText);
    }
  }

  downloadCv() {
    if (this.candidate && this.candidate.id) {
      this.candidateService.downloadCv(this.candidate.id).subscribe(
        (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `candidate-${this.candidate.id}-cv.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        error => {
          console.error('CV indirme hatası:', error);
          alert('CV indirilirken bir hata oluştu.');
        }
      );
    }
  }
}