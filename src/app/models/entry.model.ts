import { Timestamp } from 'firebase/firestore';

export interface Entry {
  date: Date | Timestamp;
  duration: number;
  description: string;
  note: string;
}
