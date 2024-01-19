import { PaginationMetaDtoParameters } from '../interface';

export class PaginationMetaDto {
  page: number;
  itemCount: number;
  limit: number;
  totalItemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  constructor({
    pageOptionsDto,
    itemCount,
    totalItemCount,
  }: PaginationMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.limit = pageOptionsDto.limit;
    this.itemCount = itemCount;
    this.totalItemCount = totalItemCount;
    this.pageCount = Math.ceil(this.totalItemCount / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
