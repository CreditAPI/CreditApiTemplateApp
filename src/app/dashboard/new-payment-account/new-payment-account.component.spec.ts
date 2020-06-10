import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPaymentAccountComponent } from './new-payment-account.component';

describe('NewPaymentAccountComponent', () => {
  let component: NewPaymentAccountComponent;
  let fixture: ComponentFixture<NewPaymentAccountComponent>;

  beforeEach(async(() => {
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
