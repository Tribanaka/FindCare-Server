import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HospitalsController } from './hospitals/hospitals.controller';
import { HospitalsService } from './hospitals/hospitals.service';
import { PractitionersController } from './practitioners/practitioners.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { PractitionersService } from './practitioners/practitioners.service';
import { PractitionersModule } from './practitioners/practitioners.module';
import { SchedulesController } from './schedules/schedules.controller';
import { AppointmentsController } from './appointments/appointments.controller';
import { SchedulesModule } from './schedules/schedules.module';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: `${process.env.DB_PASSWORD}`,
      database: 'test',
      autoLoadEntities: true,
      synchronize: true,
    }),
    PractitionersModule,
    SchedulesModule,
    AppointmentsModule,
  ],
  controllers: [
    AppController,
    HospitalsController,
    PractitionersController,
    SchedulesController,
    AppointmentsController,
  ],
  providers: [AppService, HospitalsService, PractitionersService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
