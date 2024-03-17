import { PaginationOptionsDto } from '../dto';

export interface PaginationMetaDtoParameters {
  pageOptionsDto: PaginationOptionsDto;
  itemCount: number;
  totalItemCount?: number;
}
