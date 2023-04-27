import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-email-generator',
  templateUrl: './email-generator.component.html',
  styleUrls: ['./email-generator.component.scss'],
})
export class EmailGeneratorComponent implements OnInit {
  email: string = '';
  password: string = '';
  name: any;
  surname: string = 'Pigeon';
  plainText!: string;
  encryptText!: string;
  encPassword!: string;
  decPassword!: string;
  conversionEncryptOutput: string = '';
  conversionDecryptOutput: string = '';

  constructor(private clipboardApi: ClipboardService) {}

  ngOnInit(): void {
    this.fetchNames('male');
  }

  generateRandomString(strLength: number, isPassword: boolean): string {
    if (isPassword) {
      const chars =
        '0123456789abcdefghijklmnopqrstuvwxyz!@%*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let password = '';

      for (let i = 0; i < strLength; i++) {
        const randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
      }

      password += '!';

      return password;
    } else {
      return [...Array(strLength + 10)]
        .map((value) => (Math.random() * 1000000).toString(36).replace('.', ''))
        .join('')
        .substring(0, strLength);
    }
  }

  generateEmail(): void {
    this.email = this.generateRandomString(15, false) + '@gvtools.work';
  }

  generatePassword(): void {
    this.password = this.generateRandomString(11, true);
  }

  copyText(elementToCopy: string): void {
    this.clipboardApi.copyFromContent(elementToCopy);
  }

  convertText(conversion: string) {
    if (conversion == 'encrypt') {
      this.conversionEncryptOutput = CryptoJS.AES.encrypt(
        this.plainText.trim(),
        this.encPassword.trim()
      ).toString();
    } else {
      this.conversionDecryptOutput = CryptoJS.AES.decrypt(
        this.encryptText.trim(),
        this.decPassword.trim()
      ).toString(CryptoJS.enc.Utf8);
    }
  }

  async fetchData(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      this.name = response.json();
      return response.json();
    } catch (error) {
      console.error('Unable to fetch data:', error);
    }
  }

  fetchNames(nameType: string) {
    return this.fetchData(`https://www.randomlists.com/data/names-${nameType}.json`);
  }
}
