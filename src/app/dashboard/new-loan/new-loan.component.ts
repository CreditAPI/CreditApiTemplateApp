import { Component, OnInit } from '@angular/core';
import CreditApi from 'credit-api';
import { AppToastService } from './../../services/app-toast.service';

@Component({
  selector: 'app-new-loan',
  templateUrl: './new-loan.component.html',
  styleUrls: ['./new-loan.component.scss']
})
export class NewLoanComponent implements OnInit {
  creditProduct;
  creditProducts;
  constructor(private toast: AppToastService) { }

  ngOnInit(): void {
    CreditApi.getCreditProducts().then(credit_products=>{ 
      if (credit_products.length==1)
        this.creditProduct=credit_products[0];
      this.creditProducts=credit_products;
    }).catch(err=>{
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    });
  }

  show(i) {
    this.creditProduct=this.creditProducts[i];
  }
}
