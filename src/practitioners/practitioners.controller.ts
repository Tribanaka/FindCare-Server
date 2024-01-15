import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreatePractionerDto } from './dto/create-practitioner.dto';
import { PractitionersService } from './practitioners.service';
import { Practitioner } from './practitioner.entity';

@Controller('practitioners')
export class PractitionersController {
  constructor(private practitionersService: PractitionersService) {}

  @Get()
  findAll(
    @Query('hospitalName') hospitalName: string,
    @Query('state') state: string,
    @Query('city') city: string,
  ): Promise<Practitioner[]> {
    return this.practitionersService.findAll({ hospitalName, state, city });
  }

  @Get('id:')
  findOne(@Param('id') id: string) {
    return `This action returns #${id} practitioner`;
  }

  @Post()
  create(@Body() CreatePractionerDto: CreatePractionerDto) {
    return this.practitionersService.create(CreatePractionerDto);
  }
}
