import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('partnership')
export class Partnership {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.partnerships)
  user: User;

  @Column({ type: 'int' })
  partner_id: number;
}
