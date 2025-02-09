import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { CandidateService } from './candidate.service';
import { CandidateEntity } from './candidate.entity';
import {
  CandidateCreateRequest,
  CandidateFileModel,
  Seniority,
} from './candidates.model';
import { PaginateQuery } from 'nestjs-paginate';

describe('CandidateService', () => {
  let service: CandidateService;
  let repository: MongoRepository<CandidateEntity>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandidateService,
        {
          provide: getRepositoryToken(CandidateEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CandidateService>(CandidateService);
    repository = module.get<MongoRepository<CandidateEntity>>(
      getRepositoryToken(CandidateEntity),
    );
  });

  describe('createCandidate', () => {
    it('should create and return a candidate', async () => {
      const request: CandidateCreateRequest = {
        name: 'John',
        surname: 'Doe',
      };

      const fileData: CandidateFileModel = {
        seniority: Seniority.SENIOR,
        yearsExperience: 5,
        availability: true,
      };

      const mockEntity = {
        id: new ObjectId(),
        ...request,
        ...fileData,
      };

      mockRepository.create.mockReturnValue(mockEntity);
      mockRepository.save.mockResolvedValue(mockEntity);

      const result = await service.createCandidate(request, fileData);

      expect(result).toEqual({
        ...mockEntity,
        id: mockEntity.id.toHexString(),
      });
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...request,
        ...fileData,
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated results with default values', async () => {
      const mockData = [
        {
          id: new ObjectId(),
          name: 'John',
          surname: 'Doe',
          seniority: 'Senior',
        },
      ];

      mockRepository.findAndCount.mockResolvedValue([mockData, 1]);

      const paginateQuery: PaginateQuery = {
        path: 'candidates',
        page: 0,
        limit: 10,
      };

      const result = await service.findAll(paginateQuery);

      expect(result.meta).toEqual({
        total: 1,
        lastPage: 0,
        currentPage: 0,
        perPage: 10,
      });
      expect(result.data).toEqual(mockData);
    });

    it('should apply search filter when search query is provided', async () => {
      const searchQuery: PaginateQuery = {
        path: 'candidates',
        page: 0,
        limit: 10,
        search: 'John',
      };

      await service.findAll(searchQuery);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {
          $or: [
            { name: new RegExp('John', 'i') },
            { surname: new RegExp('John', 'i') },
            { seniority: new RegExp('John', 'i') },
          ],
        },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('mapToDto', () => {
    it('should convert ObjectId to string in dto', () => {
      const objectId = new ObjectId();
      const entity = {
        id: objectId,
        name: 'John',
        surname: 'Doe',
      };

      const result = service.mapToDto(entity as CandidateEntity);

      expect(result.id).toBe(objectId.toHexString());
      expect(result.name).toBe(entity.name);
      expect(result.surname).toBe(entity.surname);
    });
  });

  describe('convertToPaginated', () => {
    it('should correctly calculate pagination metadata with full page', () => {
      const mockData = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const total = 10;
      const page = 0;
      const limit = 3;

      const result = service['convertToPaginated'](
        mockData,
        total,
        page,
        limit,
      );

      expect(result).toEqual({
        data: mockData,
        meta: {
          total: 10,
          lastPage: 3,
          currentPage: 0,
          perPage: 3,
        },
      });
    });

    it('should handle empty data array', () => {
      const mockData: any[] = [];
      const total = 0;
      const page = 0;
      const limit = 10;

      const result = service['convertToPaginated'](
        mockData,
        total,
        page,
        limit,
      );

      expect(result).toEqual({
        data: [],
        meta: {
          total: 0,
          lastPage: -1,
          currentPage: 0,
          perPage: 10,
        },
      });
    });

    it('should calculate correct lastPage for non-even division', () => {
      const mockData = [{ id: 1 }];
      const total = 11;
      const page = 1;
      const limit = 4;

      const result = service['convertToPaginated'](
        mockData,
        total,
        page,
        limit,
      );

      expect(result).toEqual({
        data: mockData,
        meta: {
          total: 11,
          lastPage: 2,
          currentPage: 1,
          perPage: 4,
        },
      });
    });
  });
});
