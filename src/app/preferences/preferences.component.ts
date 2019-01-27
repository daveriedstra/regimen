import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  constructor(private router: Router, private auth: AngularFireAuth) { }

  ngOnInit() {
  }

  back(e: Event) {
    e.preventDefault();
    this.router.navigate(['..']);
  }

  doLogOut() {
    this.auth.auth.signOut()
      .then(() => {
        this.router.navigateByUrl('/');
      });
  }
}
