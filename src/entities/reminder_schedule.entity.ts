import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('reminder_schedules')
export class reminder_schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reminder_schedules)
  user: User;

  @Column({ type: 'time' })
  update_time: string;

  @Column({ type: 'time' })
  unanswered_time: string;

  @Column({ type: 'time' })
  random_time: string;
}
