import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCandidateModalComponent } from './add-candidate-modal.component';

describe('AddCandidateModalComponent', () => {
  let component: AddCandidateModalComponent;
  let fixture: ComponentFixture<AddCandidateModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCandidateModalComponent]
    });
    fixture = TestBed.createComponent(AddCandidateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
