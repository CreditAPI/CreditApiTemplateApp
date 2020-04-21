import { Component, OnInit } from '@angular/core';
import CreditApi from 'credit-api';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AppToastService } from './../../services/app-toast.service';
import { DocumentModalService } from './../../services/document-modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  loading=false;
  form;
  constructor(private fb: FormBuilder,private toast: AppToastService,private router: Router,public ms: DocumentModalService) { }

  ngOnInit() {
    this.form = this.fb.group({phone:['', Validators.required],email:['', Validators.required],password:['', Validators.required],agree_flag:['', Validators.required]});
  }

  doSignUp() {
    this.loading=true;
    CreditApi.signup(this.form.get('email').value,'7'+this.form.get('phone').value,this.form.get('password').value).then(res=>{
      this.loading=false;
      this.router.navigate(['/wizard']);
    }).catch(err=>{
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
      this.loading=false;
    });
  }
}
