import { Component, OnInit, OnDestroy } from '@angular/core';
import { Entry } from '../models/entry.model';
import { AngularFirestoreCollection, AngularFirestore, CollectionReference, Query } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { take, takeUntil, map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  lastEntry: Entry;
  overviewData: HmDatum[];
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
          e.date = e.date.toDate();
          this.lastEntry = e;
        });

      this.getThisMonthsEntries(uid)
        .subscribe((entries: Entry[]) => {
          this.overviewData = this.formatOverviewData(entries);
          this.fixSvg();
        });
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private getMostRecentEntry(uid: string): Observable<Entry> {
    return this.afstore.doc(`entries/${uid}`)
      .collection('entries', r => this.todayFilter(r))
      .valueChanges()
      .pipe(
        takeUntil(this.unsubscribe),
        map(e => e[0] as Entry)
      );
  }

  private getThisMonthsEntries(uid: string): Observable<Entry[]> {
    return this.afstore.doc(`entries/${uid}`)
      .collection('entries', r => this.monthFilter(r))
      .valueChanges()
      .pipe(
        takeUntil(this.unsubscribe),
      ) as Observable<Entry[]>;
  }

  private formatOverviewData(entries: Entry[]): HmDatum[] {
    const newOverview: HmDatum[] = [];
    entries.forEach(e => {
      e.date = e.date.toDate();
      const dateEntry = newOverview.find(x => x.date.getDate() === e.date.getDate());
      e.duration /= 1000;
      if (dateEntry) {
        // consolidate new entry with existing
        dateEntry.total += e.duration;
        dateEntry.details.push(this.entryToDetails(e));
      } else {
        newOverview.push(this.entryToDatum(e));
      }
    });
    return newOverview;
  }

  /**
   * not great to mess with the DOM directly,
   * but this heatmap widget is not great either...
   */
  private fixSvg() {
    const cal = document.getElementsByTagName('calendar-heatmap')[0];
    const svg = cal.getElementsByTagName('svg')[0];

    const w = svg.getAttribute('width'),
      h = svg.getAttribute('height');
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
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

  private entryToDatum(e: Entry): HmDatum {
    return {
      date: e.date,
      total: e.duration,
      details: [this.entryToDetails(e)]
    };
  }

  private entryToDetails(e: Entry): HmDetails {
    return {
      name: e.description,
      date: e.date,
      value: e.duration
    };
  }
}

interface HmDatum {
  date: Date;
  total: number;
  details: HmDetails[];
}

interface HmDetails {
  name: string;
  date: Date;
  value: number;
}