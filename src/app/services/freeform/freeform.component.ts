import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppToastService } from '../app-toast.service';
import { Router } from '@angular/router';
import CreditApi from 'credit-api';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-freeform',
  templateUrl: './freeform.component.html',
  styleUrls: ['./freeform.component.scss']
})
export class FreeformComponent implements OnInit {
  @Input() fields;
  @Input() url;
  @Input() callback;
  @Input() onErrorCallback;
  @Input() save_btn_name;
  @Input() back_btn_click;
  @Input() parent;
  @Input() btns_class;
  
  form;
  loading=false;
  
  constructor(private fb: FormBuilder,private toast: AppToastService,private router: Router) { }

  ngOnInit(): void {
    this.generateForm();
    if (!this.save_btn_name) this.save_btn_name=$localize`:@@freeform.buttons.save:Save`;
  }

  generateForm(){
    let formdata={};
    this.fields.forEach(field=>{
      var validators=[];
      if (field.required) {
        validators.push(Validators.required);
      }
      formdata[field.name]=[field.value||'',validators];
    })
    this.form = this.fb.group(formdata);
  }

  save(){
    if (!this.form.valid){
      this.toast.show($localize`Error`,"Please, correct mistakes",'bg-danger text-light');
      return;
    }
    this.loading=true;
    let inner_url=this.url.replace(environment.CreditApiHost,"");
    CreditApi.makeRequest("POST",inner_url,this.form.value).then(res=>{
      this.form.reset();
      this.loading=false;
      this.callback(res,this.parent);
    }).catch(err=>{
      this.onError(err);
      this.loading=false;
    })

  }

  onError(err){
    if (this.onErrorCallback)
      this.onErrorCallback(err,this.parent);
    else
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
  }

}
