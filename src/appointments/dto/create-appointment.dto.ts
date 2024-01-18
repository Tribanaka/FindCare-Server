import { IsNotEmpty, IsTimeZone } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  practitionerId: number;

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  time: string;

  @IsNotEmpty()
  @IsTimeZone()
  timeZone: string;
}
