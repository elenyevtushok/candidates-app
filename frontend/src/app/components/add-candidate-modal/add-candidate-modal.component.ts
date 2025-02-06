import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CandidatesService } from '../../services/candidates.service';
import { saveAs } from 'file-saver';

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
  ) {}

  ngOnInit() {
    this.candidateForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      file: [null, Validators.required],
    });
  }

  onSubmitAddCandidateForm() {
    if (this.candidateForm.valid) {
      const formData = new FormData();
      formData.append('name', this.candidateForm.get('name')?.value);
      formData.append('surname', this.candidateForm.get('surname')?.value);
      formData.append('file', this.candidateForm.get('file')?.value);

      this.candidatesService.addNewCandidate(formData).subscribe(
        (response) => {
          console.log('Form submitted successfully', response);
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error submitting form', error);
        }
      );
    }
  }

  onFileUploadChange(event: any): void {
    const inputNode = event.target as HTMLInputElement;
    if (inputNode.files && inputNode.files.length > 0) {
      const file = inputNode.files[0];
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

  browseFiles(): void {
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  private truncateFileName(fileName: string): string {
    const maxLength = 15;
    const extension = fileName.split('.').pop();
    if (fileName.length > maxLength && extension) {
      return `${fileName.substring(0, maxLength)}...${extension}`;
    }
    return fileName;
  }

  downloadExample(): void {
    const exampleFileUrl = '../../../assets/files/example-file.xlsx';
    saveAs(exampleFileUrl, 'example-file.xlsx');
  }

  onCloseModal(): void {
    this.candidateForm.reset();
    this.fileSelected = false;
    this.fileName = '';
    this.dialogRef.close();
  }
}
