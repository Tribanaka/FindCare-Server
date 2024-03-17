import { PartialType } from '@nestjs/mapped-types';
import { CreateSchedulesDto } from './create-schedule.dto';

export class UpdateScheduleDto extends PartialType(CreateSchedulesDto) {}
