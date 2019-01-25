import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  back(e: Event) {
    e.preventDefault();
    this.router.navigate(['..']);
  }
}
