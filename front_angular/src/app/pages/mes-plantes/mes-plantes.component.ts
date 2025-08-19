import {Component, OnInit} from '@angular/core';
import {Plant} from "../../models/plant.model";
import {NgClass, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {PlantService} from "../../services/plant.service";


@Component({
  selector: 'mes-plantes',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    TitleCasePipe,
    NgIf,
    NgClass
  ],
  templateUrl: './mes-plantes.component.html',
  styleUrl: './mes-plantes.component.css'
})


export class MesPlantesComponent {
  plants: Plant[] = [];

  constructor(private plantService: PlantService) {}

  ngOnInit(): void {
    this.plantService.getPlants().subscribe((data) => {
      this.plants = data.map(entry => ({
        name: entry.plant_name,
        //family: 'Famille inconnue', // par défaut, si non fourni
        family: entry.plant_family,
        imageUrl: entry.image_url,
        maladie: entry.disease_name,
        status: this.getStatus(entry.score),
        statusPercentage: Math.round(entry.score * 100),
        lastAnalysis: entry.date,
        analysisCount: entry.analysis_count
      }));
    });
  }

  getStatus(score: number): 'sain' | 'attention' | 'critique' {
    if (score < 0.3) return 'sain';
    if (score < 0.7) return 'attention';
    return 'critique';
  }

  get total() {
    return this.plants.length;
  }

  get healthy() {
    return this.plants.filter(p => p.status === 'sain').length;
  }

  get warning() {
    return this.plants.filter(p => p.status === 'attention').length;
  }

  get critical() {
    return this.plants.filter(p => p.status === 'critique').length;
  }
}
