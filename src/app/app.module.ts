import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { WorkingDaysAppComponent } from './working-days-app/working-days-app.component';
import { EmailGeneratorComponent } from './email-generator/email-generator.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DarkModeToggleComponent } from './dark-mode-toggle/dark-mode-toggle.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMultipleDatesModule } from 'ngx-multiple-dates';
import { MatNativeDateModule } from '@angular/material/core';

import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBQTOkPEwXC2GDMxk2aAhnWDh3jKnJyLs0",
  authDomain: "gv-tools-214fb.firebaseapp.com",
  projectId: "gv-tools-214fb",
  storageBucket: "gv-tools-214fb.appspot.com",
  messagingSenderId: "878223652639",
  appId: "1:878223652639:web:7ade5263d3b8f65f20222a",
  measurementId: "G-YMESWHVZCP"
};
@NgModule({
  declarations: [
    AppComponent,
    WorkingDaysAppComponent,
    EmailGeneratorComponent,
    DarkModeToggleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    NgxMultipleDatesModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
