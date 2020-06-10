import { Component, OnInit } from '@angular/core';
import CreditApi from 'credit-api';
import { AppToastService } from './../../services/app-toast.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-current-loan',
  templateUrl: './current-loan.component.html',
  styleUrls: ['./current-loan.component.scss']
})
export class CurrentLoanComponent implements OnInit {
  loan;
  payment_schedule;
  payment_statuses={"scheduled":$localize`:@@dashboard.current_loan.payment_schedule.status.scheduled:scheduled`,
                    "delayed":$localize`:@@dashboard.current_loan.payment_schedule.status.delayed:delayed`,
                    "missed":$localize`:@@dashboard.current_loan.payment_schedule.status.missed:missed`,
                    "paid":$localize`:@@dashboard.current_loan.payment_schedule.status.paid:paid`};
  payment_action;
  date_to_allow_payment;
  transactions_in_process;
  constructor(private toast: AppToastService,private router: Router,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.date_to_allow_payment=new Date();
    this.date_to_allow_payment.setDate(this.date_to_allow_payment.getDate() - environment.DaysBeforePaymentAllowed||3 );
    CreditApi.getOpenedLoans().then(loans=>{
      if ((loans.length==0)||((loans[0].status<60))) {
        this.router.navigate(['/dashboard/myloans']); 
      } else  {
        this.loan=loans[0];
        this.updatePaymentSchedule();
        this.updateTransactionsInProcess()
      }
    }).catch(err=>{
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    });
  }

  getTranslatedTerm(term,type){
    let types={1:[$localize`:@@one_day:day`,$localize`:@@two_days:days`,$localize`:@@many_days:days`],
               2:[$localize`:@@one_week:week`,$localize`:@@two_weeks:weeks`,$localize`:@@many_weeks:weeks`],
               3:[$localize`:@@one_month:month`,$localize`:@@two_months:months`,$localize`:@@many_months:months`]};
    
    let plural=(term%10==1 && term%100!=11 ? 0 : term%10>=2 && term%10<=4 && (term%100<10 || term%100>=20) ? 1 : 2);
    return types[type][plural];
  }

  updatePaymentSchedule(){
    CreditApi.getPaymentSchedule(this.loan.objectId).then(ps=>{
      this.payment_schedule=ps;
    }).catch(err=>{
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    });
  }

  updateTransactionsInProcess(){
    CreditApi.getTransactionsInProcess(this.loan.objectId).then(trs=>{
      if ((trs.length==0)&&(this.transactions_in_process>0)) {
        this.updatePaymentSchedule();
      } else  if (trs.length>0) {
        setTimeout(()=>{
          this.updateTransactionsInProcess();
        },3000);
      }
      this.transactions_in_process=trs;
    }).catch(err=>{
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    });
  }


  openPaymentDialog(modal,payment_action="early"){
    this.payment_action=payment_action;
    this.modalService.open(modal).result.then((result) => {
        CreditApi.getLoan(this.loan.objectId).then(loan=>{
          this.loan=loan; 
          if (loan["closed"]) {
            this.router.navigate(['/dashboard/myloans']); 
            this.toast.show($localize`Success`,$localize`:@@dashboard.current_loan.loan_closed:Loan closed`,'bg-success text-light');
          }
          this.updatePaymentSchedule();
          this.updateTransactionsInProcess();
        }).catch(err=>{
          this.toast.show($localize`Error`,err.message,'bg-danger text-light');
        });
    }).catch(err=>{}) ;
  }

}
