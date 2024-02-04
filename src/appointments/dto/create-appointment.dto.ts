import { IsIn, IsNotEmpty, IsOptional, IsTimeZone } from 'class-validator';
import { AppointmentStatus } from '../appointment.entity';

export class CreateAppointmentDto {
  @IsNotEmpty()
  practitionerId: number;

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  time: string;

  @IsOptional()
  @IsIn([
    AppointmentStatus.PENDING,
    AppointmentStatus.CANCELLED,
    AppointmentStatus.COMPELETED,
    AppointmentStatus.MISSED,
  ])
  status: AppointmentStatus;

  @IsNotEmpty()
  @IsTimeZone()
  timeZone: string;
}
