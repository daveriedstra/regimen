import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { User, FirebaseError } from 'firebase';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit, OnDestroy {
  user: User;
  private unsubscribe: Subject<void>;

  // form models
  newEmail = '';
  retypeEmail = '';
  newPassword = '';
  retypePassword = '';

  // Async validation messages
  emailMsg = '';
  passwordMsg = '';
  deleteMsg = '';

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private afStore: AngularFirestore) { }

  ngOnInit() {
    this.unsubscribe = new Subject();
    this.auth.user.pipe(
      takeUntil(this.unsubscribe)
    )
    .subscribe(u => this.user = u);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  back(e: Event) {
    e.preventDefault();
    this.router.navigate(['..']);
  }

  /**
   * submit handler for the whole form.
   * Determines whether to update email and/or password.
   */
  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    if (this.newEmail) {
      this.updateEmail();
    }

    if (this.newPassword) {
      this.updatePassword();
    }
  }

  updateEmail() {
    this.user.updateEmail(this.newEmail)
      .then(() => {
        this.emailMsg = 'Your email address has been updated';
        this.newEmail = '';
        this.retypeEmail = '';
      },
      (err: firebase.FirebaseError) => {
        console.dir(err);
        this.emailMsg = this.getFriendlyMessage(err);
      });
  }

  updatePassword() {
    this.user.updatePassword(this.newPassword)
      .then(() => {
        this.passwordMsg = 'Your password has been updated.';
        this.newPassword = '';
        this.retypePassword = '';
      },
      (err: FirebaseError) => {
        console.dir(err);
        this.passwordMsg = this.getFriendlyMessage(err);
      });
  }

  deleteAccountData() {
    this.deleteMsg = 'Deleting...';
    this.deleteBatch(`entries/${this.user.uid}/entries`, 100)
      .then(done => {
        if (done) {
          this.deleteMsg = 'Deleted all entries.';
        } else {
          this.deleteAccountData();
        }
      }, err => {
        this.deleteMsg = this.getFriendlyMessage(err);
      });
  }

  /**
   * queries the given path for up to the given number of entries,
   * then sends delete queries for all of the results.
   * The returned promise resolves with a done value: true if
   * there are no more docs to delete; false otherwise.
   * The promise rejects if one of the delete operations fails.
   */
  private deleteBatch(path: string, size: number): Promise<boolean> {
    return new Promise((res, rej) => {
      this.afStore.collection(path, q => q.limit(size))
        .get()
        .subscribe(snap => {
          if (snap.empty) {
            res(true);
          }

          const deletePromises: Promise<void>[] = [];
          snap.docs.forEach(d => {
            deletePromises.push(
              this.afStore.doc(`${path}/${d.id}`).delete()
            );
          });

          // output promise resolves or rejects with results
          // from any of internal delete ops
          Promise.all(deletePromises)
            .then(() => res(false), e => rej(e));
        });
    });
  }

  /**
   * Gets an appropriate user-facing message from a FirebaseError
   */
  private getFriendlyMessage(e: FirebaseError): string {
    if (e.code === 'auth/requires-recent-login') {
      return 'Your login is too stale to do this. Please log out, log in, and try again.';
    } else {
      return e.message;
    }
  }
}
