import { Component, OnInit } from '@angular/core';
import CreditApi from 'credit-api';
import { Router } from '@angular/router';
import { AppToastService } from './../services/app-toast.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
  loading=false;
  user;
  wait=true;
  constructor(private toast: AppToastService,private router: Router) { }

  ngOnInit(): void {
    this.user=CreditApi.User;
    if ((CreditApi.User)&&(CreditApi.User.verificationFinished)) {
      if (localStorage.getItem('amount')) {
        this.router.navigate(['/choosecard']);
      } else
        this.router.navigate(['/dashboard']);
    } else if (((CreditApi.User))&&(!CreditApi.User.verificationStarted)) {
      CreditApi.sendVerificationCode().then((res)=>{
        CreditApi.User.verificationStarted=true;
        this.user=CreditApi.User;
        this.wait=false;
      }).catch(err=>{
        console.log(err);
        this.toast.show($localize`Error`,err.message,'bg-danger text-light');
        if ((err.code)&&(err.code==11)) {
          this.router.navigate(['/wizard']);
        }
      });
    } else if (((CreditApi.User))&&(!CreditApi.User.verificationFinished)) {
      this.wait=false;
    }
  }

  check_sms_code(sms_code){
    this.loading=true;
    CreditApi.checkVerificationCode(sms_code).then((res)=>{
      console.log(res);
      this.loading=false;
      this.wait_until_finished();
    }).catch(err=>{
      console.log(err);
      this.loading=false;
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    });
  }

  wait_until_finished(){
    this.wait=true;
    CreditApi.refreshUser().then(user=>{
      if (user.verificationFinished)
        this.router.navigate(['/choosecard']);
      else
        setTimeout(this.wait_until_finished,3000);
    }).catch(err=>{
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    });
  }  
}
