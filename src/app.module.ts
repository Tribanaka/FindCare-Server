import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HospitalController } from './hospital/hospital.controller';

@Module({
  imports: [],
  controllers: [AppController, HospitalController],
  providers: [AppService],
})
export class AppModule {}
