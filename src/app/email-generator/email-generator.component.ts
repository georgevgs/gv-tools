import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import * as CryptoJS from 'crypto-js';

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
  plainText!: string;  
  encryptText!: string;  
  encPassword!: string;  
  decPassword!: string;  
  conversionEncryptOutput: string = '';  
  conversionDecryptOutput: string = '';  

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

  copyEncryptTextarea(): void {
    this.clipboardApi.copyFromContent(this.conversionEncryptOutput);
  }

  copyDecryptTextarea(): void {
    this.clipboardApi.copyFromContent(this.conversionDecryptOutput);
  }

  convertText(conversion:string) {  
    if (conversion=="encrypt") {  
      this.conversionEncryptOutput = CryptoJS.AES.encrypt(this.plainText.trim(), this.encPassword.trim()).toString();  
    } else {  
      this.conversionDecryptOutput = CryptoJS.AES.decrypt(this.encryptText.trim(), this.decPassword.trim()).toString(CryptoJS.enc.Utf8);  
    }
  }  
}
