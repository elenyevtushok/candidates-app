import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Candidate } from '../models/candidate';
import { Observable, of } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
	providedIn: 'root'
})

export class CandidatesService {
	private baseUrl = '';
	private useMockData = false;
	private mockCandidates: Candidate[] = [];

	constructor(
		private readonly httpClient: HttpClient,
		private readonly configService: ConfigService
	) {
		const config = this.configService.getConfig();
		this.baseUrl = config.apiUrl;
		this.useMockData = config.useMockData;
		this.mockCandidates = config.mockUsers;
	}

	getAllCandidates(): Observable<Candidate[]> {
		if (this.useMockData) {
			console.log("Using mock data instead of API");
			return of(this.mockCandidates); // Return fake data
		}
		return this.httpClient.get<Candidate[]>(`${this.baseUrl}/candidates`);
	}
}
// export class CandidatesService {
// 	baseUrl = '';

// 	constructor(
// 		private readonly httpClient: HttpClient,
// 		private readonly configService: ConfigService
// 	) {
// 		this.baseUrl = this.configService.getConfig().apiUrl;
// 	}

// 	getAllCandidates(): Observable<Candidate[]> {
// 		return this.httpClient.get<Candidate[]>(
// 			this.baseUrl + '/candidates'
// 		)
// 	}
// }
