import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Hospital } from './hospital.entity';
import { Repository } from 'typeorm';

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

  findAll(filter: { name?: string; city?: string; state?: string }) {
    const query = this.hospitalsRepository.createQueryBuilder('hospital');

    if (filter.name) {
      query.andWhere('LOWER(hospital.name) LIKE LOWER(:name)', {
        name: `%${filter.name}%`,
      });
    }

    if (filter.city) {
      query.andWhere('LOWER(hospital.city) LIKE LOWER(:city)', {
        city: `%${filter.city}%`,
      });
    }

    if (filter.state) {
      query.andWhere('LOWER(hospital.state) LIKE LOWER(:state)', {
        state: `%${filter.state}%`,
      });
    }
    return query.getMany();
  }

  findOne(id: number) {
    return this.hospitalsRepository.findOneBy({ id });
  }
}
