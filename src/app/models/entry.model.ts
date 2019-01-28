import { Timestamp } from 'firebase/firestore';

export interface Entry {
  date: Date | Timestamp;
  duration: Number;
  description: String;
  note: String;
}
