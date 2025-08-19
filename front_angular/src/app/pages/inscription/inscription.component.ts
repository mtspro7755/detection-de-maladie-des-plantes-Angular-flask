import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})


export class InscriptionComponent {
  inscriptionForm: FormGroup;
  isLogin = false;

  constructor(private fb: FormBuilder) {
    this.inscriptionForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.inscriptionForm.valid) {
      console.log('Inscription réussie', this.inscriptionForm.value);
    }
  }

  toggleMode(login: boolean): void {
    this.isLogin = login;
  }
}
