import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCandidateModalComponent } from './add-candidate-modal.component';
import { CandidatesService } from '../../services/candidates.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { Candidate } from '../../models/candidate';

describe('AddCandidateModalComponent', () => {
  let component: AddCandidateModalComponent;
  let fixture: ComponentFixture<AddCandidateModalComponent>;
  let mockCandidatesService: jasmine.SpyObj<CandidatesService>;
  let fb: FormBuilder;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AddCandidateModalComponent>>;

  beforeEach(async () => {
    mockCandidatesService = jasmine.createSpyObj('CandidatesService', [
      'addNewCandidate',
    ]);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCandidateModalComponent],
      imports: [
        MatDialogModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: CandidatesService, useValue: mockCandidatesService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(AddCandidateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.candidateForm).toBeDefined();
    expect(component.candidateForm.controls['name']).toBeDefined();
    expect(component.candidateForm.controls['surname']).toBeDefined();
    expect(component.candidateForm.controls['file']).toBeDefined();
  });

  it('should submit the form successfully', () => {
    component.ngOnInit();
    component.candidateForm.setValue({
      name: 'John',
      surname: 'Doe',
      file: new File([''], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
    });

    const mockCandidate: Candidate = {
      name: 'John',
      surname: 'Doe',
      seniority: 'senior',
      yearsExperience: 5,
      availability: true,
    };

    mockCandidatesService.addNewCandidate.and.returnValue(of(mockCandidate));

    component.onSubmitAddCandidateForm();

    expect(mockCandidatesService.addNewCandidate).toHaveBeenCalled();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should handle form submission error', () => {
    component.ngOnInit();
    component.candidateForm.setValue({
      name: 'John',
      surname: 'Doe',
      file: new File([''], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
    });
    mockCandidatesService.addNewCandidate.and.returnValue(throwError('Error'));

    component.onSubmitAddCandidateForm();

    expect(mockCandidatesService.addNewCandidate).toHaveBeenCalled();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should handle file upload change', () => {
    const file = new File([''], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const event = { target: { files: [file] } };
    component.onFileUploadChange(event);

    expect(component.fileName).toBe('test.xlsx');
    expect(component.fileSelected).toBeTrue();
    expect(component.candidateForm.controls['file'].value).toBe(file);
  });

  it('should handle file drop', () => {
    const file = new File([''], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const event = {
      preventDefault: () => {},
      stopPropagation: () => {},
      dataTransfer: { files: [file] },
    };
    component.onFileDrop(event as unknown as DragEvent);

    expect(component.fileName).toBe('test.xlsx');
    expect(component.fileSelected).toBeTrue();
    expect(component.candidateForm.controls['file'].value).toBe(file);
  });

  it('should handle drag over event', () => {
    const event = {
      preventDefault: () => {},
      stopPropagation: () => {},
      dataTransfer: { dropEffect: '' },
    };
    component.onDragOver(event as DragEvent);

    expect(event.dataTransfer.dropEffect).toBe('copy');
  });

  it('should handle drag leave event', () => {
    const event = { preventDefault: () => {}, stopPropagation: () => {} };
    component.onDragLeave(event as DragEvent);
  });

  it('should browse files', () => {
    const clickSpy = jasmine.createSpy('click');
    spyOn(document, 'getElementById').and.returnValue({
      click: clickSpy,
    } as any);

    component.browseFiles();

    expect(document.getElementById).toHaveBeenCalledWith('file');
    expect(clickSpy).toHaveBeenCalled();
  });
});
