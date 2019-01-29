import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { User, FirebaseError } from 'firebase';
import { NgForm } from '@angular/forms';

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

  constructor(private router: Router, private auth: AngularFireAuth) { }

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

  doLogOut() {
    this.auth.auth.signOut()
      .then(() => {
        this.router.navigateByUrl('/');
      });
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
    console.log('STUB: delete account data');
  }

  /**
   * Gets an appropriate user-facing message from a FirebaseError
   * @param e 
   */
  private getFriendlyMessage(e: FirebaseError): string {
    if (e.code === 'auth/requires-recent-login') {
      return 'Your login is too stale to do this. Please log out, log in, and try again.';
    } else {
      return e.message;
    }
  }
}
