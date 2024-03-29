import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { AppointmentsService } from './appointments.service';
import { PractitionersModule } from 'src/practitioners/practitioners.module';
import { UsersModule } from 'src/users/users.module';
import { SchedulesModule } from 'src/schedules/schedules.module';
import { AppointmentsController } from './appointments.controller';

@Module({
  imports: [
    PractitionersModule,
    UsersModule,
    forwardRef(() => SchedulesModule),
    TypeOrmModule.forFeature([Appointment]),
  ],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
