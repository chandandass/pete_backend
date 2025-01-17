import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('static_reflection-prompt')
export class Memory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  txt: string;
}
