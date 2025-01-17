import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Post } from './post.entity';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.media)
  post: Post;

  @Column({ type: 'varchar', length: 255 })
  url: string;
}
