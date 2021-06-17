import { Component, OnInit } from '@angular/core';
import CreditApi from 'credit-api';
import { AppToastService } from './../services/app-toast.service';
import { environment } from './../../environments/environment';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-choose-card',
  templateUrl: './choose-card.component.html',
  styleUrls: ['./choose-card.component.scss']
})
export class ChooseCardComponent implements OnInit {
  payment_accounts;
  choosed;
  wait=true;
  pageloadedat;
  queryparams={};
  loading=false;


  payment_providers=[];
  provider_manual_fields;
  provider_label;
  provider_save_url;


  constructor(private toast: AppToastService,private router: Router,private location: Location) { }

  ngOnInit(): void {
    this.queryparams=this.getQueryParameters();
    this.pageloadedat=new Date();
    if (!localStorage.getItem('amount')) {
      this.router.navigate(['/dashboard']);
    } else if (!CreditApi.User) {
      this.router.navigate(['/login']);
    } else if (localStorage.getItem('choosed_card')) {
      this.createNewLoanApplication();
    } else {
      this.loadPaymentAccounts();
      this.loadPaymentProviders();
    }
  }

  loadPaymentAccounts(){
    console.log(environment["DisableVerification"]);
    CreditApi.getPayoutAccountsOnly().then((payment_accounts)=>{
      if (this.queryparams['wait']!==undefined) {     
          this.wait=true;
          setTimeout(()=> {this.loadPaymentAccounts()}, 3000);
          var now=new Date();
          if ((payment_accounts.length>0)&&((now.getTime()-this.pageloadedat.getTime())>7000)) {
            delete(this.queryparams['wait']);//wait some time before card will be connected
          } else if ((payment_accounts.length==0)&&((now.getTime()-this.pageloadedat.getTime())>40000)) {
            delete(this.queryparams['wait']);//will wait longer if user have no cards
          }
      } else if ((!CreditApi.User.verificationFinished)&&(!environment["DisableVerification"])) { 
        this.router.navigate(['/verification']);
      } else {
        this.payment_accounts=payment_accounts;
        this.wait=false;
      }
    }).catch(err=>{
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    }); 
  }

  loadPaymentProviders(){
    CreditApi.getPayoutProvidersOnly().then((payment_providers)=>{
      this.payment_providers=payment_providers;
    });
  }

  next(){
    if (!this.choosed) {
      this.toast.show($localize`Error`,$localize`Please, choose an option`,'bg-danger text-light');
      return;
    }
    let is_new=this.choosed.indexOf("new_")==-1?false:true;
    if (is_new) {
      let provider_id=this.choosed.substr(4);
      this.loading=true;
      CreditApi.linkPaymentAccount(environment.MyUrl+'/choosecard?wait',provider_id).then((result)=>{
        if (result.type=='external') {
          window.location.href=result.url;
        } else if (result.type=='manual') {
          //this.provider_label=provider.label;
          this.provider_manual_fields=result.fields;
          this.provider_save_url=result.url;
        } else {
          this.toast.show($localize`Error`,$localize`Unknow provider type: `+result.type,'bg-danger text-light');
        }
        this.loading=false;
      }).catch(err=>{
        this.loading=false;
        this.toast.show($localize`Error`,err.message,'bg-danger text-light');
      });
    } else {
      localStorage.setItem('choosed_card',this.choosed);
      this.createNewLoanApplication();
    }
  }

  createNewLoanApplication(){
    if (localStorage.getItem('amount')) {
      this.loading=true;
      CreditApi.newLoan(localStorage.getItem('product'),localStorage.getItem('amount'),localStorage.getItem('term'),localStorage.getItem('choosed_card')).then(loan=>{ 
        localStorage.removeItem('amount');
        localStorage.removeItem('term');
        localStorage.removeItem('product');
        localStorage.removeItem('choosed_card');
        this.router.navigate(['/document/sign/',loan.contract_name,loan.objectId]);
      }).catch(err=>{
        console.log(err);
        switch(err.code){
          case 30:
            this.router.navigate(['/wizard']);
            this.toast.show($localize`Error`,err.message,'bg-danger text-light');
            break;
          case 31:
            this.router.navigate(['/wizard']);
            break;
          case 33:
          case 34:
            CreditApi.getCreditProduct(localStorage.getItem('product')).then(credit_product=>{
              this.router.navigate(['/document/sign/',credit_product.KI_agreement_name,'']);
            }).catch(err=>{
              this.loading=false;
              this.toast.show($localize`Error`,err.message,'bg-danger text-light');
            });
            break;
          case 37:
              this.router.navigate(['/dashboard']);
              this.toast.show($localize`Error`,err.message,'bg-danger text-light');
              break;
          case 38:
              localStorage.removeItem('choosed_card');
              this.createNewLoanApplication();
              break;
          default:
            this.loading=false;
            this.toast.show($localize`Error`,err.message,'bg-danger text-light');
        }
      });
    } else
      this.router.navigate(['/dashboard']);
  }

  getQueryParameters(){
    var parameters={};
    var query=this.location.path().split('?');
    if (query[1]) {
      const regex1=/([^&=]+)=?([^&]*)/g
      var parts=query[1].match(regex1);
      parts.forEach(part=> {
        var kv=part.split('=');
        parameters[kv[0]]=kv[1]||null;
      });
    }
    return parameters;
  }

  onNewAccountSave(res,parent){
    localStorage.setItem('choosed_card',res.objectId);
    this.router.navigate(['/']).then(()=>this.router.navigate(['/choosecard']));
  }
}
