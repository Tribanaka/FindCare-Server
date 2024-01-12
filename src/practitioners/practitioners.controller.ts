import { Controller, Get, Param, Post } from '@nestjs/common';

@Controller('practitioners')
export class PractitionersController {
  @Post(':id')
  create(@Param('id') id: string) {
    return `This action adds a new practitioner to #${id} Hospital`;
  }

  @Get()
  findAll() {
    return 'This action returns all practitioners';
  }

  @Get('id:')
  findOne(@Param('id') id: string) {
    return `This action returns #${id} practitioner`;
  }
}
