import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';
import { Seniority } from './candidates.model';

// Use candidates collection
@Entity('candidates')
export class CandidateEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  seniority: Seniority;

  @Column()
  yearsExperience: number;

  @Column()
  availability: boolean;
}
