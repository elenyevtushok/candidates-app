import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Candidate } from '../models/candidate';
import { Observable, of } from 'rxjs';
import { ConfigService } from './config.service';
import { Paginated } from '../models/paginated';

@Injectable({
	providedIn: 'root',
})
export class CandidatesService {
	private baseUrl = '';

	constructor(
		private readonly httpClient: HttpClient,
		private readonly configService: ConfigService
	) {
		const config = this.configService.getConfig();
		this.baseUrl = config.apiUrl;
	}

	/**
	 * Get all candidates
	 */
	getAllCandidates(page: number, perPage: number, search?: string): Observable<Paginated<Candidate>> {
		let url = `${this.baseUrl}/candidates?page=${page}&limit=${perPage}`;
		if (search) {
			url += `&search=${encodeURIComponent(search)}`;
		}
		return this.httpClient.get<Paginated<Candidate>>(url);
	}

	/**
	 * Add new candidate
	 */
	addNewCandidate(formData: FormData): Observable<Candidate> {
		return this.httpClient.post<Candidate>(
			`${this.baseUrl}/candidates`,
			formData
		);
	}
}

