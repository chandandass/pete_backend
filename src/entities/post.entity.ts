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

  @Column({ type: 'enum', enum: ['image', 'text'] })
  inputType: 'image' | 'text';

  @Column({ type: 'enum', enum: ['FAMILY', 'KID', 'REFLECTION'] })
  promptType: 'FAMILY' | 'KID' | 'REFLECTION';

  @Column({ type: 'enum', enum: ['ANSWERED', 'UNANSWERED'], nullable: true })
  status: 'ANSWERED' | 'UNANSWERED';

  @Column({ type: 'date' })
  createdAt: Date;

  @Column({ type: 'date' })
  lastUpdate: Date;

  @Column({ type: 'date' })
  showOrderDate: Date;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @OneToMany(() => Media, (media) => media.post)
  media: Media[];
}
