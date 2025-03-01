import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('track_reflection_prompt')
export class TrackReflectionPrompt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  prompt_id: number;

  @Column({ type: 'enum', enum: ['ACTIVE', 'ARCHIVED'] })
  status: 'ACTIVE' | 'ARCHIVED';

  @Column({ type: 'date', nullable: true })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.TrackReflectionPrompts)
  user: User;
}
