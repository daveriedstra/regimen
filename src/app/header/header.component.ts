import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  headerText: string;
  private defaultHeaderText = 'Regimen';
  private unsubscribe = new Subject();

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.router.events.pipe(
      takeUntil(this.unsubscribe),
      filter(e => e instanceof NavigationEnd)
    )
    .subscribe(t => this.updateHeaderText());
    this.updateHeaderText();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private updateHeaderText() {
    let route = this.route.snapshot;
    while (route.firstChild) {
      route = route.firstChild;
    }

    if (route.data && route.data.headerText) {
      this.headerText = route.data.headerText;
    } else {
      this.headerText = this.defaultHeaderText;
    }
  }
}
