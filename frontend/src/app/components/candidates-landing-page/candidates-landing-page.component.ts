import { Component, ViewChild } from '@angular/core';
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

  constructor(
    private readonly candidatesService: CandidatesService,
    public dialog: MatDialog
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.fetchCandidatesList();
    // this.dataSource = new MatTableDataSource<Candidate>(this.candidates);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  fetchCandidatesList() {
    this.candidatesService
      .getAllCandidates()
      .pipe(
        catchError((error) => {
          console.log('Error fetching candidates', error);
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response !== null) {
          this.candidates = response;
          this.dataSource.data = this.candidates;
          console.log(this.candidates);
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getExperienceValue(years: number): number {
    return years > 10 ? 100 : (years / 10) * 100;
  }

  openAddCandidateDialog(): void {
    const dialogRef = this.dialog.open(AddCandidateModalComponent, {
      width: '90%',
      height: '90%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchCandidatesList();
      }
    });
  }
}
