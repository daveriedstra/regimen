import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { NgForm } from '@angular/forms';
import { take } from 'rxjs/operators';
import { Entry } from '../models/entry.model';

@Component({
  selector: 'app-new-entry',
  templateUrl: './new-entry.component.html',
  styleUrls: ['./new-entry.component.scss']
})
export class NewEntryComponent implements OnInit {
  private userEntryCollection: AngularFirestoreCollection<Entry>;
  today = new Date();
  entry: Entry = {
    date: new Date(),
    duration: 0,
    description: '',
    note: ''
  };
  hours = 0;
  mins = 0;

  constructor(
    private router: Router,
    private afstore: AngularFirestore,
    private afAuth: AngularFireAuth) {
  }

  ngOnInit() {
    this.entry.date.setUTCHours(0);
    this.afAuth.user.pipe(
      take(1)
    ).subscribe(u => {
      const uid = u.uid;
      this.userEntryCollection = this.afstore.doc(`entries/${uid}`)
        .collection('entries');
    });
  }

  back(e: Event) {
    e.preventDefault();
    this.router.navigate(['..']);
  }

  onEntryDateChange(dateInput: HTMLInputElement) {
    if (dateInput.value) {
      const d = new Date(dateInput.valueAsDate);
      d.setUTCHours(0);
      this.entry.date = d;
    } else {
      this.entry.date = undefined;
    }
  }

  addEntry(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const minutes = (this.hours * 60) + this.mins;
    this.entry.duration = minutes * 60 * 1000;
    this.userEntryCollection.add(this.entry)
      .then(ref => this.router.navigate(['/']));
  }
}
