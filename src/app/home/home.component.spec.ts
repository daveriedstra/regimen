import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { FakeAfstore } from '../../mocks/fake-afstore';
import { AngularFirestore } from '@angular/fire/firestore';
import { FakeAfAuth } from '../../mocks/fakeafauth';
import { AngularFireAuth } from '@angular/fire/auth';
import { NewlinePipe } from '../newline.pipe';
import { VisualizerComponent } from '../visualizer/visualizer.component';
import { Entry } from '../models/entry.model';
import { FakeAfstoreDoc } from '../../mocks/fake-afstore-doc';
import { FakeAfstoreColl } from '../../mocks/fake-afstore-coll';

const makeEntriesBetween = (afterDate: Date, beforeDate: Date) => {
  const out: Entry[] = [];
  const numEntries = Math.round(Math.random() * 7 + 2);
  const startDate = afterDate.getUTCDate(),
    dateRange = beforeDate.getUTCDate() - startDate;
  for (let i = 0; i < numEntries; i++) {
    const d = new Date(afterDate);
    d.setDate(d.getDate() + (Math.random() * dateRange));
    (d as any).toDate = function() { return this; };

    out.push({
      description: '',
      note: '',
      date: d,
      duration: Math.random() * 10000
    });
  }
  return out;
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let fStore: FakeAfstore;
  let fakeAfAuth: FakeAfAuth;
  let fakeDoc, fakeColl;

  beforeEach(async(() => {
    fStore = new FakeAfstore();
    fakeAfAuth = new FakeAfAuth();
    fakeDoc = new FakeAfstoreDoc();
    fakeColl = new FakeAfstoreColl();

    spyOn(fStore, 'doc')
      .and.returnValue(fakeDoc);
    spyOn(fakeDoc, 'collection')
      .and.returnValue(fakeColl);

    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        NewlinePipe,
        VisualizerComponent
      ],
      providers: [
        { provide: AngularFireAuth, useValue: fakeAfAuth },
        { provide: AngularFirestore, useValue: fStore }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get most recent entries from this month', () => {
    const today = new Date();
    const first = new Date();
    first.setUTCDate(1);
    first.setUTCHours(0, 0, 0);
    fakeColl.collToReturn = makeEntriesBetween(first, today);
    fakeAfAuth.user.next({});

    const fs = TestBed.get(AngularFirestore);
    expect(fs.doc).toHaveBeenCalled();
    expect(fakeDoc.collection).toHaveBeenCalled();
    expect(component.overviewData).toBeDefined();
    expect(component.overviewData.length).not.toBe(0);
  });

  it('should fail gracefully when no entries exist', () => {
    fakeColl.collToReturn = [];
    fakeAfAuth.user.next({});
    expect(component.overviewData.length).toBe(0);
  })

  it('should get most recent entries from last month', () => {
    const last = new Date();
    last.setUTCDate(0);
    last.setUTCHours(0, 0, 0);
    const first = new Date(last);
    first.setUTCDate(1);
    fakeColl.collToReturn = makeEntriesBetween(first, last);
    fakeAfAuth.user.next({});

    const fs = TestBed.get(AngularFirestore);
    expect(fs.doc).toHaveBeenCalled();
    expect(fakeDoc.collection).toHaveBeenCalled();
    expect(component.overviewData).toBeDefined();
    expect(component.overviewData.length).not.toBe(0);
  });

  it('should stage most recent entry from this month', () => {
    const today = new Date();
    const first = new Date();
    first.setUTCDate(1);
    first.setUTCHours(0, 0, 0);
    fakeColl.collToReturn = makeEntriesBetween(first, today);
    fakeAfAuth.user.next({});
    const mostRecentEntry = component.overviewData.reduce((prev, next) => {
      if (!prev) {
        return next;
      }
      return prev.date > next.date && !prev.isTodayMarker ? prev : next;
    });

    expect(component.stagedDateEntries.date).toBe(mostRecentEntry.date);
  });


  it('should stage most recent entry for previous month', () => {
    const last = new Date();
    last.setUTCDate(0);
    last.setUTCHours(0, 0, 0);
    const first = new Date(last);
    first.setUTCDate(1);
    fakeColl.collToReturn = makeEntriesBetween(first, last);
    fakeAfAuth.user.next({});

    const mostRecentEntry = component.overviewData.reduce((prev, next) => {
      if (!prev) {
        return next;
      }
      return prev.date > next.date && !prev.isTodayMarker ? prev : next;
    });

    expect(component.stagedDateEntries.date).toBe(mostRecentEntry.date);
  });

});
