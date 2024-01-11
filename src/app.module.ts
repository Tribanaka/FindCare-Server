import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HospitalsController } from './hospitals/hospitals.controller';
import { HospitalsService } from './hospitals/hospitals.service';
import { PractionersController } from './practioners/practioners.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, UsersModule, ConfigModule.forRoot()],
  controllers: [AppController, HospitalsController, PractionersController],
  providers: [AppService, HospitalsService],
})
export class AppModule {}
