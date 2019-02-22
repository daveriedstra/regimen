import { Entry } from './entry.model';

export default interface DateEntries {
  date: Date;
  totalDuration: number;
  entries: Entry[];
}
