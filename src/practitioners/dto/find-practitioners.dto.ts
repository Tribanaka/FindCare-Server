import { IsOptional, IsString } from 'class-validator';
import { PaginationOptionsDto } from 'src/pagination';

export class FindPractitionersDto extends PaginationOptionsDto {
  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  hospitalName?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
