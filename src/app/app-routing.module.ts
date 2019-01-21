import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewEntryComponent } from './new-entry/new-entry.component';
import { StatsComponent } from './stats/stats.component';
import { PreferencesComponent } from './preferences/preferences.component';

const routes: Routes = [{
  path: 'home',
  component: HomeComponent
}, {
  path: 'new-entry',
  component: NewEntryComponent
}, {
  path: 'stats',
  component: StatsComponent
}, {
  path: 'preferences',
  component: PreferencesComponent
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
