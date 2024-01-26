import { IsOptional, IsString } from 'class-validator';
import { PaginationOptionsDto } from 'src/pagination';
export class FindHospitalsDto extends PaginationOptionsDto {
  @IsOptional()
  @IsString()
  name?: string;

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
