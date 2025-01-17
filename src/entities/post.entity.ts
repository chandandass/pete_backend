import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Media } from './media.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ['IMAGE', 'TEXT'] })
  input_type: 'IMAGE' | 'TEXT';

  @Column({ type: 'enum', enum: ['FAMILY', 'KID', 'REFLECTION'] })
  prompt_type: 'FAMILY' | 'KID' | 'REFLECTION';

  @Column({ type: 'enum', enum: ['ANSWERED', 'UNANSWERED'], nullable: true })
  status: 'ANSWERED' | 'UNANSWERED';

  @Column({ type: 'date' })
  created_at: Date;

  @Column({ type: 'date' })
  last_update: Date;

  @Column({ type: 'date' })
  show_order_date: Date;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @OneToMany(() => Media, (media) => media.post)
  media: Media[];
}
