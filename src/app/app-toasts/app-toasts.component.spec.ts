import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppToastsComponent } from './app-toasts.component';

describe('AppToastsComponent', () => {
  let component: AppToastsComponent;
  let fixture: ComponentFixture<AppToastsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppToastsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppToastsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
