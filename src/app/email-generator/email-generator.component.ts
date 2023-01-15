import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-email-generator',
  templateUrl: './email-generator.component.html',
  styleUrls: ['./email-generator.component.scss']
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

  generateRandomString(strLength: number): string {
    return [...Array(strLength + 10)].map((value) => (Math.random() * 1000000).toString(36).replace('.', '')).join('').substring(0, strLength);
  }

  generateEmail(): void {
    this.email =  this.generateRandomString(15) + '@gvtools.work';
  }

  generatePassword(): void {
    this.password = this.generateRandomString(11);
  }

  copyText(elementToCopy: string): void {
    this.clipboardApi.copyFromContent(elementToCopy);
  }

  convertText(conversion:string) {  
    if (conversion=="encrypt") {  
      this.conversionEncryptOutput = CryptoJS.AES.encrypt(this.plainText.trim(), this.encPassword.trim()).toString();  
    } else {  
      this.conversionDecryptOutput = CryptoJS.AES.decrypt(this.encryptText.trim(), this.decPassword.trim()).toString(CryptoJS.enc.Utf8);  
    }
  }  
}
