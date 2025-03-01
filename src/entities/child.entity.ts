import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('children')
export class Child {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'date' })
  date_of_birth: Date;

  @Column({ type: 'enum', enum: ['MALE', 'FEMALE'] })
  gender: 'MALE' | 'FEMALE';

  @ManyToOne(() => User, (user) => user.children)
  parent_user: User;
}
