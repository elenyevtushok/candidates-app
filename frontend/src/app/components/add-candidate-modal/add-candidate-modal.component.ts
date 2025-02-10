import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CandidatesService } from '../../services/candidates.service';
import { saveAs } from 'file-saver';
import { catchError, EMPTY, take } from 'rxjs';

@Component({
	selector: 'app-add-candidate-modal',
	templateUrl: './add-candidate-modal.component.html',
	styleUrls: ['./add-candidate-modal.component.css'],
})
export class AddCandidateModalComponent {
	candidateForm!: FormGroup;
	fileSelected: boolean = false;
	fileName: string = '';

	constructor(
		private fb: FormBuilder,
		private readonly dialogRef: MatDialogRef<AddCandidateModalComponent>,
		private readonly candidatesService: CandidatesService
	) { }

	ngOnInit() {
		this.candidateForm = this.fb.group({
			name: ['', Validators.required],
			surname: ['', Validators.required],
			file: [null, Validators.required],
		});
	}

	/**
	 * Submit form and close modal
	 */
	onSubmitAddCandidateForm() {
		if (this.candidateForm.valid) {
			const formData = new FormData();
			formData.append('name', this.candidateForm.get('name')?.value);
			formData.append('surname', this.candidateForm.get('surname')?.value);
			formData.append('file', this.candidateForm.get('file')?.value);

			this.candidatesService.addNewCandidate(formData)
				.pipe(
					take(1),
					catchError((error) => {
						console.error('Error submitting form', error);
						return EMPTY;
					})
				)
				.subscribe(() => {
					this.dialogRef.close(true);
				});
		}
	}

	/**
	 * Handle file upload change
	 */
	onFileUploadChange(event: any): void {
		const inputElement = event.target as HTMLInputElement;
		if (inputElement.files && inputElement.files.length > 0) {
			const file = inputElement.files[0];
			if (
				file.type === 'application/vnd.ms-excel' ||
				file.type ===
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			) {
				this.fileName = this.truncateFileName(file.name);
				this.fileSelected = true;
				this.candidateForm.controls['file'].setValue(file);
			} else {
				alert('Only .xls and .xlsx files are allowed!');
			}
		}
	}

	/**
	 * Handle the file drop event.
	 */
	onFileDrop(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			const file = files[0];
			if (
				file.type === 'application/vnd.ms-excel' ||
				file.type ===
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			) {
				this.fileName = this.truncateFileName(file.name);
				this.fileSelected = true;
				this.candidateForm.controls['file'].setValue(file);
			} else {
				alert('Only .xls and .xlsx files are allowed!');
			}
		}
	}

	/**
	 * Handle the drag over event.
	 */
	onDragOver(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		event.dataTransfer!.dropEffect = 'copy';
	}

	/**
	 * Handle the drag leave event.
	 */
	onDragLeave(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
	}

	/**
	 * Handle browsing files
	 */
	browseFiles(): void {
		const fileInput = document.getElementById('file') as HTMLInputElement;
		if (fileInput) {
			fileInput.click();
		}
	}

	/**
	 * Shorten the displayed file name if it is too long
	 */
	private truncateFileName(fileName: string): string {
		const maxLength = 15;
		const extension = fileName.split('.').pop();
		if (fileName.length > maxLength && extension) {
			return `${fileName.substring(0, maxLength)}...${extension}`;
		}
		return fileName;
	}

	/**
	 * Download example file
	 */
	downloadExample(): void {
		const exampleFileUrl = '../../../assets/files/example-file.xlsx';
		saveAs(exampleFileUrl, 'example-file.xlsx');
	}

	/**
	 * Handle closing modal and reset all the introduced data
	 */
	onCloseModal(): void {
		this.candidateForm.reset();
		this.fileSelected = false;
		this.fileName = '';
		this.dialogRef.close();
	}
}
