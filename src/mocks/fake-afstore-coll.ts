import { of } from 'rxjs';

export class FakeAfstoreColl<T = any> {
  docToReturn;
  collToReturn;

  doc(path: string) {
    return this.docToReturn;
  }

  collection(path: string) {
    return this.collToReturn;
  }

  add(data: T) {
    return Promise.resolve({});
  }

  valueChanges() {
    return of(this.collToReturn);
  }
}
