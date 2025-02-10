import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, of } from 'rxjs';
import { Candidate } from 'src/app/models/candidate';
import { CandidatesService } from 'src/app/services/candidates.service';
import { AddCandidateModalComponent } from '../add-candidate-modal/add-candidate-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-candidates-landing-page',
	templateUrl: './candidates-landing-page.component.html',
	styleUrls: ['./candidates-landing-page.component.css'],
})
export class CandidatesLandingPageComponent {

	candidates: Candidate[] = [];
	displayedColumns: string[] = [
		'name',
		'surname',
		'seniority',
		'yearsExperience',
		'availability',
	];
	dataSource: MatTableDataSource<Candidate> = new MatTableDataSource<Candidate>(
		[]
	);

	totalItems = 0;
	firstPage = 0;
	defaultPageSize = 10;

	constructor(
		private readonly candidatesService: CandidatesService,
		public dialog: MatDialog,
		public cdr: ChangeDetectorRef
	) { }

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	ngOnInit() {
		this.fetchCandidatesList(this.firstPage, this.defaultPageSize);
	}

	ngAfterViewInit() {
		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;

		this.paginator.page.subscribe(() => {
			this.fetchCandidatesList(this.paginator.pageIndex, this.paginator.pageSize);
		});
	}

	/**
	 * Fetch candidates list
	 */
	fetchCandidatesList(pageIndex: number, pageSize: number) {
		this.candidatesService.getAllCandidates(pageIndex, pageSize).pipe(
			catchError((error) => {
				console.error('Error fetching candidates', error);
				return of({ data: [], meta: { total: 0, lastPage: 0, currentPage: 0, perPage: this.paginator.pageSize } });
			})
		).subscribe((response) => {
			if (response) {
				this.candidates = response.data;
				this.totalItems = response.meta.total;
				this.dataSource = new MatTableDataSource(this.candidates);
			}
		});
	}

	/**
	 * Apply filter to the table
	 */
	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	/**
	 * Get experience value for progress bar
	 */
	getExperienceValue(years: number): number {
		return years > 10 ? 100 : (years / 10) * 100;
	}

	/**
	 * Open add candidate modal
	 */
	openAddCandidateDialog(): void {
		const dialogRef = this.dialog.open(AddCandidateModalComponent, {
			width: '90%',
			height: '90%',
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.fetchCandidatesList(this.paginator.pageIndex, this.paginator.pageSize);
			}
		});
	}
}
