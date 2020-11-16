import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChooseCardComponent } from './choose-card.component';

describe('ChooseCardComponent', () => {
  let component: ChooseCardComponent;
  let fixture: ComponentFixture<ChooseCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
