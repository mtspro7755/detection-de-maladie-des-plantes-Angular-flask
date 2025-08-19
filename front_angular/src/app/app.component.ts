import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from "./shared/navbar/navbar.component";
import {AnalyseurComponent} from "./pages/analyseur/analyseur.component";
import {DashboardComponent} from "./pages/dashbord/dashbord.component";
import {InscriptionComponent} from "./pages/inscription/inscription.component";
import {HomeComponent} from "./pages/home/home.component";
import {FooterComponent} from "./shared/footer/footer.component";
import {LoginComponent} from "./pages/login/login.component";
import {AuthComponent} from "./pages/auth/auth.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, AnalyseurComponent, DashboardComponent, InscriptionComponent, HomeComponent, FooterComponent, LoginComponent, AuthComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front_angular';
}
