import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesLandingPageComponent } from './candidates-landing-page.component';

describe('CandidatesLandingPageComponent', () => {
  let component: CandidatesLandingPageComponent;
  let fixture: ComponentFixture<CandidatesLandingPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidatesLandingPageComponent]
    });
    fixture = TestBed.createComponent(CandidatesLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
