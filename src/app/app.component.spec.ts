import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'gv-tools'`, () => {
    expect(component.title).toEqual('gv-tools');
  });

  it('should call goToLink when a link is clicked', () => {
    spyOn(component, 'goToLink');
    const url = 'https://github.com/georgevgs/gv-tools';
    component.goToLink(url);
    expect(component.goToLink).toHaveBeenCalledWith(url);
  });
});
