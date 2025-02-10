import { TestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('ConfigService', () => {
  let service: ConfigService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigService],
    });
    service = TestBed.inject(ConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load config', async () => {
    const mockConfig = { key: 'value' };

    service.loadConfig().then(() => {
      expect(service.getConfig()).toEqual(mockConfig);
    });

    const req = httpMock.expectOne('/assets/config.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockConfig);
  });

  it('should return the loaded config', async () => {
    const mockConfig = { key: 'value' };

    const loadConfigPromise = service.loadConfig();

    const req = httpMock.expectOne('/assets/config.json');
    req.flush(mockConfig);

    await loadConfigPromise;

    expect(service.getConfig()).toEqual(mockConfig);
  });
});
