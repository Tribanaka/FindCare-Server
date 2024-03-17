import { Hospital } from 'src/hospitals/hospital.entity';
import { Schedule } from 'src/schedules/schedule.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('practitioner')
export class Practitioner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column('text')
  bio: string;

  @Column()
  specialization: string;

  @Column({ nullable: true })
  photoUrl: string;

  @OneToMany(() => Schedule, (schedule) => schedule.practitioner)
  schedules: Schedule[];

  @ManyToOne(() => Hospital, (hospital) => hospital.practitioners)
  hospital: Hospital;
}
