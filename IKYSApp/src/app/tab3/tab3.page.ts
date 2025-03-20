import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CandidateService } from '../services/candidate.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab3Page implements OnInit {
  candidate: any = null;
  private routeSub: Subscription | null = null;
  isLoading = false; // Yükleme göstergesi için

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private candidateService: CandidateService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadCandidate(+id);
      } else {
        console.error('Geçersiz ID: ID bulunamadı');
        this.router.navigate(['/tabs/tab1']);
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  loadCandidate(id: number) {
    this.isLoading = true;
    this.candidateService.getCandidateById(id).subscribe(
      data => {
        if (data && data.id && data.id > 0) {
          this.candidate = data;
          console.log('Aday yüklendi:', this.candidate);
          if (this.candidate.cvBase64) {
            console.log('CV mevcut, cvBase64:', this.candidate.cvBase64);
          } else {
            console.log('CV mevcut değil');
          }
        } else {
          console.error('Aday bulunamadı veya geçersiz veri:', data);
          this.router.navigate(['/tabs/tab1']);
        }
        this.isLoading = false;
      },
      error => {
        console.error('Aday yüklenirken hata:', error);
        this.router.navigate(['/tabs/tab1']);
        this.isLoading = false;
      }
    );
  }

  editCandidate() {
    if (this.candidate && this.candidate.id && this.candidate.id > 0) {
      this.router.navigate(['/tabs/tab2', this.candidate.id]);
    } else {
      console.error('Geçersiz aday ID’si:', this.candidate?.id);
      this.router.navigate(['/tabs/tab1']);
    }
  }

  deleteCandidate() {
    if (this.candidate && this.candidate.id) {
      this.candidateService.deleteCandidate(this.candidate.id).subscribe(
        () => {
          console.log('Aday silindi:', this.candidate.id);
          this.router.navigate(['/tabs/tab1']);
        },
        error => {
          console.error('Silme hatası:', error);
        }
      );
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
          alert('CV indirilirken bir hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
        }
      );
    }
  }
}