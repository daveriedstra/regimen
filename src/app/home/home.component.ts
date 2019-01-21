import { Component, OnInit } from '@angular/core';
import { Entry } from '../models/entry.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  lastEntry: Entry;

  constructor() { }

  ngOnInit() {
  }

}
