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
import { CreatePractionerDto, FindPractitionersDto } from './dto';
import { PractitionersService } from './practitioners.service';
import { Practitioner } from './practitioner.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from 'src/pagination/dto';

@Controller('practitioners')
export class PractitionersController {
  constructor(private practitionersService: PractitionersService) {}

  @Get()
  async findAll(
    @Query() findPractitionersDto: FindPractitionersDto,
  ): Promise<Promise<PaginationDto<Practitioner>>> {
    return await this.practitionersService.findAll(findPractitionersDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.practitionersService.findById(id);
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
    @Body() createPractionerDto: CreatePractionerDto,
  ) {
    return this.practitionersService.create(createPractionerDto, photo);
  }
}
