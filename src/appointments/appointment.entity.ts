import { Practitioner } from 'src/practitioners/practitioner.entity';
import { Schedule } from 'src/schedules/schedule.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Practitioner)
  practitioner: Practitioner;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Schedule)
  schedule: Schedule;

  @Column('timestamp')
  startTime: Date;

  @Column('timestamp')
  endTime: Date;
}
