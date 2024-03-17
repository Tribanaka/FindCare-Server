import { IsNotEmpty } from 'class-validator';

export class CreateHospitalDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  state: string;
}
