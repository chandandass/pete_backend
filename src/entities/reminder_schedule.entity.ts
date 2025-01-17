import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('reminder_schedules')
export class ReminderSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reminderSchedules)
  user: User;

  @Column({ type: 'time' })
  updateTime: string;

  @Column({ type: 'time' })
  unansweredTime: string;

  @Column({ type: 'time' })
  randomTime: string;
}
