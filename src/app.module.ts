import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HospitalsController } from './hospitals/hospitals.controller';
import { HospitalsService } from './hospitals/hospitals.service';

@Module({
  imports: [],
  controllers: [AppController, HospitalsController],
  providers: [AppService, HospitalsService],
})
export class AppModule {}
