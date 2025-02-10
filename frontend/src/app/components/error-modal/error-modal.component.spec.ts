import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorModalComponent } from './error-modal.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ErrorModalComponent', () => {
  let component: ErrorModalComponent;
  let fixture: ComponentFixture<ErrorModalComponent>;
	let dialogRef: jasmine.SpyObj<MatDialogRef<ErrorModalComponent>>;


	const mockDialogData = {
		title: 'Test Error',
		errorMessage: 'Test error message',
		body: 'Test body',
		button: 'Close'
	};

  beforeEach(() => {
		dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
			imports: [MatDialogModule],
      declarations: [ErrorModalComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{ provide: MatDialogRef, useValue: dialogRef },
				{ provide: MAT_DIALOG_DATA, useValue: mockDialogData }
			]
    });
    fixture = TestBed.createComponent(ErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

	it('should close dialog when close button is clicked', () => {
		const closeButton = fixture.nativeElement.querySelector('button');
		closeButton.click();
		expect(dialogRef.close).toHaveBeenCalled();
	});
});
