import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { PaginationOrder } from '../constants/pagination-order.constants';

export class PaginationOptionsDto {
  @IsEnum(PaginationOrder)
  @IsOptional()
  order?: PaginationOrder = PaginationOrder.ASC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Max(50)
  @Min(1)
  @IsOptional()
  limit: number = 10;

  get skip() {
    return (this.page - 1) * this.limit;
  }
}
