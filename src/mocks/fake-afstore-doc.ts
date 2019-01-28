export class FakeAfstoreDoc {
  docToReturn;
  collToReturn;

  doc(path: string) {
    return this.docToReturn;
  }

  collection(path: string) {
    return this.collToReturn;
  }
}
