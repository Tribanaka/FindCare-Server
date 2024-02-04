import { IsIn, IsOptional } from 'class-validator';
import { PaginationOptionsDto } from 'src/pagination';
import { AppointmentStatus } from '../appointment.entity';

export class FindAppointmentDto extends PaginationOptionsDto {
  @IsOptional()
  @IsIn([
    AppointmentStatus.PENDING,
    AppointmentStatus.CANCELLED,
    AppointmentStatus.COMPELETED,
    AppointmentStatus.MISSED,
  ])
  status: AppointmentStatus;
}
