import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {Angulartics2RouterlessModule} from 'angulartics2/routerlessmodule';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    Angulartics2RouterlessModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
