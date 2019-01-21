import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Entry } from '../models/entry.model';

@Component({
  selector: 'app-new-entry',
  templateUrl: './new-entry.component.html',
  styleUrls: ['./new-entry.component.scss']
})
export class NewEntryComponent implements OnInit {
  entry: Entry = {
    date: new Date(),
    duration: 0,
    description: '',
    note: ''
  };

  constructor(private location: Location) { }

  ngOnInit() {
  }

  back(e: Event) {
    e.preventDefault();
    this.location.back();
  }

}
