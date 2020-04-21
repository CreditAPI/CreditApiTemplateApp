import { Component, OnInit } from '@angular/core';
import CreditApi from 'credit-api';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AppToastService } from './../../services/app-toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading=false;
  form;
  constructor(private fb: FormBuilder,private toast: AppToastService,private router: Router) { }

  ngOnInit() {
    this.form = this.fb.group({username:['', Validators.required],password:['', Validators.required]});
  }

  doLogin() {
    this.loading=true;
    CreditApi.login(this.form.get('username').value,this.form.get('password').value).then(res=>{
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

}
