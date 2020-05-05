import { Component, OnInit } from '@angular/core';
import CreditApi from 'credit-api';
import { AppToastService } from './../services/app-toast.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {
  creditApi=CreditApi;
  app_id;
  loan;
  loading=false;
  constructor(private toast: AppToastService,private router: Router,private _Activatedroute:ActivatedRoute,private modalService: NgbModal) { }

  ngOnInit(): void {
    this._Activatedroute.paramMap.subscribe(params => { 
      this.app_id=params.get('id');
      this.updateLoanStatus();
    });
  }

  updateLoanStatus(){
    CreditApi.getLoan(this.app_id).then(loan=>{
      this.loan=loan;
      if ([0,20,21].includes(loan.status)) {
        setTimeout(()=>{this.updateLoanStatus();},3000);
      } else if (loan.status==25) {
        setTimeout(()=>{this.updateLoanStatus();},30000);
      } else if (loan.status==-1) {
        this.router.navigate(['/document/sign/',loan.contract_name,loan.objectId]);
      }
    }).catch(err=>{
      console.log('ERROR',err);
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    });
  }

  openCancelModal(modal) {
    this.modalService.open(modal);
  }

  cancel(id){
    CreditApi.cancelLoan(id).then((res)=>{
      this.toast.show($localize`Successfull`,$localize`Loan application successfully canceled`,'bg-success text-light');
      this.modalService.dismissAll();
      this.router.navigate(['/dashboard/myloans']); 
    }).catch(err=>{
      this.modalService.dismissAll();
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    }); 
  }

  getMoney(){
    this.loading=true;
    CreditApi.getMoney(this.app_id).then(loan=>{
      this.loading=false;
      this.router.navigate(['/dashboard']);
    }).catch(err=>{
      this.loading=false;
      console.log('ERROR',err);
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    });
  }
}
