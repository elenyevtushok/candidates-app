import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { CandidateEntity } from './candidate.entity';
import {
  Candidate,
  CandidateCreateRequest,
  CandidateFileModel,
  Paginated,
} from './candidates.model';
import { PaginateQuery } from 'nestjs-paginate';

export const DEFAULT_PAGE_SIZE = 10;

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(CandidateEntity)
    private candidateRepository: MongoRepository<CandidateEntity>,
  ) {}

  async createCandidate(
    request: CandidateCreateRequest,
    parsedFileData: CandidateFileModel,
  ): Promise<Candidate> {
    const candidateEntity = this.candidateRepository.create({
      name: request.name,
      surname: request.surname,
      seniority: parsedFileData.seniority,
      yearsExperience: parsedFileData.yearsExperience,
      availability: parsedFileData.availability,
    });

    return this.candidateRepository.save(candidateEntity).then((entity) => {
      return this.mapToDto(entity);
    });
  }

  findAll(query: PaginateQuery): Promise<Paginated<CandidateEntity>> {
    const page = query.page ?? 0;
    const limit = query.limit ?? DEFAULT_PAGE_SIZE;
    const filter = query.search
      ? {
          $or: [
            { name: new RegExp(query.search, 'i') },
            { surname: new RegExp(query.search, 'i') },
            { seniority: new RegExp(query.search, 'i') },
          ],
        }
      : {};

    return this.candidateRepository
      .findAndCount({
        where: filter,
        skip: page * limit,
		  take: limit,
      })
      .then(([data, total]) =>
        this.convertToPaginated(data, total, page, limit),
      );
  }

  mapToDto(entity: CandidateEntity): Candidate {
    return {
      ...entity,
      id: entity.id.toHexString(),
    };
  }

  convertToPaginated<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): Paginated<T> {
    return {
      data,
      meta: {
        total,
        lastPage: Math.ceil(total / limit) - 1,
        currentPage: page,
        perPage: limit,
      },
    };
  }
}
