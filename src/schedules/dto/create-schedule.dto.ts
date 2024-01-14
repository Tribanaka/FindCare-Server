import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

export class CreateSchedulesDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
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
