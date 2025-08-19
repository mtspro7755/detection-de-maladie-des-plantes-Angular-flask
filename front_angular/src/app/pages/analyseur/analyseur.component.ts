import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PredictionService} from "../../services/prediction.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-analyseur',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './analyseur.component.html',
  styleUrl: './analyseur.component.css'
})

export class AnalyseurComponent {
  selectedFile: File | null = null;
  loading = false;
  predictionResult: string | null = null;
  imageUrl: string | null = null;

  constructor(private predictionService: PredictionService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.envoyerImagePourPrediction();
    }
  }

  envoyerImagePourPrediction(): void {
    if (!this.selectedFile) return;
    this.loading = true;
    this.predictionService.envoyerImage(this.selectedFile).subscribe({
        next: (res) => {
          this.predictionResult = res.prediction;
          this.imageUrl = res.image_url;
          this.loading = false;
        },
      error: (err) => {
        this.loading = false;
        console.error('Erreur lors de la prédiction', err);
      }
    });
  }

  openFileDialog(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

 recommandations: { [maladie: string]: string } = {
    'Target_Spot': 'Retirez les feuilles infectées et appliquez un fongicide à base de cuivre.',
    'Septoria_leaf_spot': 'Évitez l’arrosage aérien et éliminez les feuilles infectées rapidement.',
    'Early_blight': 'Utilisez une rotation culturale et appliquez un fongicide préventif.',
    'Late_blight': 'Détruisez les plantes infectées et évitez l’humidité excessive.',
    'Leaf_Mold': 'Améliorez la ventilation dans la serre et appliquez un traitement fongique.'
  };

  maladieExtraite(): string | null {
    if (!this.predictionResult) return null;

    const parts = this.predictionResult.split(':');
    return parts.length > 1 ? parts[1].trim() : null;
  }






}
