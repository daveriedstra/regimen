import { FakeAfstoreDoc } from './fake-afstore-doc';
import { FakeAfstoreColl } from './fake-afstore-coll';

export class FakeAfstore {
  docToReturn = new FakeAfstoreDoc();
  collToReturn = new FakeAfstoreColl();

  constructor() {
    this.docToReturn.collToReturn = this.collToReturn;
    this.collToReturn.docToReturn = this.docToReturn;
  }

  doc(path: string) {
    return this.docToReturn;
  }

  collection(path: string) {
    return this.collToReturn;
  }
}
