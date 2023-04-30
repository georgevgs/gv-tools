import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingDaysAppComponent } from './working-days-app.component';

describe('WorkingDaysAppComponent', () => {
  let component: WorkingDaysAppComponent;
  let fixture: ComponentFixture<WorkingDaysAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkingDaysAppComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingDaysAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test runDay method
  it('should calculate working days between two dates', () => {
    component.sddate = '2023-05-01';
    component.eddate = '2023-05-31';
    component.ddaysoff = 0;
    component.runDay();
    expect(component.count).toBeGreaterThan(0);
  });

  // Test runMonth method
  it('should calculate working days in a month', () => {
    component.mdate = '2023-05';
    component.mdaysoff = 0;
    component.runMonth();
    expect(component.count).toBeGreaterThan(0);
  });

  // Test dateHandler method
  it('should store submitted dates in localStorage', () => {
    const testDate = new Date();
    component.submittedDates = [testDate];
    component.dateHandler();
    const submittedDatesLS = JSON.parse(
      localStorage.getItem('submittedDatesLS')!
    );
    expect(submittedDatesLS).toEqual([{ ...testDate }]);
  });

  // Test resetTimer method
  it('should reset the timer', () => {
    component.resetTimer();
    expect(component.timerHasNotStarted).toBeTruthy();
    expect(component.hoursToDday).toEqual(8);
    expect(component.minutesToDday).toEqual(0);
    expect(component.secondsToDday).toEqual(0);
  });
});
