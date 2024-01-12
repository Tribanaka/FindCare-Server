import { Schedule } from 'src/schedules/schedule.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Practitioner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  bio: string;

  @Column()
  specialization: string;

  @OneToMany(() => Schedule, (schedule) => schedule.practitioner)
  schedules: Schedule[];
}
