import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('static_kid_mvp_prompt')
export class Milestone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  relative_to_birth: number;

  @Column({ nullable: true })
  type: string;

  @Column()
  txt: string;
}
