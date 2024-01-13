import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
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

  findAll() {
    return this.hospitalsRepository.find();
  }

  findOne() {}
}
