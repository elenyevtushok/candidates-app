import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadedAnimationComponent } from './file-uploaded-animation.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FileUploadedAnimationComponent', () => {
  let component: FileUploadedAnimationComponent;
  let fixture: ComponentFixture<FileUploadedAnimationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadedAnimationComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(FileUploadedAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
