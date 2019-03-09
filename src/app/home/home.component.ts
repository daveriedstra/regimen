import { Component, OnInit, OnDestroy } from '@angular/core';
import { Entry } from '../models/entry.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { take, map, filter, switchMap } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import DateEntries from '../models/date-entries.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  stagedDateEntries: DateEntries;
  overviewData: DateEntries[] = [];
  unsubscribe: Subject<void>;
  private uid: string;

  constructor(
    private afstore: AngularFirestore,
    private afAuth: AngularFireAuth) {
  }

  ngOnInit() {
    this.unsubscribe = new Subject();
    this.afAuth.user.pipe(
      take(1)
    ).subscribe(u => {
      this.uid = u.uid;
      this.getEntriesForMostRecentPopulatedMonth(u.uid, this.getFirstOfMonth())
        .subscribe((entries: Entry[]) => {
          this.overviewData = this.formatOverviewData(entries);
          this.onDateSelected(this.getMostRecentEntries(this.overviewData));
        });
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onDateSelected(d: DateEntries) {
    this.stagedDateEntries = d;
  }

  onMonthChange(newMonth: number) {
    this.getEntriesForMonth(this.uid, this.getFirstOfMonth(newMonth))
      .subscribe(entries => this.overviewData = this.formatOverviewData(entries));
  }

  private getMostRecentEntries(entries: DateEntries[]): DateEntries {
    const today = new Date();
    return entries.filter(d => d.date <= today && !d.isTodayMarker)
      .sort((a, b) => a.date > b.date ? -1 : 1)[0];
  }

  private getEntriesForMonth(uid: string, firstOfMonth: Date): Observable<Entry[]> {
    const lastOfMonth = new Date(firstOfMonth);
    lastOfMonth.setMonth(lastOfMonth.getMonth() + 1, 0);
    lastOfMonth.setHours(23, 59, 59);
    return this.afstore.doc(`entries/${uid}`)
      .collection('entries', r => {
        return r.orderBy('date', 'desc')
          .where('date', '>=', firstOfMonth)
          .where('date', '<=', lastOfMonth);
      })
      .valueChanges()
      .pipe(
        take(1),
        filter(e => !!e),
        map(e => e.map(x => {
          x.date = x.date.toDate();
          return x;
        }))
      ) as Observable<Entry[]>;
  }

  /**
   * Wraps getEntriesForMonth, calling it for each preceding month
   * until it finds one with entries (or maxes out its attempts).
   *
   * Recursive.
   */
  private getEntriesForMostRecentPopulatedMonth(uid: string, firstOfMonth: Date, attempt = 0): Observable<Entry[]> {
    const max = 6;
    return this.getEntriesForMonth(uid, firstOfMonth)
      .pipe(
        switchMap(e => {
          if ((!e || !e.length) && attempt < max) {
            firstOfMonth.setDate(0);
            firstOfMonth.setDate(1);
            attempt++;

            // point of recursion
            return this.getEntriesForMostRecentPopulatedMonth(uid, firstOfMonth, attempt);
          }
          return of(e);
        })
      );
  }


  private formatOverviewData(entries: Entry[]): DateEntries[] {
    const newOverview: DateEntries[] = [];
    entries.forEach(e => {
      const dateEntry = newOverview.find(x => x.date.getDate() === e.date.getDate());
      e.duration /= 1000;
      if (dateEntry) {
        // consolidate new entry with existing
        dateEntry.totalDuration += e.duration;
        dateEntry.entries.push(e);
      } else {
        newOverview.push(this.entryToDateEntries(e));
      }
    });
    return newOverview;
  }

  private entryToDateEntries(e: Entry): DateEntries {
    return {
      date: e.date,
      totalDuration: e.duration,
      entries: [e]
    };
  }

  private getFirstOfMonth(month: number = (new Date()).getMonth(), year = (new Date()).getFullYear()): Date {
    return new Date(year, month, 1, 0, 0, 0, 0);
  }
}
