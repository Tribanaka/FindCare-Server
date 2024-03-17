import { Practitioner } from 'src/practitioners/practitioner.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  day_of_week: string;

  @Column('time')
  opening_hour: string;

  @Column('time')
  closing_hour: string;

  @ManyToOne(() => Practitioner)
  practitioner: Practitioner;
}
