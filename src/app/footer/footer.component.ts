import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  loggedIn = false;

  constructor(
    private router: Router,
    private auth: AngularFireAuth) { }

  ngOnInit() {
    this.auth.authState.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(u => {
      this.loggedIn = !!u;
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  doLogOut() {
    this.auth.auth.signOut()
      .then(() => {
        this.router.navigateByUrl('/');
      });
  }
}
