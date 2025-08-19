import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = 'http://localhost:5000/predict'; // Change si tu déploies

  constructor(private http: HttpClient) {}


  envoyerImage(file: File): Observable<{ prediction: string, image_url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ prediction: string, image_url: string }>(this.apiUrl, formData);
  }

  getHistorique(): Observable<AnalyseHistorique[]> {
    return this.http.get<AnalyseHistorique[]>(`${this.apiUrl}/history`);
  }

}

export interface AnalyseHistorique {
  image_url: string;
  plant_name: string;
  plant_family: string;
  prediction: string;
  date: string;
  analyses: number;
}

