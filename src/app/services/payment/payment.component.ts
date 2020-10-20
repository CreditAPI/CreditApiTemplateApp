import { Component, OnInit, Input } from '@angular/core';
import CreditApi from 'credit-api';
//import { AppToastService } from './../../services/app-toast.service';
import { environment } from './../../../environments/environment';
import { AppToastService } from '../app-toast.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @Input() loan;
  @Input() dismiss;
  @Input() action;
  amount;

  next_btn_name=$localize`:@@payment.modal.next:Pay`;

  step=2;
  wait=true;
  error;
  payment_amounts;
  payment_accounts=[];
  payment_providers=[];
  choosed;
  manual_provider_fields;
  manual_provider_url;
  message;
  step_1_enabled=true;
  step_4_show_close_btn_only=false;
  missed_parameters;

  constructor(private toast: AppToastService) { }

  ngOnInit(): void {
    this.updatePaymentAmounts();
    this.updatePaymentAccounts();
  }

  updatePaymentAmounts(){
    CreditApi.calculatePayment(this.loan.objectId).then(res=>{
      this.payment_amounts=res.result;
      switch (this.action) {
        case 'early': 
          this.payment_amounts.min=this.payment_amounts.current;
          this.amount=res.result.full.toFixed(2);
          this.step_1_enabled=true;
          this.step=1;
          break;
        case 'extend':
          this.amount=res.result.min.toFixed(2);
          this.step_1_enabled=false;
          this.step=2;
          break;
        case 'pay_current':
          this.amount=res.result.current.toFixed(2);
          this.step_1_enabled=false;
          this.step=2;
          break;
      }
      this.wait=false;
    }).catch(err=>{
      this.wait=false;
      this.error=err.message;
    })
  }

  updatePaymentAccounts(){
    CreditApi.getPaymentAccounts().then((payment_accounts)=>{
      this.payment_accounts=payment_accounts; 
      return CreditApi.getPaymentProviders();
    }).then(payment_providers=>{
      this.payment_providers=payment_providers;
    }).catch(err=>{
      this.wait=false;
      this.error=err.message;
    }); 
  }

  goToStep2(){
    if (this.amount>this.payment_amounts.full) this.amount=this.payment_amounts.full;
    if (this.amount<this.payment_amounts.min) this.amount=this.payment_amounts.min;
    this.step=2;
  }


  pay(missedform=null){
    var extra={};
    if (missedform) {
      for (let i = 0; i< missedform.elements.length ; i++)  extra[missedform.elements[i].name]=missedform.elements[i].value;
    }
    if (!this.choosed) {
      this.toast.show($localize`Error`,$localize`Please, choose an option`,'bg-danger text-light');
      return;
    }
    this.wait=true;
    let account_id=null;
    let provider_id=null;
    let is_new=this.choosed.indexOf("new_")==-1?false:true;
    if (is_new){
      provider_id=this.choosed.substr(4);
    } else {
      account_id=this.choosed;
    }
      CreditApi.makePayment(this.loan.id,this.amount,this.action=='extend'?true:null,provider_id,account_id,environment.MyUrl+'/dashboard?wait',extra).then(result=>{
        switch(result.type) {
          case 'external':
            window.location.href=result.url;
            break;
          case 'manual':
            this.manual_provider_url=result.url;
            this.manual_provider_fields=result.fields;
            this.manual_provider_fields.forEach(field=>{
              if (field['type']=='hidden') {
                switch(field['name']) {
                  case 'loan':
                    field.value=this.loan.objectId;
                    break;       
                }
              }
            });
            this.step=3;
            this.wait=false;
            break;
          case 'message':
            this.message=result.content||$localize`Payment provider error`;
            this.step=4;
            this.wait=false;
            break;
          case 'missed':
            this.missed_parameters=result.fields;
            this.step=5;
            this.wait=false;
            break;
          case 'in process':
            this.step=4;
            this.updateTransactionStatus(result.transaction,this);
            break;
          case 'done':
            this.message=$localize`:@@payment.modal.success:Success`;
            this.step=4;
            this.step_4_show_close_btn_only=true;
            this.wait=false;
            break;
          default: 
            this.error=$localize`Payment provider error`;
            this.wait=false;
        }
      }).catch(err=>{
        this.wait=false;
        this.error=err.message;
      }); 
  }

  onManualPayment(res,parent){
    parent.wait=true;
    parent.step=4;
    parent.updateTransactionStatus(res,parent);
  }


  onManualError(err,parent){
    parent.wait=false;
    parent.error=err.message||$localize`Internal server error`;
  }

  onManualPaymentBackClick(parent) {
    parent.step=2;
  }

  updateTransactionStatus(res,parent){
    setTimeout(()=>{
      //console.log('Updating transaction '+res.objectId);
      CreditApi.getTransaction(res.objectId).then(transaction=>{
        switch(transaction.status) {
          case 'created':
          case 'in process':
            parent.updateTransactionStatus(transaction,parent);
            break;
          case 'done':
            parent.wait=false;
            parent.message=$localize`:@@payment.modal.success:Success`;
            parent.step_4_show_close_btn_only=true;
            break;
          case 'error':
            parent.error=transaction.error||$localize`:@@payment.modal.transaction_error:Transaction error`;
            parent.wait=false;
            break;
          default:
            parent.error=transaction.error||$localize`:@@payment.modal.unknow_transaction_status:Unknow transaction status`;
            parent.wait=false;
        }
      })
    },3000);
  }
}
