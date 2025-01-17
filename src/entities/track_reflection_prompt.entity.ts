import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('track_reflection_prompt')
export class TrackReflectionPrompt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  promptId: number;

  @Column({ type: 'enum', enum: ['ACTIVE', 'ARCHIVED'] })
  status: 'ACTIVE' | 'ARCHIVED';

  @Column({ type: 'date', nullable: true })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.trackReflectionPrompts)
  user: User;
}
