import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewPaymentAccountComponent } from './new-payment-account.component';

describe('NewPaymentAccountComponent', () => {
  let component: NewPaymentAccountComponent;
  let fixture: ComponentFixture<NewPaymentAccountComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPaymentAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPaymentAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
