import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigService } from './services/config.service';
import { CandidatesLandingPageComponent } from './components/candidates-landing-page/candidates-landing-page.component';


export function loadConfig(configService: ConfigService) {
	return () => configService.loadConfig();
}
@NgModule({
	declarations: [AppComponent, CandidatesLandingPageComponent],
	imports: [BrowserModule, AppRoutingModule, HttpClientModule],
	providers: [{
		provide: APP_INITIALIZER,
		useFactory: loadConfig,
		deps: [ConfigService],
		multi: true
	}],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
