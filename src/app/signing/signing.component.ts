import { Component, OnInit } from '@angular/core';
import CreditApi from 'credit-api';
import { AppToastService } from './../services/app-toast.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signing',
  templateUrl: './signing.component.html',
  styleUrls: ['./signing.component.scss']
})
export class SigningComponent implements OnInit {
  name;
  loading=true;
  show_buttons=false;
  content;
  app_id;
  constructor(private toast: AppToastService,private router: Router,private _Activatedroute:ActivatedRoute) { }

  ngOnInit(): void {
    this.getContent().then(content=>{
      this.content=content;
      this.show_buttons=true;
    }).catch(err=>{
      this.content=err.message;
    });
  }

  getContent(){
    this.loading=true;
    return new Promise((resolve,reject)=>{
      this._Activatedroute.paramMap.subscribe(params => { 
        if ((params.get('app_id'))&&((params.get('app_id'))!=''))
          this.app_id=params.get('app_id');
        if (params.get('name')) {
          this.name=params.get('name');
          CreditApi.getDocument(params.get('name')).then((content)=>{
            this.loading=false;
            resolve(content);
          }).catch(err=>{
            this.loading=false;
            reject(err);
          }); 
        } else {
          this.loading=false;
          resolve({status:404,message:$localize`No document name provided`});
        }
      });
    });
  }

  sign(agree){
    if (agree.checked) {
      CreditApi.signDocument(this.name).then(res=>{
        if (this.app_id)
          this.router.navigate(['/application',this.app_id]);
        else
          this.router.navigate(['/choosecard']);
      }).catch(err=>{
        this.toast.show($localize`Error`,err.message,'bg-danger text-light');
      });
    } else 
      this.toast.show($localize`Error`,'Please read with documents and check agree flag','bg-danger text-light');
  } 
}
