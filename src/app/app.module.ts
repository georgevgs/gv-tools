import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WorkingDaysAppComponent } from './working-days-app/working-days-app.component';

@NgModule({
  declarations: [
    AppComponent,
    WorkingDaysAppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
