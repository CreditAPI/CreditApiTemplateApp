import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppToastService } from './../../services/app-toast.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  @Input() creditProduct;
  amount;
  return_amount;
  return_date;
  payments_count=1;
  currency=$localize`:@@calculator.currency:rub`;
  term;
  term_type;
  loading=true;

  term_types={'1': $localize`:@@calculator.type_term.days:days`,'2': $localize`:@@calculator.type_term.weeks:weeks`,'3': $localize`:@@calculator.type_term.months:months`};

  constructor(private toast: AppToastService,private router: Router) { }

  ngOnInit(): void {
    this.amount=Math.ceil((this.creditProduct.min_amount+this.creditProduct.max_amount)/(2*this.creditProduct.step_amount))*this.creditProduct.step_amount;
    this.term=Math.ceil((this.creditProduct.min_term+this.creditProduct.max_term)/(2*this.creditProduct.step_term))*this.creditProduct.step_term;
    if (this.term_types[this.creditProduct.type_term])
      this.term_type=' '+this.term_types[this.creditProduct.type_term];
    this.calculateReturn();
    this.loading=false;
  }

  new_application(){
    if (this.amount<this.creditProduct.min_amount)
      this.amount=this.creditProduct.min_amount;
    if (this.amount>this.creditProduct.max_amount)
      this.amount=this.creditProduct.max_amount;
    if (this.term<this.creditProduct.min_term)
      this.term=this.creditProduct.min_term;
    if (this.term>this.creditProduct.max_term)
      this.term=this.creditProduct.max_term;

    if ((this.amount/this.creditProduct.step_amount)!=Math.ceil(this.amount/this.creditProduct.step_amount))
      this.amount=Math.ceil(this.amount/this.creditProduct.step_amount)*this.creditProduct.step_amount;
    if ((this.term/this.creditProduct.step_term)!=Math.ceil(this.term/this.creditProduct.step_term))
      this.term=Math.ceil(this.term/this.creditProduct.step_term)*this.creditProduct.step_term;

    localStorage.setItem('amount',this.amount);
    localStorage.setItem('term',this.term);
    localStorage.setItem('product',this.creditProduct.objectId);
    this.router.navigate(['/choosecard']);
  }

  calculateReturn() {
    let rate=this.creditProduct.interest_rate;
    switch(parseInt(this.creditProduct.type_term)) {
        case 1: //days
          rate=rate/365;
          if (this.creditProduct.frequency!=1) {
            this.toast.show($localize`Error`,$localize`:@@errors.credit_product_error:Credit product error`+':frequency','bg-danger text-light');
          } else
            this.return_date=new Date(new Date().getTime()+this.term*24*60*60*1000);
          break;
        case 2: //weeks
          this.return_date=new Date(new Date().getTime()+this.term*7*24*60*60*1000);
          switch(parseInt(this.creditProduct.frequency)) {
            case 2: //weekly
              rate=rate*7/365;
              this.payments_count=this.term;
              break;
            case 3: //beweekly
              rate=rate*14/365;
              if ((this.term%2)>0) {
                this.toast.show($localize`Error`,$localize`:@@errors.credit_product_error:Credit product error`+':step','bg-danger text-light');
              } else
                this.payments_count=this.term/2;
              break;
            case 4: //means montly but really every 4 weeks
              rate=rate*28/365;
              if ((this.term%4)>0) {
                this.toast.show($localize`Error`,$localize`:@@errors.credit_product_error:Credit product error`+':step','bg-danger text-light');
              } else
                this.payments_count=this.term/4;
              break;
            default:
              this.toast.show($localize`Error`,$localize`:@@errors.credit_product_error:Credit product error`+':frequency','bg-danger text-light');
          }
          break;
        case 3: //months
          this.return_date=new Date(new Date().setMonth(new Date().getMonth()+this.term));
          switch(parseInt(this.creditProduct.frequency)) {
            case 2: //weekly
              rate=rate*7/365;
              this.payments_count= Math.round(this.date_diff(this.return_date,new Date())/7);
							this.return_date=new Date(new Date().getTime()+this.payments_count*7*24*60*60*1000);
							break;
            case 3: //beweekly
              rate=rate*14/365;
              this.payments_count= Math.round(this.date_diff(this.return_date,new Date())/14);
              this.return_date=new Date(new Date().getTime()+this.payments_count*14*24*60*60*1000);
							break;
            case 4: //monthly
              rate=rate/12;
              this.payments_count=this.term;
							this.return_date=new Date(new Date().setMonth(new Date().getMonth()+this.term));
							break;
						default:
              this.toast.show($localize`Error`,$localize`:@@errors.credit_product_error:Credit product error`+':frequency','bg-danger text-light');
				  }
          break;
        default:
          this.toast.show($localize`Error`,$localize`:@@errors.credit_product_error:Credit product error`+':type_term','bg-danger text-light');
    }
    if (this.payments_count==1) {
      this.return_amount=(this.amount+this.amount*this.term*rate/100).toFixed(0);
    } else 
      this.return_amount=this.getPaymentAmount(this.amount,rate/100,this.payments_count).toFixed(0);
  }

  date_diff(d1,d2) {
		return Math.ceil(d1 - d2) / (1000 * 60 * 60 * 24) - (d1.getTimezoneOffset() - d2.getTimezoneOffset()) / (60 * 24);
	}

  getPaymentAmount(S,p,n) {
		return S*p/(1-Math.pow(1+p,-n));
  }
  
  getTranslatedTerm(term,type){
    let types={1:[$localize`:@@one_day:day`,$localize`:@@two_days:days`,$localize`:@@many_days:days`],
               2:[$localize`:@@one_week:week`,$localize`:@@two_weeks:weeks`,$localize`:@@many_weeks:weeks`],
               3:[$localize`:@@one_month:month`,$localize`:@@two_months:months`,$localize`:@@many_months:months`]};
    
    let plural=(term%10==1 && term%100!=11 ? 0 : term%10>=2 && term%10<=4 && (term%100<10 || term%100>=20) ? 1 : 2);
    return types[type][plural];
  }
}
