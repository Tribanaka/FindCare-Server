import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Practitioner } from './practitioner.entity';
import { PractitionersService } from './practitioners.service';
import { PractitionersController } from './practitioners.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Practitioner])],
  providers: [PractitionersService],
  exports: [PractitionersService],
  controllers: [PractitionersController],
})
export class PractitionersModule {}
