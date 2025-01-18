import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('static_reflection-prompt')
export class StaticReflectionPrompt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  txt: string;
}
