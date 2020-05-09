import { Component, OnInit } from '@angular/core';
import CreditApi from 'credit-api';
import { AppToastService } from './../../services/app-toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-pwd',
  templateUrl: './change-pwd.component.html',
  styleUrls: ['./change-pwd.component.scss']
})
export class ChangePwdComponent implements OnInit {

  constructor(private toast: AppToastService,private router: Router) { }

  ngOnInit(): void {
  }
  changePassword(old_password,new_password,repeat_new_password){
    if (new_password!=repeat_new_password) {
      this.toast.show($localize`Error`,'New passwords not match','bg-danger text-light');
      return;
    }
    CreditApi.changePassword(old_password,new_password).then(res=>{
      CreditApi.logout();
      this.router.navigate(['/login']); 
      this.toast.show($localize`Success`,res.result,'bg-success text-light');
    }).catch(err=>{
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    });
  }

}
