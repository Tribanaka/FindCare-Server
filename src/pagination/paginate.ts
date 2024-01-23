import {
  PaginationDto,
  PaginationMetaDto,
  PaginationOptionsDto,
} from 'src/pagination';
import { SelectQueryBuilder } from 'typeorm';

export default async function paginate<E>(
  query: SelectQueryBuilder<E>,
  sortBy: string,
  paginationOptionsDto: PaginationOptionsDto,
) {
  query
    .orderBy(sortBy, paginationOptionsDto.order)
    .skip(paginationOptionsDto.skip)
    .take(paginationOptionsDto.limit);

  const totalItemCount = await query.getCount();
  const { entities } = await query.getRawAndEntities();
  const paginationMetaDto = new PaginationMetaDto({
    itemCount: entities.length,
    pageOptionsDto: paginationOptionsDto,
    totalItemCount,
  });
  return new PaginationDto(entities, paginationMetaDto);
}
