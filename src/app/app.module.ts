import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { WorkingDaysAppComponent } from './working-days-app/working-days-app.component';
import { EmailGeneratorComponent } from './email-generator/email-generator.component';

@NgModule({
  declarations: [
    AppComponent,
    WorkingDaysAppComponent,
    EmailGeneratorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
