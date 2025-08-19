import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})



export class AuthComponent {
  isSignup = true;

  onSubmit() {
    // Traitement du formulaire
    if (this.isSignup) {
      console.log('Créer un compte');
    } else {
      console.log('Connexion');
    }
  }
}
