import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { HospitalsService } from './hospitals.service';

@Controller('hospitals')
export class HospitalsController {
  constructor(private hospitalsService: HospitalsService) {}

  @Get()
  findAll() {
    return this.hospitalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return ``;
  }

  @Post()
  create(@Body() createHospitalDto: CreateHospitalDto) {
    return this.hospitalsService.create(createHospitalDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHospitalDto: UpdateHospitalDto,
  ) {
    return ``;
  }
}
