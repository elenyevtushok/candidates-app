import { Component } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Candidate } from 'src/app/models/candidate';
import { CandidatesService } from 'src/app/services/candidates.service';

@Component({
	selector: 'app-candidates-landing-page',
	templateUrl: './candidates-landing-page.component.html',
	styleUrls: ['./candidates-landing-page.component.css']
})
export class CandidatesLandingPageComponent {
	candidates: Candidate[] = [];

	constructor(
		private readonly candidatesService: CandidatesService
	) { }

	ngOnInit() {
		this.fetchCandidatesList();
	}

	fetchCandidatesList() {
		this.candidatesService.getAllCandidates().pipe(
			catchError((error) => {
				console.log('Error fetching candidates', error);
				return of(null);
			})
		)
			.subscribe((response) => {
				if (response !== null) {
					this.candidates = response;
					console.log(this.candidates);
				}
			})
	}
}
