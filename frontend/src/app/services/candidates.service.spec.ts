import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CandidatesService } from './candidates.service';
import { ConfigService } from './config.service';
import { Candidate } from '../models/candidate';

describe('CandidatesService', () => {
  let service: CandidatesService;
  let httpMock: HttpTestingController;
  let mockConfigService: jasmine.SpyObj<ConfigService>;

  beforeEach(() => {
    mockConfigService = jasmine.createSpyObj('ConfigService', ['getConfig']);
    mockConfigService.getConfig.and.returnValue({
      apiUrl: 'http://localhost:3000',
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ConfigService, useValue: mockConfigService }],
    });

    service = TestBed.inject(CandidatesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all candidates', () => {
    const mockCandidates: Candidate[] = [
      {
        name: 'John',
        surname: 'Doe',
        seniority: 'senior',
        yearsExperience: 5,
        availability: true,
      },
      {
        name: 'Jane',
        surname: 'Smith',
        seniority: 'junior',
        yearsExperience: 2,
        availability: false,
      },
    ];

    service.getAllCandidates().subscribe((candidates) => {
      expect(candidates.length).toBe(2);
      expect(candidates).toEqual(mockCandidates);
    });

    const req = httpMock.expectOne('http://localhost:3000/candidates');
    expect(req.request.method).toBe('GET');
    req.flush(mockCandidates);
  });

  it('should add a new candidate', () => {
    const formData = new FormData();
    formData.append('name', 'John');
    formData.append('surname', 'Doe');

    const mockCandidate: Candidate = {
      name: 'John',
      surname: 'Doe',
      seniority: 'senior',
      yearsExperience: 5,
      availability: true,
    };

    service.addNewCandidate(formData).subscribe((candidate) => {
      expect(candidate).toEqual(mockCandidate);
    });

    const req = httpMock.expectOne('http://localhost:3000/add-candidate');
    expect(req.request.method).toBe('POST');
    req.flush(mockCandidate);
  });
});
