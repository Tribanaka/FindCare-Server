import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsStrongPassword,
  ValidateNested,
} from 'class-validator';
import { Schedule } from 'src/schedules/schedule.entity';
import { OneToMany } from 'typeorm';

// class Availability {
//   @IsIn([
//     'Monday',
//     'Tuesday',
//     'Wednesday',
//     'Thursday',
//     'Friday',
//     'Saturday',
//     'Sunday',
//   ])
//   dayOfWeek: string;
//   startHour: string;
//   closeHour: string;
// }

export class CreatePractionerDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  bio: string;

  @IsNotEmpty()
  specialization: string;

  @OneToMany(() => Schedule, (schedule) => schedule.practitioner)
  schedules: Schedule[];
}
