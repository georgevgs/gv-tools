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

  holidays = ['10', '60', '252', '157', '289', '2511', '2611']; // Greek public holidays
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
    const [sYear, sMonth, sDay] = this.sddate.split('-');
    const [eYear, eMonth, eDay] = this.eddate.split('-');
    const startDate = new Date(sYear, sMonth - 1, sDay);
    const endDate = new Date(eYear, eMonth - 1, eDay);

    this.getBusinessDatesCount(startDate, endDate, 'Days');
  }

  runMonth(): void {
    const [year, month] = this.mdate.split('-');
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    this.getBusinessDatesCount(startDate, endDate, 'Month');
  }

  getBusinessDatesCount(
    startDate: Date,
    endDate: number | Date,
    tab: string
  ): void {
    try {
      this.count = 0;

      const currentYear = new Date().getFullYear();
      const currentEaster = this.calculateOrthodoxEaster(currentYear);

      // Calculate rotating holidays in Greece
      const rotatingHolidays = [
        {
          date: new Date(currentEaster.getTime() - 48 * 24 * 60 * 60 * 1000),
          name: 'cleanMonday',
        },
        {
          date: new Date(currentEaster.getTime() - 2 * 24 * 60 * 60 * 1000),
          name: 'bigFriday',
        },
        {
          date: new Date(currentEaster.getTime() + 24 * 60 * 60 * 1000),
          name: 'easterMonday',
        },
        {
          date: new Date(currentEaster.getTime() + 50 * 24 * 60 * 60 * 1000),
          name: 'whitMonday',
        },
      ];

      rotatingHolidays.forEach((holiday) => {
        const month = holiday.date.getMonth().toString();
        const date = holiday.date.getDate().toString();
        const holidayStr = date + month;
        this.rotatingHolidays.push(holidayStr);
      });

      // Calculate first of May
      const firstMayDate = new Date(`${currentYear}-05-01`);
      if (firstMayDate.getDay() === 6) {
        // Saturday is 6, Sunday is 0
        firstMayDate.setDate(firstMayDate.getDate() + 2); // add 2 days to get the first working day (Monday)
      } else if (firstMayDate.getDay() === 0) {
        firstMayDate.setDate(firstMayDate.getDate() + 1); // add 1 day to get the first working day (Monday)
      }
      const firstMay = `${firstMayDate.getDate()}${firstMayDate.getMonth()}`;
      this.holidays.push(firstMay);

      const countWorkDays = (
        startDate: Date,
        endDate: number | Date,
        holidays: string[],
        rotatingHolidays: string[]
      ): number => {
        let count = 0;
        const curDate = new Date(startDate.getTime());
        while (curDate <= endDate) {
          const dayOfWeek = curDate.getDay();
          const date = curDate.getDate();
          const month = curDate.getMonth();
          const dateMonth = `${date}${month}`;
          if (
            dayOfWeek !== 0 &&
            dayOfWeek !== 6 &&
            !holidays.includes(dateMonth) &&
            !rotatingHolidays.includes(dateMonth)
          ) {
            count++;
          }
          curDate.setDate(curDate.getDate() + 1);
        }
        return count;
      };

      const workDays = countWorkDays(
        startDate,
        endDate,
        this.holidays,
        this.rotatingHolidays
      );
      const daysOff =
        tab === 'Month' ? this.mdaysoff : tab === 'Days' ? this.ddaysoff : 0;
      const workDaysWithoutDaysOff = workDays - daysOff;
      this.count = workDaysWithoutDaysOff;

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
      this.secondsToDday <= 0 &&
      this.minutesToDday <= 0 &&
      this.hoursToDday <= 0
    ) {
      this.subscription.unsubscribe();
      this.timerHasNotStarted = true;

      localStorage.removeItem('dDay');
      this.ngOnInit();
    }
  }

  startTimer() {
    localStorage.removeItem('dDay');
    this.dDay = this.addHours(new Date(), 8);
    localStorage.setItem('dDay', this.dDay.toString());

    this.subscription = interval(1000).subscribe((x) => {
      this.getTimeDifference();
    });

    this.timerHasNotStarted = false;
  }

  resetTimer() {
    this.subscription.unsubscribe();
    this.timerHasNotStarted = true;
    localStorage.removeItem('dDay');

    this.hoursToDday = 8;
    this.minutesToDday = 0;
    this.secondsToDday = 0;
  }

  addHours(date: Date, hours: number) {
    date.setHours(date.getHours() + hours);

    return date;
  }
}
