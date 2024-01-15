import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PractitionersModule } from './practitioners/practitioners.module';
import { SchedulesModule } from './schedules/schedules.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { HospitalsModule } from './hospitals/hospitals.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PractitionersModule,
    SchedulesModule,
    AppointmentsModule,
    HospitalsModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
