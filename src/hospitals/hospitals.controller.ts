import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateHospitalDto } from './dto';
import { UpdateHospitalDto } from './dto';
import { HospitalsService } from './hospitals.service';
import { FindHospitalsDto } from './dto';

@Controller('hospitals')
export class HospitalsController {
  constructor(private hospitalsService: HospitalsService) {}

  @Get()
  findAll(@Query() findHospitalsDto: FindHospitalsDto) {
    return this.hospitalsService.findAll(findHospitalsDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
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
