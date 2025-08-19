import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyseurComponent } from './analyseur.component';

describe('AnalyseurComponent', () => {
  let component: AnalyseurComponent;
  let fixture: ComponentFixture<AnalyseurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyseurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnalyseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
