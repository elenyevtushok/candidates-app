import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigService } from './services/config.service';
import { CandidatesLandingPageComponent } from './components/candidates-landing-page/candidates-landing-page.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddCandidateModalComponent } from './components/add-candidate-modal/add-candidate-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { provideLottieOptions } from 'ngx-lottie';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { UploadFileAnimationComponent } from './components/lottie-animations/upload-file-animation/upload-file-animation.component';
import { FileUploadedAnimationComponent } from './components/lottie-animations/file-uploaded-animation/file-uploaded-animation.component';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ErrorModalComponent } from './components/error-modal/error-modal.component';

export function playerFactory() {
  return player;
}

export function loadConfig(configService: ConfigService) {
  return () => configService.loadConfig();
}
@NgModule({
  declarations: [
    AppComponent,
    CandidatesLandingPageComponent,
    AddCandidateModalComponent,
    UploadFileAnimationComponent,
    FileUploadedAnimationComponent,
    ErrorModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatFormFieldModule,
    MatTableModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDialogModule,
    ReactiveFormsModule,
    LottieModule.forRoot({ player: playerFactory }),
    MatSortModule,
    MatPaginatorModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [ConfigService],
      multi: true,
    },
    provideLottieOptions({
      player: () => player,
    }),
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
