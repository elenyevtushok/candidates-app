import { Component } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-upload-file-animation',
  template: `<div class="upload-animation">
    <ng-lottie
      [options]="options"
      style="width: 100%; height: auto; transform: scale(1.2)"
    ></ng-lottie>
  </div>`,
  styleUrls: ['./upload-file-animation.component.css'],
})
export class UploadFileAnimationComponent {
  options: AnimationOptions = {
    path: 'assets/animations/upload-file.json',
  };
}
