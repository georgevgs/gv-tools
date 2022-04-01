import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-working-days-app',
  templateUrl: './working-days-app.component.html',
  styleUrls: ['./working-days-app.component.css']
})
export class WorkingDaysAppComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  document.getElementById("defaultOpen").click();

  const holidays = ['10', '60', '72', '252', '157', '289', '2511', '2611']; // Greek public holidays

  runDay(): void {
    @ViewChild('#start') input: ElementRef;
    this.input.nativeElement.setAttribute('test', ‘’);
    const sDay = document.querySelector('#start').value.split('-')[2];
    const sMonth = parseInt(document.querySelector('#start').value.split('-')[1]) - 1;
    const sYear = document.querySelector('#start').value.split('-')[0];

    const eDay = document.querySelector('#end').value.split('-')[2];
    const eMonth = parseInt(document.querySelector('#end').value.split('-')[1]) - 1;
    const eYear = document.querySelector('#end').value.split('-')[0];

    const startDate = new Date(sYear, sMonth, sDay);
    const endDate = new Date(eYear, eMonth, eDay);

    console.log("Start: " + startDate);
    console.log("End: " + endDate);

    this.getBusinessDatesCount(startDate, endDate, 'Days');
  }

  runMonth(): void {
    const sDay = 01;
    const sMonth = parseInt(document.querySelector('#month').value.split('-')[1]) - 1;
    const sYear = document.querySelector('#month').value.split('-')[0];

    let eDay = 31;

    switch (sMonth) {
      case 00: // January
        eDay = 31;
        break;
      case 01: // February
        eDay = 28;
        break;
      case 02: // March
        eDay = 31;
        break;
      case 03: // April
        eDay = 30;
        break;
      case 04: // May
        eDay = 31;
        break;
      case 05: // June
        eDay = 30;
        break;
      case 06: // July
        eDay = 31;
        break;
      case 07: // August
        eDay = 31;
        break;
      case 08: // September
        eDay = 30;
        break;
      case 09: // October
        eDay = 31;
        break;
      case 10: // November
        eDay = 30;
        break;
      case 11: // December
        eDay = 31;
    }

    const eMonth = parseInt(document.querySelector('#month').value.split('-')[1]) - 1;
    const eYear = document.querySelector('#month').value.split('-')[0];

    const startDate = new Date(sYear, sMonth, sDay);
    const endDate = new Date(eYear, eMonth, eDay);

    console.log("Start: " + startDate);
    console.log("End: " + endDate);

    this.getBusinessDatesCount(startDate, endDate, 'Month');
  }

  getBusinessDatesCount(startDate, endDate, tab): any {
    try {
      let count = 0;
      const curDate = new Date(startDate.getTime());
      while (curDate <= endDate) {
        const dayOfWeek = curDate.getDay();
        const date = curDate.getDate();
        const month = curDate.getMonth();
        const dateMonth = date.toString() + month.toString();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          if (!(this.holidays.includes(dateMonth))) {
            count++;
          }
        }
        curDate.setDate(curDate.getDate() + 1);
      }

      curDate.setDate(curDate.getDate() - 1); // Revert back one day to calculate correctly bellow

      let daysOff = 0;
      if (tab === 'Month') {
        daysOff = document.querySelector('#daysOffM').value;
        console.log('Month ' + daysOff);
      } else if (tab === 'Days') {
        daysOff = document.querySelector('#daysOffD').value;
        console.log('Days ' + daysOff);
      }

      // Rotating holidays
      count = count - daysOff;
      if (curDate.getMonth() === 3) { // Minus two days for April Easter
        count = count - 2;
      } else if (curDate.getMonth() === 4) { // Minus one day for 1st of May
        count = count - 1;
      } else if (curDate.getMonth() === 5) { // Minus one day for Agiou Pneumatos
        count = count - 1;
      }

      if ((curDate.getFullYear() === 2024 && curDate.getMonth() === 1) || (curDate.getFullYear() === 2028 && curDate.getMonth() === 1)) { // Adds one day for Feb
        count = count + 1;
      }

      const wisDays = Math.ceil(count / 2); // Gets workinsync days

      if (daysOff > 0) {
        if (count > 20) {
          alert('Ουψψ αν και αδειούλα πήραμε τον ήπιαμε, έχουμε ' + count + ' εργάσιμες' + '\r\nΧώσε min ' + wisDays + ' μέρες office στο WorkinSync.');
        } else if (count > 10 && count <= 20) {
          alert('Την τσεπώσαμε την αδειούλα, έχουμε ' + count + ' εργάσιμες' + '\r\nΧώσε min ' + wisDays + ' μέρες office στο WorkinSync.');
        } else {
          alert(count + ' εργάσιμες' + '\r\nΧώσε min ' + wisDays + ' μέρες office στο WorkinSync.');
        }
      } else {
        if (count > 20) {
          alert('Ουψψ τον ήπιαμε, έχουμε ' + count + ' εργάσιμες' + '\r\nΧώσε min ' + wisDays + ' μέρες office στο WorkinSync.');
        } else if (count > 16 && count <= 20) {
          alert('Καλά σου έκατσε με τις αργιούλες, έχουμε ' + count + ' εργάσιμες' + '\r\nΧώσε min ' + wisDays + ' μέρες office στο WorkinSync.');
        } else {
          alert(count + ' εργάσιμες' + '\r\nΧώσε min ' + wisDays + ' μέρες office στο WorkinSync.');
        }
      }
      return count;
    } catch (e) { }
  }

  openDatePicker(evt, pickerTypeName): void {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(pickerTypeName).style.display = "block";
    evt.currentTarget.className += " active";
  }
}
