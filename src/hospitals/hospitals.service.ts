import { FindHospitalsDto } from './dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHospitalDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Hospital } from './hospital.entity';
import { Repository } from 'typeorm';
import { PaginationDto, PaginationMetaDto } from 'src/pagination/dto';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalsRepository: Repository<Hospital>,
  ) {}

  async create(createHospitalDto: CreateHospitalDto) {
    const hospital = await this.hospitalsRepository.findOneBy({
      name: createHospitalDto.name,
    });

    if (hospital) {
      throw new HttpException(
        'An hospital with this name exist already.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newHospital = this.hospitalsRepository.create({
      ...createHospitalDto,
    });

    return await this.hospitalsRepository.save(newHospital);
  }

  async findAll(findHospitalsDto: FindHospitalsDto) {
    const { city, name, search, state, skip, ...rest } = findHospitalsDto;
    const paginationOptionsDto = { skip, ...rest };
    const query = this.hospitalsRepository.createQueryBuilder('hospital');
    if (search) {
      query
        .orWhere('LOWER(hospital.name) LIKE LOWER(:search)', {
          search: `%${search}%`,
        })
        .orWhere('LOWER(hospital.address) LIKE LOWER(:search)', {
          search: `%${search}%`,
        })
        .orWhere('LOWER(hospital.city) LIKE LOWER(:search)', {
          search: `%${search}%`,
        })
        .orWhere('LOWER(hospital.state) LIKE LOWER(:search)', {
          search: `%${search}%`,
        });
    }

    if (name) {
      query.andWhere('LOWER(hospital.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    if (city) {
      query.andWhere('LOWER(hospital.city) LIKE LOWER(:city)', {
        city: `%${city}%`,
      });
    }

    if (state) {
      query.andWhere('LOWER(hospital.state) LIKE LOWER(:state)', {
        state: `%${state}%`,
      });
    }
    query
      .orderBy('hospital.id', paginationOptionsDto.order)
      .skip(paginationOptionsDto.skip)
      .take(paginationOptionsDto.limit);
    // const itemCount = await queryBuilder.getCount();
    const { entities } = await query.getRawAndEntities();
    const paginationMetaDto = new PaginationMetaDto({
      itemCount: entities.length,
      pageOptionsDto: paginationOptionsDto,
    });
    return new PaginationDto(entities, paginationMetaDto);
    // return query.getMany();
  }

  findOne(id: number) {
    return this.hospitalsRepository.findOneBy({ id });
  }
}
