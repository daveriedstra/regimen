import { Subject } from "rxjs";

export class FakeAfAuth {
  user = new Subject();
  authState = new Subject();
  auth = {
    createUserWithEmailAndPassword: () => this.createUserWithEmailAndPassword(),
    signInWithEmailAndPassword: () => this.signInWithEmailAndPassword(),
    signOut: () => this.signOut()
  };

  private resolveUser(res) {
    res();
    setTimeout(() => this.user.next({}), 0);
  }

  createUserWithEmailAndPassword() {
    return new Promise(r => this.resolveUser(r));
  }

  signInWithEmailAndPassword() {
    return new Promise(r => this.resolveUser(r));
  }

  signOut() {
    return Promise.resolve();
  }
}
