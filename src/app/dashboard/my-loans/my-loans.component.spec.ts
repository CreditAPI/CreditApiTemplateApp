import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLoansComponent } from './my-loans.component';

describe('MyLoansComponent', () => {
  let component: MyLoansComponent;
  let fixture: ComponentFixture<MyLoansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyLoansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
