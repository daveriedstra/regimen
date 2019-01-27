import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewEntryComponent } from './new-entry/new-entry.component';
import { StatsComponent } from './stats/stats.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { NoAuthGuard } from './noauth.guard';

const routes: Routes = [{
  path: 'home',
  component: HomeComponent,
  canActivate: [
    AuthGuard
  ]
}, {
  path: 'new-entry',
  component: NewEntryComponent,
  canActivate: [
    AuthGuard
  ]
}, {
  path: 'stats',
  component: StatsComponent,
  canActivate: [
    AuthGuard
  ]
}, {
  path: 'preferences',
  component: PreferencesComponent,
  canActivate: [
    AuthGuard
  ]
}, {
  path: 'login',
  component: LoginComponent,
  canActivate: [
    NoAuthGuard
  ]
}, {
  path: '',
  pathMatch: 'full',
  redirectTo: 'home'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
