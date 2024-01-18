import { IsNotEmpty, IsTimeZone } from 'class-validator';

export class QueryTimeZoneDto {
  @IsNotEmpty()
  @IsTimeZone()
  timeZone: string;
}
