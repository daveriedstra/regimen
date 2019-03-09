import { Component, OnInit, Input } from '@angular/core';
import DateEntries from '../models/date-entries.interface';

@Component({
  selector: 'app-date-entries',
  templateUrl: './date-entries.component.html',
  styleUrls: ['./date-entries.component.scss']
})
export class DateEntriesComponent implements OnInit {
  @Input()
  dateEntries: DateEntries;

  constructor() { }

  ngOnInit() {
  }

}
