import { Component, OnInit } from '@angular/core';
import CreditApi from 'credit-api';
import { AppToastService } from './../../services/app-toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-current-loan',
  templateUrl: './current-loan.component.html',
  styleUrls: ['./current-loan.component.scss']
})
export class CurrentLoanComponent implements OnInit {
  loan;
  constructor(private toast: AppToastService,private router: Router) { }

  ngOnInit(): void {
    CreditApi.getOpenedLoans().then(loans=>{
      if ((loans.length==0)||((loans[0].status<60))) {
        this.router.navigate(['/dashboard/myloans']); 
      } else  {
        this.loan=loans[0];
      }
    }).catch(err=>{
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    });
  }

}
