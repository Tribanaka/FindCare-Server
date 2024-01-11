import { Practioner } from 'src/practioners/interfaces/practioner.interface';

export class CreateHospitalDto {
  name: string;
  state: string;
  city: string;
  practioners: Practioner[];
}
