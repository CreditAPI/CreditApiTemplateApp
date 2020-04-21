import { Component, OnInit } from '@angular/core';
import CreditApi from 'credit-api';
import { AppToastService } from './../../services/app-toast.service';

@Component({
  selector: 'app-my-loans',
  templateUrl: './my-loans.component.html',
  styleUrls: ['./my-loans.component.scss']
})
export class MyLoansComponent implements OnInit {
  loading=true;
  has_active=false;
  loans;
  constructor(private toast: AppToastService) { }

  ngOnInit(): void {
    CreditApi.getLoans().then(loans=>{
      this.loans=loans; 
      this.has_active=loans.some(loan => {
        return false;//!loan.closed;
      });
      this.loading=false;
    }).catch(err=>{
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    });
  }

}
