// src/app/services/plant.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PlantApiResponse {
  plant_name: string;
  image_url: string;
  disease_name: string;
  analysis_count: number;
  score: number;
  date: string;
  plant_family: string;
}

@Injectable({ providedIn: 'root' })
export class PlantService {
  private apiUrl = 'http://localhost:5000/api/analyses';

  constructor(private http: HttpClient) {}

  getPlants(): Observable<PlantApiResponse[]> {
    return this.http.get<PlantApiResponse[]>(this.apiUrl);
  }
}
