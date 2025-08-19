import { Routes } from '@angular/router';
import {AnalyseurComponent} from "./pages/analyseur/analyseur.component";
import {DashboardComponent} from "./pages/dashbord/dashbord.component";
import {MesPlantesComponent} from "./pages/mes-plantes/mes-plantes.component";
import {LoginComponent} from "./pages/login/login.component";
import {AuthComponent} from "./pages/auth/auth.component";
import {HomeComponent} from "./pages/home/home.component";
import {SettingsComponent} from "./pages/settings/settings.component";


export const routes: Routes = [
  // Route par défaut (redirection vers le tableau de bord)
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'analyseur', component: AnalyseurComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'mesPlantes', component: MesPlantesComponent },
  { path: 'login', component: LoginComponent },
  {path: 'auth', component: AuthComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'home', component: HomeComponent },
  {path: 'settings', component: SettingsComponent },

];
