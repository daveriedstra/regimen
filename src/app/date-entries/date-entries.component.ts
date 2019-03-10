import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import DateEntries from '../models/date-entries.interface';
import { Entry } from '../models/entry.model';

@Component({
  selector: 'app-date-entries',
  templateUrl: './date-entries.component.html',
  styleUrls: ['./date-entries.component.scss']
})
export class DateEntriesComponent implements OnChanges {
  @Input()
  dateEntries: DateEntries;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dateEntries'] && changes['dateEntries'].currentValue) {
      this.dateEntries.entries = this.filterEntries(changes['dateEntries'].currentValue.entries);
    }
  }

  private filterEntries(entries: Entry[]): Entry[] {
    return entries.filter(e => e.duration < 0 || !!e.description || !!e.note);
  }
}
