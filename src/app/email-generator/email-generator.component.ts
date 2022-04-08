import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-email-generator',
  templateUrl: './email-generator.component.html',
  styleUrls: ['./email-generator.component.css']
})
export class EmailGeneratorComponent implements OnInit {
  email: string = '';

  constructor(
    private clipboardApi: ClipboardService
  ) { }

  ngOnInit(): void {
  }

  generateEmail(): void {
    this.email = [...Array(15 + 10)].map((value) => (Math.random() * 1000000).toString(36).replace('.', '')).join('').substring(0, 15) + '@gvtools.work';
  }

  copyText(): void {
    this.clipboardApi.copyFromContent(this.email);
  }

}
