// src/app/models/plant.model.ts
export interface Plant {
  name: string;
  family: string;
  status: 'sain' | 'attention' | 'critique';
  statusPercentage: number;
  lastAnalysis: string;
  analysisCount: number;
  imageUrl: string;
  maladie: string;
}
