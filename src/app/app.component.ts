import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void>;
  loggedIn = false;

  constructor(private auth: AngularFireAuth) { }

  ngOnInit() {
    this.unsubscribe = new Subject();
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

}
