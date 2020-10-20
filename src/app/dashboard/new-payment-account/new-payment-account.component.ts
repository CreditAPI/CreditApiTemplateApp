import { Component, OnInit } from '@angular/core';
import CreditApi from 'credit-api';
import { AppToastService } from 'src/app/services/app-toast.service';
import { Router } from '@angular/router';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-new-payment-account',
  templateUrl: './new-payment-account.component.html',
  styleUrls: ['./new-payment-account.component.scss']
})
export class NewPaymentAccountComponent implements OnInit {
  payment_providers;
  provider_label;
  provider_manual_fields;
  provider_save_url;
  constructor(private toast: AppToastService,private router: Router) { }

  ngOnInit(): void {
    CreditApi.getPaymentProviders().then((payment_providers)=>{
      if (payment_providers.length==1){
        this.newPaymentAccount(payment_providers[0]);
      }
      else
        this.payment_providers=payment_providers;
    }).catch(err=>{
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    }); 
  }

  newPaymentAccount(provider){
    CreditApi.linkPaymentAccount(environment.MyUrl+'/dashboard',provider.objectId).then((result)=>{
      if (result.type=='external') {
        window.location.href=result.url;
      } else if (result.type=='manual') {
        this.provider_label=provider.label;
        this.provider_manual_fields=result.fields;
        this.provider_save_url=result.url;
      } else {
        this.toast.show($localize`Error`,$localize`Unknow provider type: `+result.type,'bg-danger text-light');
      }
    }).catch(err=>{
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    });
  }

  onSave(res,parent){
    this.toast.show($localize`Successfull`,$localize`Payment account successfully linked`,'bg-success text-light');
    this.router.navigate(['/dashboard']);
    CreditApi.getPaymentAccounts(true);
    //localStorage.setItem('choosed_card',res.objectId);
    //console.log("SAVED",res);
  }

}
