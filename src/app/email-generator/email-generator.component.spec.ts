import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailGeneratorComponent } from './email-generator.component';

describe('EmailGeneratorComponent', () => {
  let component: EmailGeneratorComponent;
  let fixture: ComponentFixture<EmailGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailGeneratorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate random email', () => {
    component.generateEmail();
    expect(component.email).toMatch(/^[a-z0-9]{15}@gvtools\.work$/);
  });

  it('should generate random password', () => {
    component.generatePassword();
    expect(component.password).toMatch(/^[0-9a-zA-Z!@%*()]{12}$/);
  });

  it('should generate a name and surname', () => {
    component.generateName();
    expect(component.name).toBeTruthy();
    expect(component.surname).toBeTruthy();
  });
});
