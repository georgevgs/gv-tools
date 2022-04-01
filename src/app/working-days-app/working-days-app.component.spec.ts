import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingDaysAppComponent } from './working-days-app.component';

describe('WorkingDaysAppComponent', () => {
  let component: WorkingDaysAppComponent;
  let fixture: ComponentFixture<WorkingDaysAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkingDaysAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingDaysAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
