import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateSchedulesDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Schedule)
  schedules: Schedule[];
}

class Schedule {
  @IsNotEmpty()
  @IsIn([
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ])
  dayOfWeek: string;

  @IsNotEmpty()
  openingHour: string;

  @IsNotEmpty()
  closingHour: string;
}
