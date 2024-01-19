import { IsArray } from 'class-validator';
import { PaginationMetaDto } from './pagination-meta.dto';

export class PaginationDto<T> {
  @IsArray()
  data: T[];
  meta: PaginationMetaDto;
  constructor(data: T[], meta: PaginationMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
