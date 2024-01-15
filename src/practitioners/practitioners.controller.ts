import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePractionerDto } from './dto/create-practitioner.dto';
import { PractitionersService } from './practitioners.service';
import { Practitioner } from './practitioner.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('practitioners')
export class PractitionersController {
  constructor(private practitionersService: PractitionersService) {}

  @Get()
  findAll(
    @Query('specialization') specialization: string,
    @Query('hospitalName') hospitalName: string,
    @Query('state') state: string,
    @Query('city') city: string,
  ): Promise<Practitioner[]> {
    return this.practitionersService.findAll({
      hospitalName,
      state,
      city,
      specialization,
    });
  }

  @Get('id:')
  findOne(@Param('id') id: string) {
    return `This action returns #${id} practitioner`;
  }

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1 * 1024 * 1024 }), //1MB
          new FileTypeValidator({ fileType: 'image/png' }),
        ],
      }),
    )
    photo: Express.Multer.File,
    @Body() CreatePractionerDto: CreatePractionerDto,
  ) {
    return this.practitionersService.create(CreatePractionerDto, photo);
  }
}
