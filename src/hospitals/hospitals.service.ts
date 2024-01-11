import { Injectable } from '@nestjs/common';
import { Hospitals } from 'src/hospitals/interfaces/hospital.interface';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';

@Injectable()
export class HospitalsService {
  private hospitals: Hospitals[] = [
    {
      id: '1',
      name: 'Standard Hospital',
      city: 'Minna',
      state: 'Niger',

      practioners: [],
    },
    {
      id: '2',
      name: 'Top Medical Hospital',
      city: 'Minna',
      state: 'Niger',
      practioners: [],
    },
    {
      id: '3',
      name: 'Optimal Family Medical Centre',
      city: 'Minna',
      state: 'Niger',

      practioners: [],
    },
    {
      id: '4',
      name: 'Sent. Idris Ibrahim kuta memorial primary health care center',
      city: 'Minna',
      state: 'Niger',

      practioners: [],
    },
    {
      id: '5',
      name: 'Shiloh Hospital and Diagnostic Center Minna',
      city: 'Minna',
      state: 'Niger',

      practioners: [],
    },
  ];

  findAll() {
    return this.hospitals;
  }

  findOne(id: string) {
    return this.hospitals.find((hospital) => hospital.id === id);
  }

  create(createHospitalDto: CreateHospitalDto) {
    const usersByHighestId = [...this.hospitals].sort((a, b) => +b.id - +a.id);

    const newHospital = {
      id: `${usersByHighestId[0].id + 1}`,
      ...createHospitalDto,
    };

    this.hospitals.push(newHospital);
    return newHospital;
  }

  update(id: string, updateHospitalDto: UpdateHospitalDto) {
    this.hospitals = this.hospitals.map((hospital) => {
      if (hospital.id === id) {
        return { ...hospital, ...updateHospitalDto };
      }
      return hospital;
    });

    return this.findOne(id);
  }
}
