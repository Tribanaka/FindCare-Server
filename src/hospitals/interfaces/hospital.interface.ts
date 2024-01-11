import { Practioner } from 'src/practioners/interfaces/practioner.interface';

export interface Hospitals {
  id: string;
  name: string;
  state: string;
  city: string;
  practioners: Practioner[];
}
