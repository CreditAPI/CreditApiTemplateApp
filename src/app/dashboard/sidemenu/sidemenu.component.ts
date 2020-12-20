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
  current_date;
  timezone;
  constructor(private toast: AppToastService,private router: Router) { }

  ngOnInit(): void {
    this.timezone=environment.TimeZone;
    CreditApi.getPaymentAccounts();
    CreditApi.makeRequest('POST','/functions/current_date').then(res=>{
      console.log("Current time",res.result);
      this.current_date=res.result.iso;
    }).catch(err=>{
      console.log("Error getting current time",err);
    })
  }

  logout(){
    CreditApi.logout();
    this.router.navigate(['login']);
  }
}
