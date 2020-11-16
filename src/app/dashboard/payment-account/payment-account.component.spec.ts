import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaymentAccountComponent } from './payment-account.component';

describe('PaymentAccountComponent', () => {
  let component: PaymentAccountComponent;
  let fixture: ComponentFixture<PaymentAccountComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
