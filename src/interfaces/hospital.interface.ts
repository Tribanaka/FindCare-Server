import { Practioner } from './practioner.interface';

export interface Hospitals {
  id: string;
  name: string;
  location: {
    state: string;
    city: string;
  };
  practioners: Practioner[];
}
