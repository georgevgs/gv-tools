import { Component, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-working-days-app',
  templateUrl: './working-days-app.component.html',
  styleUrls: ['./working-days-app.component.scss'],
})
export class WorkingDaysAppComponent implements OnInit {
  constructor() {}

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
  timerHasNotStarted = true;

  private subscription!: Subscription;

  public dateNow = new Date();
  public dDay: any;

  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;

  public timeDifference!: number;
  public secondsToDday: number = 0;
  public minutesToDday: number = 0;
  public hoursToDday: number = 8;

  ngOnInit(): void {
    if ('dDay' in localStorage) {
      this.dDay = localStorage.getItem('dDay');
      this.dDay = new Date(this.dDay);

      this.timerHasNotStarted = false;
      this.startTimer();
    } else {
      this.dDay = this.addHours(this.dateNow, 8);
      localStorage.setItem('dDay', this.dDay.toString());
    }

    const today = new Date();

    this.minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.submittedDatesLS = localStorage.getItem('submittedDatesLS');
    this.submittedDatesLS = JSON.parse(this.submittedDatesLS);
    if (this.submittedDatesLS) {
      this.submittedDatesLS.forEach((date: Date) => {
        this.submittedDates.push(new Date(date));
      });

      const submittedDatesTimestampLS = new Date(
        localStorage.getItem('submittedDatesTimestampLS')!
      );
      if (submittedDatesTimestampLS) {
        if (today.getMonth() != submittedDatesTimestampLS.getMonth()) {
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  holidays = ['10', '60', '252', '14', '157', '289', '2511', '2611']; // Greek public holidays
  rotatingHolidays: string[] = []; // Greek public rotating holidays

  calculateOrthodoxEaster(year: number) {
    const a = year % 4;
    const b = year % 7;
    const c = year % 19;
    const d = (19 * c + 15) % 30;
    const e = (2 * a + 4 * b - d + 34) % 7;

    const month = Math.floor((d + e + 114) / 31);
    const day = ((d + e + 114) % 31) + 1;
    const julianDate = new Date(Date.UTC(year, month - 1, day - 1));
    const daysToAdd = 13 - julianDate.getUTCDay();

    const orthodoxEaster = new Date(Date.UTC(year, month - 1, day + daysToAdd));

    return orthodoxEaster;
  }

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

  getBusinessDatesCount(
    startDate: Date,
    endDate: number | Date,
    tab: string
  ): void {
    try {
      this.count = 0;

      // *** Calculate rotating holidays in Greece START ***
      const currentYear = new Date().getFullYear();
      const currentEaster = this.calculateOrthodoxEaster(currentYear);

      const cleanMondayDate = new Date(
        currentEaster.getTime() - 48 * 24 * 60 * 60 * 1000
      );
      const cleanMonday =
        cleanMondayDate.getDate().toString() +
        cleanMondayDate.getMonth().toString();

      const bigFriday =
        (currentEaster.getDate() - 2).toString() +
        currentEaster.getMonth().toString();

      const easterMonday =
        (currentEaster.getDate() + 1).toString() +
        currentEaster.getMonth().toString();

      const whitMondayDate = new Date(
        currentEaster.getTime() + 50 * 24 * 60 * 60 * 1000
      );
      const whitMonday =
        whitMondayDate.getDate().toString() +
        whitMondayDate.getMonth().toString();

      this.rotatingHolidays.push(
        cleanMonday,
        bigFriday,
        easterMonday,
        whitMonday
      );
      // *** Calculate rotating holidays in Greece END ***

      const curDate = new Date(startDate.getTime());
      while (curDate <= endDate) {
        const dayOfWeek = curDate.getDay();
        const date = curDate.getDate();
        const month = curDate.getMonth();
        const dateMonth = date.toString() + month.toString();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          if (
            !this.holidays.includes(dateMonth) &&
            !this.rotatingHolidays.includes(dateMonth)
          ) {
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
    } catch (e) {}
  }

  dateHandler(): void {
    // if(this.submittedDates.length > this.oldDateLength){
    //   console.log('added');
    // } else {
    //   console.log('removed');
    // }
    // this.oldDateLength = this.submittedDates.length;
    localStorage.removeItem('submittedDatesLS');
    localStorage.setItem(
      'submittedDatesLS',
      JSON.stringify(this.submittedDates)
    );
    localStorage.setItem(
      'submittedDatesTimestampLS',
      JSON.stringify(new Date().getMonth())
    );
  }

  private getTimeDifference() {
    this.timeDifference = this.dDay.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference: number) {
    this.secondsToDday = Math.floor(
      (timeDifference / this.milliSecondsInASecond) % this.SecondsInAMinute
    );
    this.minutesToDday = Math.floor(
      (timeDifference / (this.milliSecondsInASecond * this.minutesInAnHour)) %
        this.SecondsInAMinute
    );
    this.hoursToDday = Math.floor(
      (timeDifference /
        (this.milliSecondsInASecond *
          this.minutesInAnHour *
          this.SecondsInAMinute)) %
        this.hoursInADay
    );

    if (
      this.secondsToDday === 0 &&
      this.minutesToDday === 0 &&
      this.hoursToDday === 0
    ) {
      this.subscription.unsubscribe();
      this.timerHasNotStarted = true;

      localStorage.removeItem('dDay');
      this.ngOnInit();
    }
  }

  startTimer() {
    this.subscription = interval(1000).subscribe((x) => {
      this.getTimeDifference();
    });

    this.timerHasNotStarted = false;
  }

  addHours(date: Date, hours: number) {
    date.setHours(date.getHours() + hours);

    return date;
  }
}
