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
  has_update_requests=false;
  loans;
  statuses={'PREVIEW':$localize`:@@loan_status.preview:Not sended`,
            'NEW':$localize`:@@loan_status.new:Not sended`,
            'CHECK_BEGIN':$localize`:@@loan_status.checking:Checking`,
            'CHECK_PROCESS':$localize`:@@loan_status.checking:Checking`,
            'NEED_MANUAL':$localize`:@@loan_status.checking:Checking`,
            'DECLINED':$localize`:@@loan_status.declined:Declined`,
            'DECLINED_AFTER_MANUAL':$localize`:@@loan_status.declined:Declined`,
            'CANCELED':$localize`:@@loan_status.canceled:Canceled`,
            'CANCELED_TIMEOUT':$localize`:@@loan_status.canceled:Canceled`,
            'CANCELED_AFTER_APPROVE':$localize`:@@loan_status.canceled:Canceled`,
            'APPROVED':$localize`:@@loan_status.approved:Approved`,
            'PREAPPROVED':$localize`:@@loan_status.approved:Pre-approved`,
            'ACTIVE':$localize`:@@loan_status.active:Active`,
            'PREACTIVE':$localize`:@@loan_status.active:Pre-active`,
            'TRANSFER_IN_PROGRESS':$localize`:@@loan_status.wiring_in_process:Wiring`,
            'SENDING_FAILED':$localize`:@@loan_status.sending_failed:Error`,
            'PAID_INFULL':$localize`:@@loan_status.paid:Paid`};
  constructor(private toast: AppToastService) { }

  ngOnInit(): void {
    CreditApi.getLoans().then(loans=>{
      this.loans=loans; 
      this.has_active=loans.some(loan => {
        return ((!loan.closed) && (loan.status>0));
      });
      this.loading=false;
    }).catch(err=>{
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    });
    this.checkUnprocessedRequests();
  }

  checkUnprocessedRequests(){
    CreditApi.getUnprocessedRequestsForUpdateUserdata().then((cdr)=>{
      if (cdr.results.length>0) {
        this.has_update_requests=true;
        setTimeout(()=>{
          this.checkUnprocessedRequests();
        },10000);
      } else
        this.has_update_requests=false;
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
}
