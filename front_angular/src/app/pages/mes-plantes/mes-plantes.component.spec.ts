import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesPlantesComponent } from './mes-plantes.component';

describe('MesPlantesComponent', () => {
  let component: MesPlantesComponent;
  let fixture: ComponentFixture<MesPlantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesPlantesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MesPlantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
