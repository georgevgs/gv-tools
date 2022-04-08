import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailGeneratorComponent } from './email-generator.component';

describe('EmailGeneratorComponent', () => {
  let component: EmailGeneratorComponent;
  let fixture: ComponentFixture<EmailGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailGeneratorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
