import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('reminder_schedules')
export class ReminderSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.ReminderSchedules)
  user: User;

  @Column({ type: 'time' })
  update: string;

  @Column({ type: 'time' })
  unanswered: string;

  @Column({ type: 'time' })
  random: string;
}
