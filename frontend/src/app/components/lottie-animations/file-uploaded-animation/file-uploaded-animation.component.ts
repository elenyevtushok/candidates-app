import { Component } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-file-uploaded-animation',
  template: `<div class="upload-animation">
    <ng-lottie [options]="options"></ng-lottie>
  </div>`,
  styleUrls: ['./file-uploaded-animation.component.css'],
})
export class FileUploadedAnimationComponent {
  options: AnimationOptions = {
    path: 'assets/animations/file-uploaded.json',
    loop: false,
  };
}
