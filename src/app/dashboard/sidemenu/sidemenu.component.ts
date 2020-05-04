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
  cards;
  show_messages=environment['ShowMessages'];
  constructor(private toast: AppToastService,private router: Router) {  }

  ngOnInit(): void {
    CreditApi.getCards().then((cards)=>{
      this.cards=cards;
    });
  }

  newCard(){
    CreditApi.linkCard(environment.MyUrl+'/dashboard').then((url)=>{
      window.location.href=url;
    }).catch(err=>{
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    });
  }

  logout(){
    CreditApi.logout();
    this.router.navigate(['login']);
  }
}
