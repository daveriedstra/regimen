import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { User } from 'firebase';
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
  currentPassword = '';
  newPassword = '';
  retypePassword = '';

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
    console.log('updating email to', this.newEmail);
  }

  updatePassword() {
    console.log('updating password to', this.newPassword);
  }

  deleteAccountData() {
    console.log('deleting account data!');
  }
}
