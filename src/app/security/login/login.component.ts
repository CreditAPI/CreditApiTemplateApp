import { Component, OnInit } from '@angular/core';
import CreditApi from 'credit-api';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AppToastService } from './../../services/app-toast.service';
import { Router } from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading=false;
  form;
  constructor(private fb: FormBuilder,private toast: AppToastService,private router: Router,public modalService: NgbModal) { }

  ngOnInit() {
    this.form = this.fb.group({username:['', Validators.required],password:['', Validators.required]});
  }

  doLogin() {
    this.loading=true;
    let username=this.form.get('username').value;
    if (username.substr(0,1)=="+") username=username.substr(1); 
    else if (username.substr(0,1)=="8") username='7'+username.substr(1); 
    CreditApi.login(username,this.form.get('password').value).then(res=>{
      this.loading=false;
      if (localStorage.getItem('amount'))
        this.router.navigate(['/choosecard']);
      else
        this.router.navigate(['/dashboard']);
    }).catch(err=>{
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
      this.loading=false;
    });
  }

  resetPassword(email){
    if (!this.validateEmail(email)) {
      this.toast.show($localize`Error`,'Invalid email','bg-danger text-light');
      return;
    }
    CreditApi.requestPasswordReset(email).then(res=>{
      this.modalService.dismissAll();
      this.toast.show($localize`Success`,'Password reset requested. Please check your inbox','bg-success text-light');
    }).catch(err=>{
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    });
  }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}
