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
		const mockResponse = {
			data: [
				{
					name: 'John',
					surname: 'Doe',
					seniority: 'senior' as 'senior',
					yearsExperience: 5,
					availability: true,
				},
				{
					name: 'Jane',
					surname: 'Smith',
					seniority: 'junior' as 'junior',
					yearsExperience: 2,
					availability: false,
				},
			],
			meta: {
				total: 2,
				lastPage: 1,
				currentPage: 0,
				perPage: 10
			}
		};

		service.getAllCandidates(0, 10).subscribe((response) => {
			expect(response.data.length).toBe(2);
			expect(response.data).toEqual(mockResponse.data);
		});

		const req = httpMock.expectOne('http://localhost:3000/candidates?page=0&limit=10');
		expect(req.request.method).toBe('GET');
		req.flush(mockResponse);
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

		const req = httpMock.expectOne('http://localhost:3000/candidates');
		expect(req.request.method).toBe('POST');
		req.flush(mockCandidate);
	});
});
