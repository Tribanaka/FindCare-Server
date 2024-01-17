import { Practitioner } from 'src/practitioners/practitioner.entity';
import { Schedule } from 'src/schedules/schedule.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('date')
  date: string;

  @Column()
  time: string;

  @ManyToOne(() => Practitioner)
  practitioner: Practitioner;

  @ManyToOne(() => User)
  user: User;
}
