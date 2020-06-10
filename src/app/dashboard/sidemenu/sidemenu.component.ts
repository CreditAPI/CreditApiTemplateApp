import { Component, OnInit } from '@angular/core';
import CreditApi from 'credit-api';
import { AppToastService } from './../../services/app-toast.service';
import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {
  creditApi=CreditApi;
  show_messages=environment['ShowMessages'];
  constructor(private toast: AppToastService,private router: Router) {  }

  ngOnInit(): void {
    CreditApi.getPaymentAccounts();
  }

  logout(){
    CreditApi.logout();
    this.router.navigate(['login']);
  }
}
