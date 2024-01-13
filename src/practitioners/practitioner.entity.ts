import { Hospital } from 'src/hospitals/hospital.entity';
import { Schedule } from 'src/schedules/schedule.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Practitioner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column('text')
  bio: string;

  @Column()
  specialization: string;

  @OneToMany(() => Schedule, (schedule) => schedule.practitioner)
  schedules: Schedule[];

  @ManyToOne(() => Hospital, (hospital) => hospital.practitioners)
  hospital: Hospital;
}
