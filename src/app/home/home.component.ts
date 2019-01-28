import { Component, OnInit, OnDestroy } from '@angular/core';
import { Entry } from '../models/entry.model';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { take, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  lastEntry: Entry;
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

      this.afstore.doc(`entries/${uid}`)
        .collection('entries', ref => ref.orderBy('date', 'desc').limit(1) )
        .valueChanges()
        .pipe(
          takeUntil(this.unsubscribe)
        )
        .subscribe((e: Entry[]) => {
          if (e instanceof Array) {
            e[0].date = e[0].date.toDate();
            this.lastEntry = e[0];
          }
        });
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
