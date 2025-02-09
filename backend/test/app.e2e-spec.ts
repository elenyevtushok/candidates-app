import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppModule } from './../src/app.module';
import { CandidateEntity } from '../src/candidates/candidate.entity';
import { MongoRepository } from 'typeorm';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Seniority } from '../src/candidates/candidates.model';
import * as path from 'path';
import * as fs from 'fs';

describe('CandidateController (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let candidateRepository: MongoRepository<CandidateEntity>;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mongodb',
          url: mongoUri,
          entities: [CandidateEntity],
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    candidateRepository = moduleFixture.get<MongoRepository<CandidateEntity>>(
      getRepositoryToken(CandidateEntity),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await candidateRepository.clear();
  });

  describe('/candidates (GET)', () => {
    it('should return paginated candidates', async () => {
      // Prepare test data
      const testCandidates = [
        candidateRepository.create({
          name: 'John',
          surname: 'Doe',
          seniority: Seniority.SENIOR,
          yearsExperience: 5,
          availability: true,
        }),
        candidateRepository.create({
          name: 'Jane',
          surname: 'Smith',
          seniority: Seniority.JUNIOR,
          yearsExperience: 1,
          availability: true,
        }),
      ];

      await candidateRepository.save(testCandidates);

      // Execute test
      const response = await request(app.getHttpServer())
        .get('/candidates?page=0&limit=10')
        .expect(200);

      // Assert response
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.data).toHaveLength(2);
      expect(response.body.meta).toEqual({
        total: 2,
        lastPage: 0,
        currentPage: 0,
        perPage: 10,
      });
    });

    it('should filter candidates by search term', async () => {
      // Prepare test data
      const testCandidates = [
        {
          name: 'John',
          surname: 'Doe',
          seniority: Seniority.SENIOR,
          yearsExperience: 5,
          availability: true,
        },
        {
          name: 'Jane',
          surname: 'Smith',
          seniority: Seniority.JUNIOR,
          yearsExperience: 1,
          availability: true,
        },
      ];

      await candidateRepository.save(testCandidates);

      // Execute test
      const response = await request(app.getHttpServer())
        .get('/candidates?search=John')
        .expect(200);

      // Assert response
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('John');
    });
  });

  describe('/candidates (POST)', () => {
    it('should create a new candidate with uploaded file', async () => {
      const fileName = 'example-file.xlsx';
      const filePath = path.join(__dirname, '../test/files/', fileName);
      const fileBuffer = fs.readFileSync(filePath);

      const candidateData = {
        name: 'John',
        surname: 'Doe',
      };

      const response = await request(app.getHttpServer())
        .post('/candidates')
        .field('name', candidateData.name)
        .field('surname', candidateData.surname)
        .attach('file', fileBuffer, fileName)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        name: candidateData.name,
        surname: candidateData.surname,
        seniority: Seniority.JUNIOR,
        yearsExperience: 3,
        availability: false,
      });

      // Verify the candidate was saved in the database
      const savedCandidate = await candidateRepository.findOne({
        where: {
          name: candidateData.name,
          surname: candidateData.surname,
        },
      });

      expect(savedCandidate).toBeTruthy();
    });
  });
});
