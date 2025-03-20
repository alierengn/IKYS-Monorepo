import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CandidateService } from '../services/candidate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab1Page implements OnInit {
  candidates: any[] = [];
  filteredCandidates: any[] = [];
  filters = {
    position: '',
    militaryStatus: '',
    sortOrder: '' // Artan (asc) veya Azalan (desc) sıralama için
  };

  constructor(private candidateService: CandidateService, private router: Router) {}

  ngOnInit() {
    this.loadCandidates();
  }

  ionViewWillEnter() {
    this.loadCandidates();
  }

  loadCandidates() {
    this.candidateService.getCandidates().subscribe(
      data => {
        this.candidates = data;
        this.filteredCandidates = data;
        console.log('Adaylar:', data);
        this.applyFilters();
      },
      error => {
        console.error('Hata:', error);
      }
    );
  }

  // İhbar süresini saat cinsine çeviren fonksiyon
  convertNoticePeriodToHours(noticePeriod: string): number {
    if (!noticePeriod) return 0;

    // Küçük harfe çevir ve boşlukları kaldır
    noticePeriod = noticePeriod.toLowerCase().trim();

    // Sayı ve birim ayrıştırma (örneğin "2 ay", "1 hafta", "3 gün")
    const match = noticePeriod.match(/^(\d+)\s*(ay|hafta|gün)$/);
    if (!match) return 0; // Geçersiz format

    const value = parseInt(match[1], 10); // Sayı (örneğin 2)
    const unit = match[2]; // Birim (örneğin "ay")

    let hours = 0;
    if (unit === 'ay') {
      hours = value * 30 * 24; // 1 ay = 30 gün * 24 saat
    } else if (unit === 'hafta') {
      hours = value * 7 * 24; // 1 hafta = 7 gün * 24 saat
    } else if (unit === 'gün') {
      hours = value * 24; // 1 gün = 24 saat
    }

    return hours;
  }

  applyFilters() {
    // Mevcut filtreleme mantığını uygula
    let tempCandidates = this.candidates.filter(candidate => {
      const matchesPosition = this.filters.position
        ? candidate.position === this.filters.position
        : true;
      const matchesMilitaryStatus = this.filters.militaryStatus
        ? candidate.militaryStatus === this.filters.militaryStatus
        : true;

      return matchesPosition && matchesMilitaryStatus;
    });

    // Sıralama işlemi (İhbar süresine göre)
    if (this.filters.sortOrder) {
      tempCandidates.sort((a, b) => {
        const hoursA = this.convertNoticePeriodToHours(a.noticePeriod);
        const hoursB = this.convertNoticePeriodToHours(b.noticePeriod);

        if (this.filters.sortOrder === 'asc') {
          return hoursA - hoursB; // Artan sıralama
        } else {
          return hoursB - hoursA; // Azalan sıralama
        }
      });
    }

    this.filteredCandidates = tempCandidates;
  }

  clearFilters() {
    this.filters = {
      position: '',
      militaryStatus: '',
      sortOrder: ''
    };
    this.filteredCandidates = [...this.candidates];
  }

  deleteCandidate(id: number) {
    if (!id) {
      console.error('ID undefined, silme işlemi yapılamaz:', id);
      return;
    }
    this.candidateService.deleteCandidate(id).subscribe(
      () => {
        console.log('Aday silindi:', id);
        this.loadCandidates();
      },
      error => {
        console.error('Silme hatası:', error);
      }
    );
  }

  viewDetails(id: number) {
    console.log('Detaylar için aday ID:', id);
    this.router.navigate(['/tabs/tab3', id]);
  }

  goToAddCandidate() {
    this.router.navigate(['/tabs/tab2']);
  }
}