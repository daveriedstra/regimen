import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { User } from 'firebase';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit, OnDestroy {
  user: User;
  private unsubscribe: Subject<void>;

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
}
