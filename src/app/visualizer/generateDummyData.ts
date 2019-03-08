import { Entry } from '../models/entry.model';

const TODAY = new Date();
const MONTH_DAYS = (new Date(TODAY.getUTCFullYear(), TODAY.getMonth() + 1, 0)).getDate();

function makeDatum(): Entry {
  return {
    date: new Date(TODAY.getUTCFullYear(), TODAY.getMonth(), Math.ceil(Math.random() * MONTH_DAYS), 12),
    duration: Math.round(Math.random() * 60 * 60 * 1000),
    description: '',
    note: ''
  };
}

export default function generateDummyData(): Entry[] {
  const out = [];
  for (let i = 0; i < 20; i++) {
    out.push(makeDatum());
  }
  return out.sort((a, b) => a.date > b.date ? 1 : -1);
}
