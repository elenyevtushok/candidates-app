export enum Seniority {
  JUNIOR = 'junior',
  SENIOR = 'senior',
}

export interface Candidate {
  id: string;
  name: string;
  surname: string;
  seniority: Seniority;
  yearsExperience: number;
  availability: boolean;
}

/**
 * Interface for the specific Excel data structure
 */
export interface CandidateFileModel {
  seniority: Seniority;
  yearsExperience: number;
  availability: boolean;
}

export interface CandidateCreateRequest {
  name: string;
  surname: string;
}

export interface Paginated<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
  };
}
