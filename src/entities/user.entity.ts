import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Child } from './child.entity';
import { Post } from './post.entity';
import { ReminderSchedule } from './reminder_schedule.entity';
import { Partnership } from './partnership.entity';
import { TrackReflectionPrompt } from './track_reflection_prompt.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'enum', enum: ['MOM', 'DAD'] })
  relation: 'MOM' | 'DAD';

  @OneToMany(() => Child, (child) => child.parentUser)
  children: Child[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(
    () => ReminderSchedule,
    (reminderSchedule) => reminderSchedule.user,
  )
  reminderSchedules: ReminderSchedule[];

  @OneToMany(() => Partnership, (partnership) => partnership.user)
  partnerships: Partnership[];

  @OneToMany(
    () => TrackReflectionPrompt,
    (trackReflectionPrompt) => trackReflectionPrompt.user,
  )
  trackReflectionPrompts: TrackReflectionPrompt[];
}
