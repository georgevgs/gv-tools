import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateRemoveEvent } from 'ngx-multiple-dates';
@Component({
  selector: 'app-working-days-app',
  templateUrl: './working-days-app.component.html',
  styleUrls: ['./working-days-app.component.scss']
})
export class WorkingDaysAppComponent implements OnInit {

  constructor() { }

  sddate: any;
  eddate: any;
  mdate: any;
  mdaysoff: number = 0;
  ddaysoff: number = 0;
  count: number = 0;
  result: string = '';
  multipleDates: any;
  submittedDatesLS: any = [];
  submittedDates: Date[] = [];
  oldDateLength = this.submittedDates.length;
  minDate!: Date;
  maxDate!: Date;

  ngOnInit(): void {
    const today = new Date();

    this.minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.submittedDatesLS = localStorage.getItem('submittedDatesLS');
    this.submittedDatesLS = JSON.parse(this.submittedDatesLS);
    if(this.submittedDatesLS){
      this.submittedDatesLS.forEach((date: Date) => {
        this.submittedDates.push(new Date(date));
      });
      
      const submittedDatesTimestampLS = new Date(localStorage.getItem('submittedDatesTimestampLS')!);
      if(submittedDatesTimestampLS){
        if(today.getMonth() != submittedDatesTimestampLS.getMonth()){
          localStorage.removeItem('submittedDatesLS');
          this.submittedDates = [];
        }
      }
    }

    if ((today.getMonth() + 1).toString().length === 1) {
      this.mdate = today.getFullYear() + '-0' + (today.getMonth() + 1);
    } else {
      this.mdate = today.getFullYear() + '-' + (today.getMonth() + 1);
    }
  }

  holidays = ['10', '60', '252', '14', '157', '289', '2511', '2611']; // Greek public holidays
  rotatingHolidays = ['271', '143', '173', '55']; // Greek public rotating holidays 2023

  runDay(): void {
    const sDay = this.sddate.split('-')[2];
    const sMonth = parseInt(this.sddate.split('-')[1]) - 1;
    const sYear = this.sddate.split('-')[0];

    const eDay = this.eddate.split('-')[2];
    const eMonth = parseInt(this.eddate.split('-')[1]) - 1;
    const eYear = this.sddate.split('-')[0];

    const startDate = new Date(sYear, sMonth, sDay);
    const endDate = new Date(eYear, eMonth, eDay);

    this.getBusinessDatesCount(startDate, endDate, 'Days');
  }

  runMonth(): void {    
    const sDay = 0o1;
    const sMonth = parseInt(this.mdate.split('-')[1]) - 1;
    const sYear = this.mdate.split('-')[0];

    let eDay = 31;

    switch (sMonth as number) {
      case 0: // January
        eDay = 31;
        break;
      case 1: // February
        if (sYear === '2024' || sYear === '2028') {
          eDay = 29;
        } else {
          eDay = 28;
        }
        break;
      case 2: // March
        eDay = 31;
        break;
      case 3: // April
        eDay = 30;
        break;
      case 4: // May
        eDay = 31;
        break;
      case 5: // June
        eDay = 30;
        break;
      case 6: // July
        eDay = 31;
        break;
      case 7: // August
        eDay = 31;
        break;
      case 8: // September
        eDay = 30;
        break;
      case 9: // October
        eDay = 31;
        break;
      case 10: // November
        eDay = 30;
        break;
      case 11: // December
        eDay = 31;
    }

    const eMonth = parseInt(this.mdate.split('-')[1]) - 1;
    const eYear = this.mdate.split('-')[0];

    const startDate = new Date(sYear, sMonth, sDay);
    const endDate = new Date(eYear, eMonth, eDay);

    this.getBusinessDatesCount(startDate, endDate, 'Month');
  }

  getBusinessDatesCount(startDate: Date, endDate: number | Date, tab: string): void {
    try {
      this.count = 0;
      const curDate = new Date(startDate.getTime());
      while (curDate <= endDate) {
        const dayOfWeek = curDate.getDay();
        const date = curDate.getDate();
        const month = curDate.getMonth();
        const dateMonth = date.toString() + month.toString();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          if (!(this.holidays.includes(dateMonth)) && !(this.rotatingHolidays.includes(dateMonth))) {
            this.count++;
          }
        }
        curDate.setDate(curDate.getDate() + 1);
      }

      curDate.setDate(curDate.getDate() - 1); // Revert back one day to calculate correctly bellow

      let daysOff = 0;
      if (tab === 'Month') {
        daysOff = this.mdaysoff;
      } else if (tab === 'Days') {
        daysOff = this.ddaysoff;
      }

      this.count = this.count - daysOff;

      const wisDays = Math.ceil(this.count / 2); // Gets workinsync days

      if (daysOff > 0) {
        if (this.count > 20) {
          this.result = `Ουψψ αν και πήρες άδεια, έχεις ${this.count} εργάσιμες. Βάλε κατ' ελάχιστο ${wisDays} μέρες Work From Office στο WorkinSync.`;
        } else if (this.count > 10) {
          this.result = `Την τσέπωσες την αδειούλα, έχεις ${this.count} εργάσιμες. Βάλε κατ' ελάχιστο ${wisDays} μέρες Work From Office στο WorkinSync.`;
        } else {
          this.result = `Έχεις ${this.count} εργάσιμες. Βάλε κατ' ελάχιστο ${wisDays} μέρες Work From Office στο WorkinSync.`;
        }
      } else {
        if (this.count > 20) {
          this.result = `Ουψψ έχεις ${this.count} εργάσιμες. Βάλε κατ' ελάχιστο ${wisDays} μέρες Work From Office στο WorkinSync.`;
        } else if (this.count > 16) {
          this.result = `Καλά σου έκατσε με τις αργιούλες, έχεις ${this.count} εργάσιμες. Βάλε κατ' ελάχιστο ${wisDays} μέρες Work From Office στο WorkinSync.`;
        } else {
          this.result = `Έχεις ${this.count} εργάσιμες. Βάλε κατ' ελάχιστο ${wisDays} μέρες Work From Office στο WorkinSync.`;
        }
      }
    } catch (e) { }
  }

  dateHandler(): void {
    // if(this.submittedDates.length > this.oldDateLength){
    //   console.log('added');
    // } else {
    //   console.log('removed');
    // }
    // this.oldDateLength = this.submittedDates.length;
    localStorage.removeItem('submittedDatesLS');
    localStorage.setItem('submittedDatesLS', JSON.stringify(this.submittedDates));
    localStorage.setItem('submittedDatesTimestampLS', JSON.stringify(new Date().getMonth()));
  }
}
