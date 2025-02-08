import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesLandingPageComponent } from './candidates-landing-page.component';
import { CandidatesService } from '../../services/candidates.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
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
        MatSortModule,
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
    mockCandidatesService.getAllCandidates.and.returnValue(of([]));
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
    mockCandidatesService.getAllCandidates.and.returnValue(of(candidates));

    component.ngOnInit();

    expect(component.candidates).toEqual(candidates);
    expect(component.dataSource.data).toEqual(candidates);
  });

  it('should handle error when fetching candidates list', () => {
    spyOn(console, 'log');
    mockCandidatesService.getAllCandidates.and.returnValue(throwError('Error'));

    component.fetchCandidatesList();

    expect(console.log).toHaveBeenCalledWith(
      'Error fetching candidates',
      'Error'
    );
    expect(component.candidates).toEqual([]);
  });

  it('should filter candidates', () => {
    const event = { target: { value: 'john' } } as unknown as Event;
    component.dataSource.data = [
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

    component.applyFilter(event);

    expect(component.dataSource.filter).toBe('john');
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
