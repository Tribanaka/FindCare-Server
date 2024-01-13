import { Practitioner } from 'src/practitioners/practitioner.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Hospital {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @OneToMany(() => Practitioner, (practitioner) => practitioner.hospital)
  practitioners: Practitioner[];
}
