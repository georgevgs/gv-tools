import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-working-days-app',
  templateUrl: './working-days-app.component.html',
  styleUrls: ['./working-days-app.component.css']
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
  lssavedWISDays: any = [];

  ngOnInit(): void {
    const today = new Date();

    if ((today.getMonth() + 1).toString().length === 1) {
      this.mdate = today.getFullYear() + '-0' + (today.getMonth() + 1);
    } else {
      this.mdate = today.getFullYear() + '-' + (today.getMonth() + 1);
    }
  }

  holidays = ['10', '60', '72', '252', '157', '289', '2511', '2611']; // Greek public holidays
  rotatingHolidays = ['223', '253', '24', '135']; // Greek public rotating holidays

  runDay(): void {
    const sDay = this.sddate.split('-')[2];
    const sMonth = parseInt(this.sddate.split('-')[1]) - 1;
    const sYear = this.sddate.split('-')[0];

    const eDay = this.eddate.split('-')[2];
    const eMonth = parseInt(this.eddate.split('-')[1]) - 1;
    const eYear = this.sddate.split('-')[0];

    const startDate = new Date(sYear, sMonth, sDay);
    const endDate = new Date(eYear, eMonth, eDay);

    console.log("Start: " + startDate);
    console.log("End: " + endDate);

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

    console.log("Start: " + startDate);
    console.log("End: " + endDate);

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

        // // Rotating holidays
        // if (curDate.getMonth() === 3) { // Minus two days for April Easter
        //   this.count = this.count - 2;
        // } else if (curDate.getMonth() === 4) { // Minus one day for 1st of May
        //   this.count = this.count - 1;
        // } else if (curDate.getMonth() === 5) { // Minus one day for Agiou Pneumatos
        //   this.count = this.count - 1;
        // }
      } else if (tab === 'Days') {
        daysOff = this.ddaysoff;
      }

      this.count = this.count - daysOff;

      // if ((curDate.getFullYear() === 2024 && curDate.getMonth() === 1) || (curDate.getFullYear() === 2028 && curDate.getMonth() === 1)) { // Adds one day for Feb
      //   this.count = this.count + 1;
      // }

      const wisDays = Math.ceil(this.count / 2); // Gets workinsync days

      if (daysOff > 0) {
        if (this.count > 20) {
          this.result = `Ουψψ αν και πήρες άδεια, έχεις ${this.count} εργάσιμες. Βάλε κατ' ελάχιστο ${wisDays} μέρες Work From Office στο WorkinSync.`;
        } else if (this.count > 10 && this.count <= 20) {
          this.result = `Την τσέπωσες την αδειούλα, έχεις ${this.count} εργάσιμες. Βάλε κατ' ελάχιστο ${wisDays} μέρες Work From Office στο WorkinSync.`;
        } else {
          this.result = `Έχεις ${this.count} εργάσιμες. Βάλε κατ' ελάχιστο ${wisDays} μέρες Work From Office στο WorkinSync.`;
        }
      } else {
        if (this.count > 20) {
          this.result = `Ουψψ έχεις ${this.count} εργάσιμες. Βάλε κατ' ελάχιστο ${wisDays} μέρες Work From Office στο WorkinSync.`;
        } else if (this.count > 16 && this.count <= 20) {
          this.result = `Καλά σου έκατσε με τις αργιούλες, έχεις ${this.count} εργάσιμες. Βάλε κατ' ελάχιστο ${wisDays} μέρες Work From Office στο WorkinSync.`;
        } else {
          this.result = `Έχεις ${this.count} εργάσιμες. Βάλε κατ' ελάχιστο ${wisDays} μέρες Work From Office στο WorkinSync.`;
        }
      }
    } catch (e) { }
  }

  saveWISDates(): void {
    if('savedWISDays' in localStorage){
      this.lssavedWISDays = localStorage.getItem('savedWISDays');
      this.lssavedWISDays = JSON.parse(this.lssavedWISDays);
      if(this.lssavedWISDays.length > 0){
        this.lssavedWISDays.forEach((date: any) => {
          this.multipleDates.push(date);   
        });
        localStorage.setItem('savedWISDays', JSON.stringify(this.multipleDates));
        this.multipleDates = [];
        this.lssavedWISDays = localStorage.getItem('savedWISDays');
        this.lssavedWISDays = JSON.parse(this.lssavedWISDays);
        alert(`You have added ${this.lssavedWISDays.length} so far in WIS`);
      }
    } else {
      localStorage.setItem('savedWISDays', JSON.stringify(this.multipleDates));
      this.multipleDates = [];
      this.lssavedWISDays = localStorage.getItem('savedWISDays');
      this.lssavedWISDays = JSON.parse(this.lssavedWISDays);
      alert(`You have added ${this.lssavedWISDays.length} so far in WIS`);
    }
  }
}
