import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadedAnimationComponent } from './file-uploaded-animation.component';

describe('FileUploadedAnimationComponent', () => {
  let component: FileUploadedAnimationComponent;
  let fixture: ComponentFixture<FileUploadedAnimationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadedAnimationComponent]
    });
    fixture = TestBed.createComponent(FileUploadedAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
