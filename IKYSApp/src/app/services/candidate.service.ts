import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrl = 'http://localhost:8080/rest/api/candidate';

  constructor(private http: HttpClient) {}

  getCandidates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/list`);
  }

  getCandidateById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/list/${id}`);
  }

  addCandidate(candidate: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/save`, candidate);
  }

  updateCandidate(id: number, candidate: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, candidate);
  }

  deleteCandidate(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }

  downloadCv(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download-cv/${id}`, { responseType: 'blob' });
  }
}