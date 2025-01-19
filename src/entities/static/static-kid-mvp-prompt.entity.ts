import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('static_kid_prompt')
export class StaticKidPrompt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  relative_to_birth: number;

  @Column({ nullable: true })
  @Column({ type: 'enum', enum: ['IMAGE', 'TEXT'] })
  type: 'IMAGE' | 'TEXT';

  @Column()
  txt: string;
}
