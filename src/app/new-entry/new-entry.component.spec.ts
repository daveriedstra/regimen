import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEntryComponent } from './new-entry.component';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { FakeAfstore } from '../../mocks/fake-afstore';
import { FakeAfAuth } from '../../mocks/fakeafauth';
import { FakeAfstoreDoc } from '../../mocks/fake-afstore-doc';
import { FakeAfstoreColl } from '../../mocks/fake-afstore-coll';

describe('NewEntryComponent', () => {
  let component: NewEntryComponent;
  let fixture: ComponentFixture<NewEntryComponent>;
  let fakeAfAuth: FakeAfAuth;

  let fStore, fakeDoc, fakeColl;

  beforeEach(async(() => {
    fakeAfAuth = new FakeAfAuth();
    fakeDoc = new FakeAfstoreDoc();
    fakeColl = new FakeAfstoreColl();

    fStore = new FakeAfstore();
    spyOn(fStore, 'doc')
      .and.returnValue(fakeDoc);
    spyOn(fakeDoc, 'collection')
      .and.returnValue(fakeColl);

    TestBed.configureTestingModule({
      declarations: [ NewEntryComponent ],
      imports: [
        FormsModule
      ],
      providers: [
        { provide: Router, useValue: { navigate: () => {} } },
        { provide: AngularFireAuth, useValue: fakeAfAuth },
        { provide: AngularFirestore, useValue: fStore }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fakeAfAuth.user.next({});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the entries collection ref for the authed user', () => {
      const fs: AngularFirestore = TestBed.get(AngularFirestore);
      expect(fs).toBeDefined();
      expect(fs).toBe(fStore);
      expect(fs.doc).toHaveBeenCalled();
      expect(fakeDoc.collection).toHaveBeenCalled();
  });

  it('should not add an entry if the form is invalid', () => {
    const form = { valid: false, invalid: true } as NgForm;
    spyOn(fakeColl, 'add');
    component.addEntry(form);
    expect(fakeColl.add).not.toHaveBeenCalled();
  });

  it('should add an entry to the afstore if the form is valid', () => {
    const form = { valid: true, invalid: false } as NgForm;
    spyOn(fakeColl, 'add')
      .and.callThrough();
    component.addEntry(form);
    expect(fakeColl.add).toHaveBeenCalled();
  });

  it('should count the entry duration in ms', (done: DoneFn) => {
    const form = { valid: true, invalid: false } as NgForm;
    component.hours = 1;
    component.mins = 25;
    const expectedVal = (component.hours * 60 + component.mins) * 60 * 1000;
    const expectedEntry = Object.assign({}, component.entry);
    expectedEntry.duration = expectedVal;

    spyOn(fakeColl, 'add')
      .and.callThrough();
    component.addEntry(form);
    expect(fakeColl.add)
      .toHaveBeenCalledWith(expectedEntry);
    done();
  });

});
