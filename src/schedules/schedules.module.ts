import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './schedule.entity';
import { SchedulesService } from './schedules.service';
import { PractitionersModule } from 'src/practitioners/practitioners.module';
import { SchedulesController } from './schedules.controller';
import { AppointmentsModule } from 'src/appointments/appointments.module';

@Module({
  imports: [
    PractitionersModule,
    forwardRef(() => AppointmentsModule),
    TypeOrmModule.forFeature([Schedule]),
  ],
  providers: [SchedulesService],
  controllers: [SchedulesController],
  exports: [SchedulesService],
})
export class SchedulesModule {}
