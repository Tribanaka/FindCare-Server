import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './schedule.entity';
import { SchedulesService } from './schedules.service';
import { PractitionersModule } from 'src/practitioners/practitioners.module';
import { PractitionersService } from 'src/practitioners/practitioners.service';
import { SchedulesController } from './schedules.controller';

@Module({
  imports: [PractitionersModule, TypeOrmModule.forFeature([Schedule])],
  providers: [SchedulesService],
  controllers: [SchedulesController],
  exports: [SchedulesService],
})
export class SchedulesModule {}
