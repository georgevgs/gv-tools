import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-email-generator',
  templateUrl: './email-generator.component.html',
  styleUrls: ['./email-generator.component.css']
})
export class EmailGeneratorComponent implements OnInit {
  email: string = '';
  password: string = '';
  name: string = 'Contact';
  surname: string = 'Pigeon';

  constructor(
    private clipboardApi: ClipboardService
  ) { }

  ngOnInit(): void {
  }

  generateEmail(): void {
    this.email = [...Array(15 + 10)].map((value) => (Math.random() * 1000000).toString(36).replace('.', '')).join('').substring(0, 15) + '@gvtools.work';
  }

  generatePassword(): void {
    this.password = [...Array(11 + 10)].map((value) => (Math.random() * 1000000).toString(36).replace('.', '')).join('').substring(0, 11);
  }

  copyText(): void {
    this.clipboardApi.copyFromContent(this.email);
  }

  copyPassword(): void {
    this.clipboardApi.copyFromContent(this.password);
  }

  copyName(): void {
    this.clipboardApi.copyFromContent(this.name);
  }

  copySurname(): void {
    this.clipboardApi.copyFromContent(this.surname);
  }

}
