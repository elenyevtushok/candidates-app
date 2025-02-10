import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
	title: string;
	errorMessage: string;
	body: string;
	button: string;
}

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent {
	constructor(
		public dialogRef: MatDialogRef<ErrorModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData
	) {}
}
