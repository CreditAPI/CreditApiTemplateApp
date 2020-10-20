import { Component, OnInit } from '@angular/core';
import CreditApi from 'credit-api';
import { AppToastService } from './../services/app-toast.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { DocumentModalService } from './../services/document-modal.service';

@Component({
  selector: 'app-signing',
  templateUrl: './signing.component.html',
  styleUrls: ['./signing.component.scss']
})
export class SigningComponent implements OnInit {
  creditApi=CreditApi;
  name;
  loading=true;
  show_buttons=false;
  content;
  app_id;
  sms_trys=0;
  addons=[];
  constructor(private toast: AppToastService,private router: Router,private _Activatedroute:ActivatedRoute,private modalService: NgbModal,public ms: DocumentModalService) { }

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
        if ((params.get('app_id'))&&((params.get('app_id'))!='')) {
          this.app_id=params.get('app_id');
          CreditApi.getLoan(this.app_id).then(loan=>{
            if (loan.available_addons) this.addons=loan.available_addons;
          }); 
        }
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

  sign(agree,modal){
    let data=null;
    if (this.addons.length>0) {
      data={addons:[]};
      this.addons.forEach(addon=>{
        if (addon.checked) data.addons.push(addon);
      });
    }
    if (agree.checked) {
      CreditApi.signDocument(this.name,data).then(res=>{
        if (this.app_id)
          this.router.navigate(['/application',this.app_id]);
        else
          this.router.navigate(['/choosecard']);
      }).catch(err=>{
        switch(err.code) {
           case 40:
             CreditApi.sendSMSforSigning(this.name).then(res=>{
               this.sms_trys=0;
               this.modalService.open(modal);
             }).catch(err=>{
               switch(err.code) {
                 case 41:
                   this.modalService.open(modal);
                   break;
                 default:
                  this.toast.show($localize`Error`,err.message,'bg-danger text-light');
               }
             }); 
             break;
           default:
             this.toast.show($localize`Error`,err.message,'bg-danger text-light');
        }
      });
    } else 
      this.toast.show($localize`Error`,'Please read with documents and check agree flag','bg-danger text-light');
  } 

  signWithSMS(code) {
    if (code.trim()=='') {
      this.toast.show($localize`Error`,'Please, enter the code','bg-danger text-light');
      return;
    }
    let data={'sms_code':code};
    if (this.addons.length>0) {
      data['addons']=[];
      this.addons.forEach(addon=>{
        if (addon.checked) data['addons'].push(addon);
      });
    }
    CreditApi.signDocument(this.name,data).then(res=>{
      this.modalService.dismissAll();
      if (this.app_id)
        this.router.navigate(['/application',this.app_id]);
      else
        this.router.navigate(['/choosecard']);
    }).catch(err=>{
        switch(err.code) {
          case 42:
            if (this.sms_trys>=3) {
              this.toast.show($localize`Error`,'Too many attempts','bg-danger text-light');
              this.modalService.dismissAll();
              break;
            }
          case 43:
            this.sms_trys++;
          default:
            this.toast.show($localize`Error`,err.message,'bg-danger text-light');
        }
    });
  }
}
