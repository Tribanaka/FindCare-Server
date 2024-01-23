import { Practitioner } from 'src/practitioners/practitioner.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum AppointmentStatus {
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  COMPELETED = 'completed',
}

@Entity('appointment')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('date')
  date: string;

  @Column()
  time: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @ManyToOne(() => Practitioner)
  practitioner: Practitioner;

  @ManyToOne(() => User)
  user: User;
}
