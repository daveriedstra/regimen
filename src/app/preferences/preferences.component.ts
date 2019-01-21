import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  back(e: Event) {
    e.preventDefault();
    this.location.back();
  }
}
