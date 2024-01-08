import { Practioner } from '../../practioners/interfaces/practioner.interface';

export interface Hospitals {
  id: string;
  name: string;
  location: {
    state: string;
    city: string;
  };
  practioners: Practioner[];
}
