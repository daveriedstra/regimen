import { Component, OnInit } from '@angular/core';
import { Entry } from '../models/entry.model';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit() {
  }

  back(e: Event) {
    e.preventDefault();
    this.router.navigate(['..'])
  }

}
