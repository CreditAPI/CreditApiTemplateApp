import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import CreditApi from 'credit-api';
import { AppToastService } from './../../services/app-toast.service';
import { Router } from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payment-account',
  templateUrl: './payment-account.component.html',
  styleUrls: ['./payment-account.component.scss']
})
export class PaymentAccountComponent implements OnInit {
  payment_account;
  constructor(private _Activatedroute:ActivatedRoute,private toast: AppToastService,private router: Router,private modalService: NgbModal) { }

  ngOnInit(): void {
    this._Activatedroute.paramMap.subscribe(params => { 
      CreditApi.getPaymentAccounts().then((payment_accounts)=>{
        this.payment_account=payment_accounts[params.get('i')];
      }).catch(err=>{
        this.toast.show($localize`Error`,err.message,'bg-danger text-light');
      }); 
    });
  }

  open(content){
    this.modalService.open(content);
  }

  unlink(id){
    CreditApi.unlinkPaymentAccount(id).then((payment_accounts)=>{
      this.toast.show($localize`Successfull`,$localize`Payment account successfully unlinked`,'bg-success text-light');
      this.modalService.dismissAll();
      this.router.navigate(['/dashboard']); 
    }).catch(err=>{
      this.modalService.dismissAll();
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    }); 
  }

}
