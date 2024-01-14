import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatePractionerDto } from './dto/create-practitioner.dto';
import { PractitionersService } from './practitioners.service';

@Controller('practitioners')
export class PractitionersController {
  constructor(private practitionersService: PractitionersService) {}

  @Get()
  findAll() {
    return this.practitionersService.findAll();
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
