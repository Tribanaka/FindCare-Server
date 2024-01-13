import { Injectable } from '@nestjs/common';
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
