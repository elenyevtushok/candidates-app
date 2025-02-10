import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesLandingPageComponent } from './candidates-landing-page.component';
import { CandidatesService } from '../../services/candidates.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, of, throwError } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Candidate } from '../../models/candidate';
import { MatProgressBarModule } from '@angular/material/progress-bar';

describe('CandidatesLandingPageComponent', () => {
	let component: CandidatesLandingPageComponent;
	let fixture: ComponentFixture<CandidatesLandingPageComponent>;
	let mockCandidatesService: jasmine.SpyObj<CandidatesService>;
	let mockDialog: jasmine.SpyObj<MatDialog>;

	beforeEach(async () => {
		mockCandidatesService = jasmine.createSpyObj('CandidatesService', [
			'getAllCandidates',
		]);
		mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
	});

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [CandidatesLandingPageComponent],
			imports: [
				BrowserAnimationsModule,
				MatPaginatorModule,
				MatTableModule,
				MatDialogModule,
				MatProgressBarModule
			],
			providers: [
				{ provide: CandidatesService, useValue: mockCandidatesService },
				{ provide: MatDialog, useValue: mockDialog },
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CandidatesLandingPageComponent);
		component = fixture.componentInstance;
		mockCandidatesService.getAllCandidates.and.returnValue(of({
			data: [],
			meta: {
				total: 0,
				lastPage: 0,
				currentPage: 0,
				perPage: 10
			}
		}));
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should fetch candidates list on init', () => {
		const candidates: Candidate[] = [
			{
				name: 'John',
				surname: 'Doe',
				seniority: 'senior',
				yearsExperience: 5,
				availability: true,
			},
		];
		const paginatedCandidates = {
			data: candidates,
			meta: {
				total: 1,
				lastPage: 0,
				currentPage: 0,
				perPage: 10
			}
		};
		mockCandidatesService.getAllCandidates.and.returnValue(of(paginatedCandidates));

		component.ngOnInit();

		expect(component.candidates).toEqual(candidates);
		expect(component.dataSource.data).toEqual(candidates);
	});

	it('should handle error when fetching candidates list', () => {
		const consoleSpy = spyOn(console, 'error');
		mockCandidatesService.getAllCandidates.and.returnValue(throwError(() => 'Error'));

		component.fetchCandidatesList(0, 10);

		expect(consoleSpy).toHaveBeenCalledWith(
			'Error fetching candidates',
			'Error'
		);
		expect(component.candidates).toEqual([]);
	});

	it('should trigger search with filtered value', (done) => {
		const searchTerm = 'john';
		const event = { target: { value: searchTerm } } as unknown as Event;

		// Spy on the fetchCandidatesList method
		spyOn(component, 'fetchCandidatesList');

		// Subscribe to the searchSubject to verify the search term
		(component as any).searchSubject.pipe(
			debounceTime(300),
			distinctUntilChanged()
		).subscribe((value: string) => {
			expect(value).toBe(searchTerm.toLowerCase());
			expect(component.fetchCandidatesList).toHaveBeenCalledWith(0, component.defaultPageSize, searchTerm.toLowerCase());
			done();
		});

		component.applyFilter(event);
	});

	it('should open add candidate dialog', () => {
		const dialogRefSpyObj = jasmine.createSpyObj({
			afterClosed: of(true),
			close: null,
		});
		mockDialog.open.and.returnValue(dialogRefSpyObj);

		component.openAddCandidateDialog();

		expect(mockDialog.open).toHaveBeenCalled();
		expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
	});

	it('should calculate experience value correctly', () => {
		expect(component.getExperienceValue(5)).toBe(50);
		expect(component.getExperienceValue(10)).toBe(100);
		expect(component.getExperienceValue(15)).toBe(100);
	});
});
