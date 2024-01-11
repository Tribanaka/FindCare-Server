import { Controller, Get, Param, Post } from '@nestjs/common';

@Controller('practioners')
export class PractionersController {
  @Post(':id')
  create(@Param('id') id: string) {
    return `This action adds a new practioner to #${id} Hospital`;
  }

  @Get()
  findAll() {
    return 'This action returns all practioners';
  }

  @Get('id:')
  findOne(@Param('id') id: string) {
    return `This action returns #${id} practioner`;
  }
}
