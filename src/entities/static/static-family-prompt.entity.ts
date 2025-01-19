import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('static_family_prompt')
export class StaticFamilyPrompt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  repeat: number;

  @Column()
  date: Date;

  @Column()
  type: string;
}
