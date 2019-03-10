import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { InlineSVGModule } from 'ng-inline-svg';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NewEntryComponent } from './new-entry/new-entry.component';
import { StatsComponent } from './stats/stats.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { LoginComponent } from './login/login.component';

import { environment } from '../environments/environment';
import { MatchValidator } from './match-validator.directive';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MinValidator } from './min-validator.directive';
import { MaxValidator } from './max-validator.directive';
import { NewlinePipe } from './newline.pipe';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { The404Component } from './the404/the404.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { VisualizerComponent } from './visualizer/visualizer.component';
import { SelectAllDirective } from './select-all.directive';
import { DateEntriesComponent } from './date-entries/date-entries.component';
import { PrettyDurationPipe } from './pretty-duration.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewEntryComponent,
    StatsComponent,
    PreferencesComponent,
    LoginComponent,
    MatchValidator,
    MinValidator,
    MaxValidator,
    NewlinePipe,
    HeaderComponent,
    FooterComponent,
    The404Component,
    PrivacyComponent,
    VisualizerComponent,
    SelectAllDirective,
    DateEntriesComponent,
    PrettyDurationPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    HttpClientModule,
    InlineSVGModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
