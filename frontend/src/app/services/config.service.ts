import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ConfigService {
	private config: any;

	constructor(private http: HttpClient) { }

	loadConfig(): Promise<void> {
		return lastValueFrom(this.http.get('/assets/config.json')).then(data => {
			this.config = data;
		});
	}

	getConfig(): any {
		return this.config;
	}
}
