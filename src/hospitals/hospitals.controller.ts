import { Controller, Get, Param, Patch, Post } from '@nestjs/common';

@Controller('hospitals')
export class HospitalsController {
  @Get()
  findAll() {
    return 'This action returns all hospitals';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} hospital`;
  }

  @Post()
  create() {
    return 'This action adds a new hospital';
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return `This action updates #${id} hospital`;
  }
}
