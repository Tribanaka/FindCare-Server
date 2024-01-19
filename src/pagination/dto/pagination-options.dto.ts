import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { PaginationOrder } from '../constants/pagination-order.constants';

export class PaginationOptionsDto {
  @IsEnum(PaginationOrder)
  @IsOptional()
  order?: PaginationOrder = PaginationOrder.ASC;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page: number = 1;

  @IsInt()
  @Max(50)
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit: number = 10;

  get skip() {
    return (this.page - 1) * this.limit;
  }
}
