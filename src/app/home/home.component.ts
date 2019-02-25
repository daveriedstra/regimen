import { Component, OnInit, OnDestroy } from '@angular/core';
import { Entry } from '../models/entry.model';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { take, takeUntil, map, filter } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import DateEntries from '../models/date-entries.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  stagedEntry: Entry;
  overviewData: DateEntries[] = [];
  unsubscribe: Subject<void>;

  constructor(
    private afstore: AngularFirestore,
    private afAuth: AngularFireAuth) {
  }

  ngOnInit() {
    this.unsubscribe = new Subject();
    this.afAuth.user.pipe(
      take(1)
    ).subscribe(u => {
      const uid = u.uid;

      this.getMostRecentEntry(uid)
        .subscribe(e => {
          this.stagedEntry = e;
        });

      this.getThisMonthsEntries(uid)
        .subscribe((entries: Entry[]) => {
          this.overviewData = this.formatOverviewData(entries);
        });
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onDateSelected(d: DateEntries) {
    this.stagedEntry = this.dateEntriesToEntry(d);
  }

  private getMostRecentEntry(uid: string): Observable<Entry> {
    return this.afstore.doc(`entries/${uid}`)
      .collection('entries', r => this.todayFilter(r))
      .valueChanges()
      .pipe(
        takeUntil(this.unsubscribe),
        filter(e => !!e && e.length > 0),
        map(e => {
          const x = e[0];
          x.date = x.date.toDate();
          return x as Entry;
        })
      );
  }

  private getThisMonthsEntries(uid: string): Observable<Entry[]> {
    return this.afstore.doc(`entries/${uid}`)
      .collection('entries', r => this.monthFilter(r))
      .valueChanges()
      .pipe(
        takeUntil(this.unsubscribe),
        filter(e => !!e),
        map(e => e.map(x => {
          x.date = x.date.toDate();
          return x;
        }))
      ) as Observable<Entry[]>;
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

  private todayFilter(ref: CollectionReference): Query {
    return ref.orderBy('date', 'desc')
      .limit(1);
  }

  private monthFilter(ref: CollectionReference): Query {
    const today = new Date();
    today.setMonth(today.getMonth() - 1);
    return ref.orderBy('date', 'desc')
      .where('date', '>=', today);
  }

  private entryToDateEntries(e: Entry): DateEntries {
    return {
      date: e.date,
      totalDuration: e.duration,
      entries: [e]
    };
  }

  private dateEntriesToEntry(d: DateEntries): Entry {
    const initial: Entry = {
      duration: d.totalDuration,
      description: '',
      note: '',
      date: d.date
    };

    // This reducer just makes a nice concatenation
    // of the entry string properties; the other data is
    // gleaned from the parent DateEntries.
    return d.entries.reduce((a, b) => {
      a.note = this.niceConcat(a.note, b.note);
      a.description = this.niceConcat(a.description, b.description);

      return a;
    }, initial);
  }

  private niceConcat(a: string, b: string): string {
    a = a.trim();
    b = b.trim();

    if (a.length) {
      return `${a}\n--\n${b}`;
    }

    return b;
  }
}
