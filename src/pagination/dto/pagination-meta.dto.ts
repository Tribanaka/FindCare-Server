import { PaginationMetaDtoParameters } from '../interface';

export class PaginationMetaDto {
  page: number;
  itemCount: number;
  limit: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  constructor({ pageOptionsDto, itemCount }: PaginationMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
    this.limit = pageOptionsDto.limit;
  }
}
