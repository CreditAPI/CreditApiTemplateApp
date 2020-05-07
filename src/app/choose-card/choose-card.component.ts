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
  cards;
  choosed;
  wait=true;
  pageloadedat;
  queryparams={};
  loading=false;
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
      this.loadCards();
    }
  }

  loadCards(){
    CreditApi.getCards(true).then((cards)=>{
      if (this.queryparams['wait']!==undefined) {     
          this.wait=true;
          setTimeout(()=> {this.loadCards()}, 3000);
          var now=new Date();
          if ((cards.length>0)&&((now.getTime()-this.pageloadedat.getTime())>7000)) {
            delete(this.queryparams['wait']);//wait some time before card will be connected
          } else if ((cards.length==0)&&((now.getTime()-this.pageloadedat.getTime())>40000)) {
            delete(this.queryparams['wait']);//will wait longer if user have no cards
          }
      } else if (!CreditApi.User.verificationFinished) {
        this.router.navigate(['/verification']);
      }  else {
        this.cards=cards;
        this.wait=false;
      }
    }).catch(err=>{
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    }); 
  }

  next(){
    if (!this.choosed)
      this.toast.show($localize`Error`,$localize`Please, choose an option`,'bg-danger text-light');
    else if (this.choosed=='new') {
      this.loading=true;
      CreditApi.linkCard(environment.MyUrl+'/choosecard?wait').then((url)=>{
        this.loading=false;
        console.log('REDIRECT TO '+url);
        window.location.href=url; 
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
          case 33:
            CreditApi.getCreditProduct(localStorage.getItem('product')).then(credit_product=>{
              this.router.navigate(['/document/sign/',credit_product.KI_agreement_name,'']);
            }).catch(err=>{
              this.loading=false;
              this.toast.show($localize`Error`,err.message,'bg-danger text-light');
            });
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
}
