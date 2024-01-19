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
import { FindPractitionersDto, FindPractitionersDto } from './dto';

@Controller('practitioners')
export class PractitionersController {
  constructor(private practitionersService: PractitionersService) {}

  @Get()
  findAll(
    @Query() findPractitionersDto: FindPractitionersDto,
  ): Promise<Practitioner[]> {
    return this.practitionersService.findAll(findPractitionersDto);
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
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), //5MB
          new FileTypeValidator({ fileType: /^image\/(png|jpeg)$/ }),
        ],
      }),
    )
    photo: Express.Multer.File,
    @Body() CreatePractionerDto: CreatePractionerDto,
  ) {
    return this.practitionersService.create(CreatePractionerDto, photo);
  }
}
