import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {NgMetaWidgetsLibModule} from 'ngx-edu-sharing-metaqs2';
import {LoginComponent} from '../login/login.component';
import {EduSharingApiModule} from 'ngx-edu-sharing-api';
const environment = {
  apiPath: 'https://metaqs-2.staging.openeduhub.net',
  eduSharingPath: 'https://repository.staging.openeduhub.net/edu-sharing',
  useDummyValues: false,
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgMetaWidgetsLibModule.forRoot({
      eduSharingPath: environment.eduSharingPath,
      apiPath: environment.apiPath,
      useDummyValues: environment.useDummyValues,
    }),
    EduSharingApiModule.forRoot({ rootUrl: environment.apiPath }),
    LoginComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
