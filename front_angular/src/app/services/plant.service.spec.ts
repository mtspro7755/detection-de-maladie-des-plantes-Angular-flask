import { TestBed } from '@angular/core/testing';

import { PlantService } from './plant.service';

describe('PlantServiceService', () => {
  let service: PlantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
