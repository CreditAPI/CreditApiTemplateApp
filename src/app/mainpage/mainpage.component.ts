import { Component, OnInit } from '@angular/core';
import CreditApi from 'credit-api';
import Mainpage from './mainpage.js';
import { AppToastService } from './../services/app-toast.service';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent implements OnInit {
  public content=Mainpage.content;
  public additional_content=Mainpage.additional_content;
  creditProduct;
  constructor(private toast: AppToastService) { }

  ngOnInit(): void {
    CreditApi.getCreditProducts().then(credit_products=>{ 
        this.creditProduct=credit_products[0];
    }).catch(err=>{
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    });
  }
  setContent(content) {
    this.content=content;
  }
}
