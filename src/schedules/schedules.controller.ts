import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post(':practitionerId')
  create(
    @Param('practitionerId') practitionerId: number,
    @Body() createScheduleDto: CreateScheduleDto,
  ) {
    return this.schedulesService.createWeeklySchedule(
      practitionerId,
      createScheduleDto,
    );
  }

  @Put(':practitionerId')
  updateSchule(
    @Param('practitionerId') practitionerId: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.schedulesService.updateWeeklySchedule(
      practitionerId,
      updateScheduleDto,
    );
  }
}
