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
  term;
  loading=true;

  constructor(private toast: AppToastService,private router: Router) { }

  ngOnInit(): void {
    this.amount=Math.ceil((this.creditProduct.min_amount+this.creditProduct.max_amount)/(2*this.creditProduct.step_amount))*this.creditProduct.step_amount;
    this.term=Math.ceil((this.creditProduct.min_term+this.creditProduct.max_term)/(2*this.creditProduct.step_term))*this.creditProduct.step_term;
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

}
